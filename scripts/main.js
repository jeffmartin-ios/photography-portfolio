document.addEventListener('DOMContentLoaded', () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const siteRoot = '/';

    // --- Reusable Component Loader Function ---
    function loadComponent(componentPath, placeholderId) {
        const componentUrl = `${siteRoot}${componentPath}`;
        
        fetch(componentUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${componentUrl}`);
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                    // Fix all links within the loaded component
                    const allLinks = placeholder.querySelectorAll('a');
                    allLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('/') && !href.startsWith('//')) {
                            link.setAttribute('href', siteRoot + href.substring(1));
                        }
                    });
                }
            })
            .catch(error => {
                console.error(`Error loading component for #${placeholderId}:`, error);
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) placeholder.innerHTML = `<p style="color:red; text-align:center;">Could not load component.</p>`;
            });
    }

    // --- Load Menu and then setup Hamburger ---
    const menuUrl = `${siteRoot}common/menu.html`;
    fetch(menuUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load menu from ${menuUrl}`);
            return response.text();
        })
        .then(data => {
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if (menuPlaceholder) {
                menuPlaceholder.innerHTML = data;
                const allLinks = menuPlaceholder.querySelectorAll('a');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/') && !href.startsWith('//')) {
                        link.setAttribute('href', siteRoot + href.substring(1));
                    }
                });
            }
        })
        .then(() => {
            // Hamburger Menu Logic - runs after menu is loaded
            const hamburgerButton = document.getElementById('hamburger-button');
            const menuLinks = document.getElementById('menu-links');
            const closeMenuButton = document.getElementById('close-menu-button');
            const menuOverlay = document.getElementById('menu-overlay');

            if (hamburgerButton && menuLinks && closeMenuButton && menuOverlay) {
                hamburgerButton.addEventListener('click', () => {
                    menuLinks.classList.add('open');
                    menuOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
                closeMenuButton.addEventListener('click', () => {
                    menuLinks.classList.remove('open');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
                menuOverlay.addEventListener('click', () => {
                    menuLinks.classList.remove('open');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            const menuPlaceholder = document.getElementById('menu-placeholder');
            if (menuPlaceholder) menuPlaceholder.innerHTML = `<p style="color:red; text-align:center;">Could not load navigation menu.</p>`;
        });

    // --- Load Footer ---
    // This runs in parallel to the menu fetch
    loadComponent('common/footer.html', 'footer-placeholder');
});

