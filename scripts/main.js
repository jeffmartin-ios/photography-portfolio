// This script fetches the menu and handles the hamburger functionality.

document.addEventListener('DOMContentLoaded', () => {
    // This siteRoot variable MUST be defined in each HTML file.
    // It should be the path from the domain root to the project root.
    // e.g., '/photography-portfolio/'
    const rootPath = typeof siteRoot !== 'undefined' ? siteRoot : '/';
    
    // Build the absolute path to the menu file
    const menuUrl = `${rootPath}common/_menu.html`;

    fetch(menuUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load menu from ${menuUrl}. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if (menuPlaceholder) {
                menuPlaceholder.innerHTML = data;

                // --- Fix Menu Links for GitHub Pages ---
                const allLinks = menuPlaceholder.querySelectorAll('a');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/') && !href.startsWith('//')) {
                        // Prepend the siteRoot to the link
                        link.setAttribute('href', rootPath + href.substring(1));
                    }
                });
            }
        })
        .then(() => {
            // --- Hamburger Menu Toggle Logic (remains the same) ---
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
                menuPlaceholder.innerHTML = `<p style="color:red; text-align:center;">Could not load navigation menu.</p>`;
            }
        });
});