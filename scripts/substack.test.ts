import assert from 'node:assert/strict';
import { test } from 'node:test';
import { site } from '../lib/site';
import { parseSubstackFeed } from '../lib/sources/substack';

const origin = new URL(site.substackFeed).origin;
const date = 'Tue, 04 Mar 2025 10:00:00 GMT';

function feed(items = ''): string {
  return `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>${items}</channel></rss>`;
}

function item(fields: { title?: string; link?: string; pubDate?: string; extra?: string } = {}): string {
  return `<item>
    <title>${fields.title ?? 'Streaming &amp; Batch: A Practical Guide'}</title>
    <link>${fields.link ?? `${origin}/p/original-post-url`}</link>
    <pubDate>${fields.pubDate ?? date}</pubDate>
    ${fields.extra ?? ''}
  </item>`;
}

test('valid RSS retains title-derived slug and post metadata', () => {
  const posts = parseSubstackFeed(feed(item({
    extra: `<description><![CDATA[<p>A short <strong>summary</strong>.</p>]]></description>
      <content:encoded><![CDATA[<h2>Streaming</h2><p>Useful body.</p>]]></content:encoded>
      <category>Data Engineering</category>
      <enclosure url="https://images.example.com/cover.jpg" type="image/jpeg" />`,
  })));

  assert.equal(posts.length, 1);
  const post = posts[0];
  assert.equal(post.slug, 'streaming-batch-a-practical-guide');
  assert.equal(post.source, 'substack');
  assert.equal(post.externalUrl, `${origin}/p/original-post-url`);
  assert.equal(post.content, '');
  assert.equal(post.html, '<h2>Streaming</h2><p>Useful body.</p>');
  assert.equal(post.readingTime, 1);
  assert.deepEqual(post.frontmatter, {
    title: 'Streaming & Batch: A Practical Guide',
    description: 'A short summary.',
    tags: ['Data Engineering'],
    categories: ['Newsletter'],
    coverImage: 'https://images.example.com/cover.jpg',
    author: site.name,
    publishedDate: '2025-03-04T10:00:00.000Z',
    canonicalUrl: `${origin}/p/original-post-url`,
  });
});

test('invalid items do not discard valid neighbors or invent publication dates', () => {
  const invalid = [
    item({ pubDate: 'not a date' }),
    item({ pubDate: '' }),
    item({ pubDate: '<value>2025-03-04</value>' }),
    item({ pubDate: '12345' }),
    item().replace(`<pubDate>${date}</pubDate>`, ''),
    item({ title: '<nested>Wrong type</nested>' }),
    item({ title: '42' }),
    item({ title: 'true' }),
    item({ title: '' }),
    item().replace('<title>Streaming &amp; Batch: A Practical Guide</title>', ''),
    item({ link: '<nested>Wrong type</nested>' }),
    item({ link: '' }),
    item().replace('</title>', '</title><title>Duplicate</title>'),
    '<item />',
    '<item>42</item>',
  ];
  for (const malformed of invalid) {
    const posts = parseSubstackFeed(feed(
      item({ title: 'Before' }) + malformed + item({ title: 'After' })
    ));
    assert.deepEqual(posts.map((post) => post.frontmatter.title), ['Before', 'After'], malformed);
  }
});

test('post links must be HTTPS on the configured feed origin', () => {
  const host = new URL(site.substackFeed).hostname;
  const rejected = [
    `http://${host}/p/post`,
    `ftp://${host}/p/post`,
    'javascript:alert(1)',
    'https://unexpected.example/p/post',
    `https://${host}.evil.example/p/post`,
    `https://${host}@evil.example/p/post`,
    `https://user:password@${host}/p/post`,
    `https://${host}:8443/p/post`,
    `//${host}/p/post`,
    '/p/post',
    'not a URL',
  ];
  for (const link of rejected) {
    const posts = parseSubstackFeed(feed(item({ link }) + item({ title: 'Safe' })));
    assert.deepEqual(posts.map((post) => post.frontmatter.title), ['Safe'], link);
  }
});

test('third-party HTML scripts, unsafe links and tracking pixels remain sanitized', () => {
  const [post] = parseSubstackFeed(feed(item({
    extra: `<content:encoded><![CDATA[
      <script>alert('unsafe')</script>
      <p onclick="alert(1)">Safe text</p>
      <a href="javascript:alert(1)">Bad link</a>
      <a href="https://example.com/read">Good link</a>
      <img src="https://open.substack.com/pixel.gif" />
      <img src="https://images.example.com/body.jpg" onerror="alert(1)" />
      <iframe src="https://example.com/embed"></iframe>
    ]]></content:encoded>`,
  })));
  assert.ok(post.html);
  assert.doesNotMatch(post.html, /script|javascript:|onclick|onerror|iframe|pixel\.gif|alert\(/i);
  assert.match(post.html, /href="https:\/\/example.com\/read"/);
  assert.match(post.html, /<p>Safe text<\/p>/);
  assert.equal(post.frontmatter.coverImage, 'https://images.example.com/body.jpg');
  assert.doesNotMatch(post.frontmatter.description, /<|unsafe/);
});

test('categories are trimmed unique strings, not objects, numbers or booleans', () => {
  const [post] = parseSubstackFeed(feed(item({
    extra: `<category>Data</category><category>Streaming</category>
      <category> Data </category><category /><category>   </category>
      <category>42</category><category>true</category>
      <category><nested>Invalid</nested></category>`,
  })));
  assert.deepEqual(post.frontmatter.tags, ['Data', 'Streaming']);
});

test('malformed optional HTML fields fall back safely', () => {
  const posts = parseSubstackFeed(feed(
    item({ extra: '<content:encoded><nested>Invalid</nested></content:encoded><description><![CDATA[<p>Fallback</p>]]></description>' }) +
    item({ extra: '<description><nested>Invalid</nested></description><enclosure><url>Invalid</url></enclosure>' })
  ));
  assert.equal(posts.length, 2);
  assert.equal(posts[0].html, '<p>Fallback</p>');
  assert.equal(posts[0].frontmatter.description, 'Fallback');
  assert.equal(posts[1].html, '');
  assert.equal(posts[1].frontmatter.description, '');
  assert.equal(posts[1].frontmatter.coverImage, undefined);
  assert.deepEqual(posts[1].frontmatter.tags, []);
});

test('feeds without items yield no posts', () => {
  for (const xml of [feed(), '<rss />', '<rss><channel /></rss>', '<other />', '']) {
    assert.deepEqual(parseSubstackFeed(xml), [], xml);
  }
});
