const numStars = 45;

const starsContainer = document.createElement('div');
starsContainer.id = 'stars-container';
document.body.prepend(starsContainer);

function createStar() {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = Math.random() * 100 + "vh";
    star.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 5 + 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 6;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    return star;
}

for (let i = 0; i < numStars; i++) {
    starsContainer.appendChild(createStar());
}