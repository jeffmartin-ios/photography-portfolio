document.addEventListener('DOMContentLoaded', () => {
    // Update the path in this line
    fetch('../common/_menu.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
        })
        .then(() => {
            // This part runs AFTER the menu HTML has been loaded
            const hamburgerButton = document.getElementById('hamburger-button');
            const menuLinks = document.getElementById('menu-links');
            const closeMenuButton = document.getElementById('close-menu-button');
            const menuOverlay = document.getElementById('menu-overlay');

            function openMenu() {
                menuLinks.classList.add('open');
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                menuLinks.classList.remove('open');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (hamburgerButton && menuLinks && closeMenuButton && menuOverlay) {
                hamburgerButton.addEventListener('click', openMenu);
                closeMenuButton.addEventListener('click', closeMenu);
                menuOverlay.addEventListener('click', closeMenu);
            } else {
                console.error("Could not find one or more menu elements after loading.");
            }
        })
        .catch(error => {
            console.error('Error fetching or processing the menu:', error);
            document.getElementById('menu-placeholder').innerHTML = '<p style="color:red;">Error: Could not load navigation menu.</p>';
        });
});