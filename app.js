/*=====================================================================
                        FUNCION CAROUSEL
  =====================================================================*/
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".project-carousel");
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const projectLinks = document.querySelectorAll(".project-links");

  let currentIndex = 0;
  let startX, startY;
  let isDragging = false;
  let theta = 0;
  let radius = window.innerWidth <= 768 ? 250 : 300;
  const totalCards = cards.length;

  function init() {
    arrangeCards();
    prevBtn.addEventListener("click", prevCard);
    nextBtn.addEventListener("click", nextCard);
    cards.forEach((card) => {
      card.addEventListener("click", flipCard);
    });
    projectLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart, { passive: true });
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
    document.addEventListener("keydown", handleKeyDown);
  }

  function arrangeCards() {
    const angle = 360 / totalCards;
    cards.forEach((card, index) => {
      const cardAngle = angle * index;
      const rad = (cardAngle * Math.PI) / 180;
      const x = radius * Math.sin(rad);
      const z = radius * Math.cos(rad) * -1;
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
      card.dataset.index = index;
    });
  }

  function rotateCarousel() {
    carousel.style.transform = `rotateY(${theta}deg)`;

    currentIndex = Math.round(
      Math.abs(theta / (360 / totalCards)) % totalCards
    );
    if (currentIndex >= totalCards) currentIndex = 0;
  }

  function nextCard() {
    theta -= 360 / totalCards;
    rotateCarousel();
  }

  function prevCard() {
    theta += 360 / totalCards;
    rotateCarousel();
  }

  function flipCard(e) {
    const card = e.currentTarget;
    const cardIndex = parseInt(card.dataset.index);

    if (cardIndex === currentIndex) {
      card.classList.toggle("flipped");
    }
  }

  function dragStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const currentX = e.pageX || (e.touches ? e.touches[0].pageX : startX);
    const diffX = currentX - startX;

    const sensitivity = 0.5;
    const newTheta = theta + diffX * sensitivity;

    carousel.style.transform = `rotateY(${newTheta}deg)`;
  }

  function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const currentX =
      e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : startX);
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 20) {
      if (diffX > 0) {
        prevCard();
      } else {
        nextCard();
      }
    } else {
      const anglePerCard = 360 / totalCards;
      const snapAngle = Math.round(theta / anglePerCard) * anglePerCard;
      theta = snapAngle;
      rotateCarousel();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      nextCard(); // Changed to match swipe direction
    } else if (e.key === "ArrowRight") {
      prevCard(); // Changed to match swipe direction
    } else if (e.key === "Enter" || e.key === " ") {
      const currentCard = document.querySelector(
        `.project-card[data-index="${currentIndex}"]`
      );
      if (currentCard) {
        currentCard.classList.toggle("flipped");
      }
    }
  }
  window.addEventListener("resize", () => {
    radius = window.innerWidth <= 768 ? 250 : 400;
    arrangeCards();
    rotateCarousel();
  });
  init();
});
/*=====================================================================
                        PIEZA CENTRAL
  =====================================================================*/
document.addEventListener("DOMContentLoaded", () => {
  const energyPiece = document.querySelector(".loader");
  const heroContent = document.querySelector(".hero-content");
  if (!energyPiece) return;

  const BASE_TIME = 5000;
  const ADD_TIME = 5000;
  const MAX_TIME = 30000;

  let energyTimer = null;
  let particleInterval = null;
  let currentDuration = BASE_TIME;

  function startEnergySystem() {
    clearTimeout(energyTimer);
    clearInterval(particleInterval);

    // Encendemos la pieza y el brillo continuo del hero
    energyPiece.classList.add("is-active");
    if (heroContent) heroContent.classList.add("energy-glow");

    // Ráfaga inicial + intervalo continuo de partículas
    spawnEnergyParticles();
    particleInterval = setInterval(() => {
      if (energyPiece.classList.contains("is-active")) {
        spawnEnergyParticles();
      }
    }, 2200);

    // Temporizador para APAGAR
    energyTimer = setTimeout(() => {
      deactivateEnergy();
    }, currentDuration);
  }

  function deactivateEnergy() {
    energyPiece.classList.remove("is-active");

    if (heroContent) heroContent.classList.remove("energy-glow");

    clearInterval(particleInterval);
    currentDuration = BASE_TIME;
  }
  startEnergySystem();

  energyPiece.addEventListener("mouseenter", () => {
    clearTimeout(energyTimer);
    energyPiece.classList.add("is-active");
    if (heroContent) heroContent.classList.add("energy-glow");
  });

  energyPiece.addEventListener("mouseleave", () => {
    currentDuration = Math.min(currentDuration + ADD_TIME, MAX_TIME);
    startEnergySystem();
  });
});

function spawnEnergyParticles() {
  const loader = document.querySelector(".loader");
  if (!loader || !loader.classList.contains("is-active")) return;

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      if (!loader.classList.contains("is-active")) return;

      const particle = document.createElement("span");
      particle.classList.add("energy-particle");

      const randomY = (Math.random() - 0.5) * 120;
      particle.style.setProperty("--y-spread", `${randomY}px`);

      loader.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove());
    }, i * 90);
  }
}
/*=====================================================================
                                BODY
  =====================================================================*/
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