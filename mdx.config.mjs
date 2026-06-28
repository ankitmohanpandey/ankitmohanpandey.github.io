import { defineConfig } from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkCallout from 'remark-callout';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  remarkPlugins: [remarkGfm, remarkCallout],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight, rehypeMermaid],
});
