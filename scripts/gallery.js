// This script handles the lightbox (zoom) functionality for images.

document.addEventListener('DOMContentLoaded', () => {
    const photoGrid = document.querySelector('.photo-grid');
    const zoomedImageContainer = document.querySelector('.zoomed-image');
    
    if (!photoGrid || !zoomedImageContainer) return;

    const zoomedImage = zoomedImageContainer.querySelector('img');
    const closeButton = zoomedImageContainer.querySelector('.close-button');

    const openZoom = (e) => {
        if (e.target.tagName === 'IMG') {
            zoomedImage.src = e.target.src;
            zoomedImageContainer.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeZoom = () => {
        zoomedImageContainer.classList.remove('show');
        document.body.style.overflow = '';
    };

    photoGrid.addEventListener('click', openZoom);
    closeButton.addEventListener('click', closeZoom);
    
    zoomedImageContainer.addEventListener('click', (e) => {
        if (e.target === zoomedImageContainer) {
            closeZoom();
        }
    });
});
