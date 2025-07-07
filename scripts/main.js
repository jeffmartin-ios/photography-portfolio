// This script automatically detects the environment (localhost vs. GitHub Pages)
// and builds the correct paths for all assets and links.

document.addEventListener('DOMContentLoaded', () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    let siteRoot;

    if (hostname.includes('jeffmartin.photos')) {
        siteRoot = `/photography-portfolio/`;
    } else {
        // We are on a local server or a custom domain. The root is simply "/".
        siteRoot = '/';
    }

    // --- Fetch the Menu ---
    const menuUrl = `${siteRoot}common/_menu.html`;
    
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

                // --- Fix All Menu Links ---
                // This finds all links in the loaded menu and prepends the correct siteRoot.
                const allLinks = menuPlaceholder.querySelectorAll('a');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    // Check if it's a root-relative link (like "/about/") and not an external link
                    if (href && href.startsWith('/') && !href.startsWith('//')) {
                        // Prepend the siteRoot to the link
                        link.setAttribute('href', siteRoot + href.substring(1));
                    }
                });
            }
        })
        .then(() => {
            // --- Hamburger Menu Toggle Logic (no changes needed here) ---
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
