document.addEventListener('DOMContentLoaded', () => {
    if (typeof galleryData === 'undefined') {
        console.error('Gallery data is not defined on this page.');
        return;
    }
    
    const pathPrefix = typeof basePath !== 'undefined' ? basePath : './';

    fetch(pathPrefix + 'common/_gallery-layout.html')
        .then(response => {
            if (!response.ok) throw new Error('Could not load the gallery layout.');
            return response.text();
        })
        .then(html => {
            document.body.innerHTML = html;

            // Populate the template with data
            document.title = `${galleryData.title} - Jeff Martin Photography`;
            document.getElementById('gallery-title').textContent = galleryData.title;
            document.getElementById('gallery-subtitle').textContent = galleryData.subtitle;
            
            const breadcrumb = document.getElementById('breadcrumb-link');
            breadcrumb.href = pathPrefix + galleryData.breadcrumb.link;
            breadcrumb.innerHTML = `&larr; ${galleryData.breadcrumb.text}`;

            const gridContainer = document.getElementById('photo-grid-container');
            let gridHTML = '';
            
            if (galleryData.images && galleryData.images.length > 0) {
                galleryData.images.forEach(image => {
                    const itemClass = image.class ? `grid-item ${image.class}` : 'grid-item';
                    // Prepend basePath to image sources
                    gridHTML += `
                        <div class="${itemClass}">
                            <img src="${pathPrefix}${image.src}" alt="${image.alt}">
                        </div>
                    `;
                });
            } else {
                 gridHTML = '<p class="merriweather-regular" style="text-align:center; grid-column: 1 / -1;">This gallery is coming soon. Please check back later!</p>';
            }
            
            gridContainer.innerHTML = gridHTML;

            // Load other necessary scripts
            loadScript(pathPrefix + 'js/main.js');
            loadScript(pathPrefix + 'js/gallery.js');
        })
        .catch(error => {
            console.error('Error building gallery page:', error);
            document.body.innerHTML = '<p style="color:red; text-align:center; padding-top: 50px;">Error: Could not build the gallery page.</p>';
        });
});

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}
