#!/usr/bin/env python3
"""
Sync Substack posts to your website automatically.
Fetches posts from your Substack RSS feed and creates HTML files.

Usage:
    python3 sync-substack.py

Requirements:
    pip install feedparser requests
"""

import feedparser
import os
from datetime import datetime
import re
import requests
import xml.etree.ElementTree as ET

SUBSTACK_RSS = "https://ankitmohanpandey.substack.com/feed"
BLOG_DIR = "blog"
BLOG_LIST_FILE = "blog.html"

def sanitize_filename(title):
    """Convert title to URL-friendly filename"""
    filename = title.lower()
    filename = re.sub(r'[^\w\s-]', '', filename)
    filename = re.sub(r'[-\s]+', '-', filename)
    return filename[:100] + '.html'

def create_blog_post_html(post):
    """Generate HTML for a single blog post"""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{post['title']} - Ankit Mohan Pandey</title>
    <meta name="description" content="{post.get('summary', '')[:160]}">
    <meta name="author" content="Ankit Mohan Pandey">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{post['title']}">
    <meta property="og:description" content="{post.get('summary', '')[:160]}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://ankitmohanpandey.in/blog/{sanitize_filename(post['title'])}">
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="stylesheet" href="/style.css">
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "{post['title']}",
      "datePublished": "{post.get('published', '')}",
      "author": {{
        "@type": "Person",
        "name": "Ankit Mohan Pandey",
        "url": "https://ankitmohanpandey.in"
      }}
    }}
    </script>
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="nav-brand">Ankit Mohan Pandey</div>
            <ul class="nav-links">
                <li><a href="/index.html">Home</a></li>
                <li><a href="/about.html">About</a></li>
                <li><a href="/blog.html" class="active">Blog</a></li>
            </ul>
        </div>
    </nav>

    <main>
        <article style="padding: var(--spacing-3xl) 0;">
            <div class="container-narrow">
                <a href="/blog.html" style="color: var(--accent-primary); text-decoration: none; display: inline-block; margin-bottom: var(--spacing-lg);">
                    ← Back to Blog
                </a>
                
                <h1>{post['title']}</h1>
                <p style="color: var(--text-muted); margin-bottom: var(--spacing-xl);">
                    Published on {datetime.strptime(post.get('published', ''), '%a, %d %b %Y %H:%M:%S %Z').strftime('%B %d, %Y') if post.get('published') else 'Unknown'}
                </p>
                
                <div class="blog-content">
                    {post.get('content', [{}])[0].get('value', post.get('summary', ''))}
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding-top: var(--spacing-xl); border-top: 1px solid var(--border-color);">
                    <p style="color: var(--text-muted); text-align: center;">
                        Originally published on <a href="{post['link']}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary);">Substack</a>
                    </p>
                </div>
            </div>
        </article>
    </main>

    <footer>
        <div class="container">
            <p style="color: var(--text-muted); text-align: center;">© 2026 Ankit Mohan Pandey</p>
        </div>
    </footer>
</body>
</html>
"""

def estimate_reading_time(content):
    """Estimate reading time based on word count"""
    words = len(content.split())
    minutes = max(1, round(words / 200))  # Average reading speed: 200 words/min
    return f"{minutes} min read"

def create_blog_card(post):
    """Generate HTML for a blog card"""
    filename = sanitize_filename(post['title'])
    summary = post.get('summary', '')[:200] + '...' if len(post.get('summary', '')) > 200 else post.get('summary', '')
    reading_time = estimate_reading_time(post.get('content', [{}])[0].get('value', ''))
    
    return f'''                    <div class="blog-card" onclick="window.location.href='/blog/{filename}'">
                        <h3 class="blog-title">{post['title']}</h3>
                        <p class="blog-meta">{reading_time} · Data Engineering</p>
                        <p class="blog-description">
                            {summary}
                        </p>
                    </div>
'''

def update_blog_listing(posts):
    """Update blog.html with new posts"""
    with open(BLOG_LIST_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate all blog cards
    blog_cards = '\n'.join([create_blog_card(post) for post in posts])
    
    # Find and replace the blog cards section
    start_marker = '<div class="grid-2">'
    end_marker = '</div>\n\n                <div style="text-align: center;'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx != -1 and end_idx != -1:
        new_content = (
            content[:start_idx + len(start_marker)] + 
            '\n' + blog_cards + 
            '\n                ' +
            content[end_idx:]
        )
        
        with open(BLOG_LIST_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {BLOG_LIST_FILE} with {len(posts)} posts")
    else:
        print(f"⚠ Warning: Could not find blog cards section in {BLOG_LIST_FILE}")

def parse_substack_rss():
    """Parse Substack RSS feed using XML parser"""
    try:
        response = requests.get(SUBSTACK_RSS, timeout=10)
        response.raise_for_status()
        
        root = ET.fromstring(response.content)
        
        # Find all items in the RSS feed
        items = root.findall('.//item')
        
        posts = []
        for item in items:
            post = {
                'title': item.find('title').text if item.find('title') is not None else 'Untitled',
                'link': item.find('link').text if item.find('link') is not None else '',
                'published': item.find('pubDate').text if item.find('pubDate') is not None else '',
                'summary': item.find('description').text if item.find('description') is not None else '',
                'content': [{'value': item.find('.//{http://purl.org/rss/1.0/modules/content/}encoded').text}] if item.find('.//{http://purl.org/rss/1.0/modules/content/}encoded') is not None else [{'value': ''}]
            }
            posts.append(post)
        
        return posts
    except Exception as e:
        print(f"Error parsing RSS: {e}")
        return []

def sync_posts():
    """Fetch Substack posts and create HTML files"""
    print(f"Fetching posts from {SUBSTACK_RSS}...")
    
    posts = parse_substack_rss()
    
    if not posts:
        print("No posts found. Make sure your Substack URL is correct.")
        return
    
    # Create blog directory if it doesn't exist
    os.makedirs(BLOG_DIR, exist_ok=True)
    
    print(f"Found {len(posts)} posts")
    
    for post in posts:
        filename = sanitize_filename(post['title'])
        filepath = os.path.join(BLOG_DIR, filename)
        
        html_content = create_blog_post_html(post)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✓ Created: {filepath}")
    
    # Update blog listing page
    update_blog_listing(posts)
    
    print("\n✅ Sync complete! All posts synced and blog.html updated.")

if __name__ == "__main__":
    sync_posts()
