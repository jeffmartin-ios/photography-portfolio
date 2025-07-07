document.addEventListener('DOMContentLoaded', () => {
    const photoGrid = document.querySelector('.photo-grid');
    const zoomedImageContainer = document.querySelector('.zoomed-image');
    const zoomedImage = zoomedImageContainer.querySelector('img');
    const closeButton = zoomedImageContainer.querySelector('.close-button');

    // Make sure all elements exist before adding listeners
    if (!photoGrid || !zoomedImageContainer || !zoomedImage || !closeButton) {
        console.error('Gallery script could not find all required elements.');
        return;
    }

    // Function to open the lightbox
    const openZoom = (e) => {
        // Only trigger if an image inside a grid item was clicked
        if (e.target.tagName === 'IMG') {
            zoomedImage.src = e.target.src;
            zoomedImageContainer.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };

    // Function to close the lightbox
    const closeZoom = () => {
        zoomedImageContainer.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Event Listeners
    photoGrid.addEventListener('click', openZoom);
    closeButton.addEventListener('click', closeZoom);
    
    // Also close when clicking the dark background
    zoomedImageContainer.addEventListener('click', (e) => {
        // If the click is on the container itself (the background) and not the image
        if (e.target === zoomedImageContainer) {
            closeZoom();
        }
    });
});