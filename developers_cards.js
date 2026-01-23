const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const content = card.querySelector('.card__content');
        content.classList.toggle('active'); 
    });
});