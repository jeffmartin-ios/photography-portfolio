document.addEventListener('DOMContentLoaded', () => {
    const isBlogIndex = document.getElementById('post-list');
    const isBlogPost = document.getElementById('post-container');
    const siteRoot = '/';

    if (isBlogIndex) {
        loadBlogIndex();
    }

    if (isBlogPost) {
        loadBlogPost();
    }

    function loadBlogIndex() {
        fetch(`${siteRoot}blog/posts.json`)
            .then(response => {
                if (!response.ok) throw new Error('Could not fetch posts.json');
                return response.json();
            })
            .then(posts => {
                // NEW: Filter out any post with the slug "sample"
                const filteredPosts = posts.filter(post => post.slug !== 'sample');

                const postListContainer = document.getElementById('post-list');
                let html = '';
                // UPDATED: Iterate over the filtered list of posts
                filteredPosts.forEach(post => {
                    html += `
                        <a href="${siteRoot}blog/post.html?post=${post.slug}" class="post-preview-link">
                            <div class="post-preview-card">
                                <div class="post-preview-image">
                                    <img src="${post.heroImage}" alt="${post.title}">
                                </div>
                                <div class="post-preview-content">
                                    <p class="post-date">${post.date} / By ${post.author}</p>
                                    <h2>${post.title}</h2>
                                    <p class="post-subtitle">${post.subtitle}</p>
                                    <span class="read-more">Read More &rarr;</span>
                                </div>
                            </div>
                        </a>
                    `;
                });
                postListContainer.innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading blog index:", error);
                document.getElementById('post-list').innerHTML = '<p>Could not load posts.</p>';
            });
    }

    function loadBlogPost() {
        const params = new URLSearchParams(window.location.search);
        const postSlug = params.get('post');
        if (!postSlug) {
            document.getElementById('post-container').innerHTML = '<p>Post not found.</p>';
            return;
        }

        fetch(`${siteRoot}blog/posts/${postSlug}.md`)
            .then(response => {
                if (!response.ok) throw new Error('Could not fetch post markdown.');
                return response.text();
            })
            .then(markdownWithMeta => {
                const { metadata, content } = parseFrontMatter(markdownWithMeta);
                
                document.title = `${metadata.title} - Jeff Martin Photography`;

                const converter = new showdown.Converter();
                let postHtml = converter.makeHtml(content);

                // Build gallery HTML if it exists
                if (metadata.gallery && metadata.gallery.length > 0) {
                    let galleryHtml = '<div class="post-gallery"><div class="photo-grid">';
                    metadata.gallery.forEach(img => {
                        galleryHtml += `<div class="grid-item"><img src="${img.src}" alt="${img.alt}"></div>`;
                    });
                    galleryHtml += '</div></div>';
                    // Replace placeholder in the content with the gallery
                    postHtml = postHtml.replace('<!-- GALLERY -->', galleryHtml);
                }

                const fullPageHtml = `
                    <header class="post-header">
                        <p class="post-meta">${metadata.date} / By ${metadata.author}</p>
                        <h1 class="post-title">${metadata.title}</h1>
                        <p class="post-subtitle">${metadata.subtitle}</p>
                    </header>
                    <div class="post-hero-image">
                        <img src="${metadata.heroImage}" alt="${metadata.title}">
                    </div>
                    <div class="post-content">
                        ${postHtml}
                    </div>
                `;
                document.getElementById('post-container').innerHTML = fullPageHtml;
            })
            .catch(error => {
                console.error("Error loading blog post:", error);
                document.getElementById('post-container').innerHTML = '<p>Could not load post.</p>';
            });
    }

    // UPDATED: More robust Front Matter parser
    function parseFrontMatter(markdown) {
        const match = /---\s*([\s\S]*?)\s*---/.exec(markdown);
        if (!match) return { metadata: {}, content: markdown };

        const frontMatterText = match[1];
        const content = markdown.slice(match[0].length);
        const metadata = {};
        
        let inGallery = false;
        let galleryLines = [];

        frontMatterText.split('\n').forEach(line => {
            if (line.trim() === '') return;

            if (line.startsWith('gallery:')) {
                inGallery = true;
                metadata.gallery = [];
                return;
            }

            if (inGallery) {
                // If line is not indented, it's the end of the gallery
                if (!line.startsWith('  ')) {
                    inGallery = false;
                } else {
                    galleryLines.push(line);
                    return; // Continue to next line
                }
            }
            
            // This part runs if not in gallery mode
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                metadata[key] = value.replace(/^['"]|['"]$/g, '');
            }
        });

        // Process collected gallery lines
        if (galleryLines.length > 0) {
            let currentItem = {};
            galleryLines.forEach(line => {
                if (line.trim().startsWith('- src:')) {
                    // If currentItem is complete, push it before starting a new one
                    if (currentItem.src) {
                        metadata.gallery.push(currentItem);
                    }
                    currentItem = { src: line.split('- src:')[1].trim().replace(/^['"]|['"]$/g, '') };
                } else if (line.trim().startsWith('alt:')) {
                    currentItem.alt = line.split('alt:')[1].trim().replace(/^['"]|['"]$/g, '');
                }
            });
            // Push the last item
            if (currentItem.src) {
                metadata.gallery.push(currentItem);
            }
        }

        return { metadata, content };
    }
});
