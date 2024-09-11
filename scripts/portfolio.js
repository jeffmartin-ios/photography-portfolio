const gridItems = document.querySelectorAll('.grid-item a');
const zoomedImage = document.querySelector('.zoomed-image');
const zoomedImageImg = zoomedImage.querySelector('img');
const closeButton = zoomedImage.querySelector('.close-button');

gridItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        const imgSrc = item.querySelector('img').src;
        zoomedImageImg.src = imgSrc;
        zoomedImage.classList.add('show');
        zoomedImageImg.classList.add('zoom');
    });
});

closeButton.addEventListener('click', () => {
    zoomedImage.classList.remove('show');
    zoomedImageImg.classList.remove('zoom');
});

zoomedImage.addEventListener('click', (event) => {
    if (event.target === zoomedImage) { 
        zoomedImage.classList.remove('show');
        zoomedImageImg.classList.remove('zoom');
    }
});
