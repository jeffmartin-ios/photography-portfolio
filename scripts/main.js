// This script fetches the menu and handles the hamburger functionality.

document.addEventListener('DOMContentLoaded', () => {
    // This basePath variable MUST be defined in a <script> tag in each HTML file
    // before this script is loaded.
    const pathPrefix = typeof basePath !== 'undefined' ? basePath : './';
    
    fetch(pathPrefix + 'common/_menu.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load menu. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if (menuPlaceholder) {
                menuPlaceholder.innerHTML = data;

                // --- Fix Menu Links for GitHub Pages ---
                // This finds all links in the loaded menu and prepends the correct base path.
                const allLinks = menuPlaceholder.querySelectorAll('a');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    // Check if it's a root-relative link (starts with /) and not an external link (//)
                    if (href && href.startsWith('/') && !href.startsWith('//')) {
                        // Remove the leading '/' and prepend the correct path
                        link.setAttribute('href', pathPrefix + href.substring(1));
                    }
                });
            }
        })
        .then(() => {
            // --- Hamburger Menu Toggle Logic ---
            const hamburgerButton = document.getElementById('hamburger-button');
            const menuLinks = document.getElementById('menu-links');
            const closeMenuButton = document.getElementById('close-menu-button');
            const menuOverlay = document.getElementById('menu-overlay');

            function openMenu() {
                if(menuLinks) menuLinks.classList.add('open');
                if(menuOverlay) menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                if(menuLinks) menuLinks.classList.remove('open');
                if(menuOverlay) menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (hamburgerButton && menuLinks && closeMenuButton && menuOverlay) {
                hamburgerButton.addEventListener('click', openMenu);
                closeMenuButton.addEventListener('click', closeMenu);
                menuOverlay.addEventListener('click', closeMenu);
            }
        })
        .catch(error => {
            console.error('Error fetching or processing menu:', error);
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if(menuPlaceholder) {
                menuPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Could not load navigation menu.</p>';
            }
        });
});