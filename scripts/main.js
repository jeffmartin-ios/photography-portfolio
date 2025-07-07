// This function now uses a global 'basePath' variable defined in the HTML
document.addEventListener('DOMContentLoaded', () => {
    // Check if basePath is defined, default to './' if not.
    const pathPrefix = typeof basePath !== 'undefined' ? basePath : './';

    fetch(pathPrefix + 'common/_menu.html') // Use the basePath
        .then(response => response.text())
        .then(data => {
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if (menuPlaceholder) {
                menuPlaceholder.innerHTML = data;

                // --- NEW: Fix menu links after injection ---
                const menuContainer = document.querySelector('.menu');
                if (menuContainer) {
                    const links = menuContainer.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        // Check if it's a root-relative link and not an external link
                        if (href && href.startsWith('/') && !href.startsWith('//')) {
                            // Prepend the basePath, removing the leading '/' from the href
                            link.setAttribute('href', pathPrefix + href.substring(1));
                        }
                    });
                }
            }
        })
        .then(() => {
            // Hamburger Menu Logic (remains the same)
            const hamburgerButton = document.getElementById('hamburger-button');
            const menuLinks = document.getElementById('menu-links');
            const closeMenuButton = document.getElementById('close-menu-button');
            const menuOverlay = document.getElementById('menu-overlay');

            function openMenu() {
                if (menuLinks) menuLinks.classList.add('open');
                if (menuOverlay) menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                if (menuLinks) menuLinks.classList.remove('open');
                if (menuOverlay) menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (hamburgerButton && menuLinks && closeMenuButton && menuOverlay) {
                hamburgerButton.addEventListener('click', openMenu);
                closeMenuButton.addEventListener('click', closeMenu);
                menuOverlay.addEventListener('click', closeMenu);
            }
        })
        .catch(error => {
            console.error('Error fetching the menu:', error);
        });
});
