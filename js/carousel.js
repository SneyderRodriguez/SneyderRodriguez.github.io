document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".project-carousel");
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const projectLinks = document.querySelectorAll(".project-links");

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let theta = 0;
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
    carousel.addEventListener("touchstart", dragStart, { passive: false });
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
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
      card.dataset.index = index;
    });
  }

  function rotateCarousel() {
    carousel.style.transform = `rotateY(${theta}deg)`;
    const angle = 360 / totalCards;
    let index = Math.round(-theta / angle) % totalCards;
    if (index < 0) index += totalCards; // normaliza índices negativos
    currentIndex = index;
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
      nextCard();
    } else if (e.key === "ArrowRight") {
      prevCard();
    } else if (e.key === "Enter" || e.key === " ") {
      const currentCard = document.querySelector(
        `.project-card[data-index="${currentIndex}"]`
      );
      if (currentCard) {
        currentCard.classList.toggle("flipped");
      }
    }
  }
  function getRadius() {
    return window.innerWidth <= 768 ? 250 : 300;
  }
  let radius = getRadius();

  window.addEventListener("resize", () => {
    radius = getRadius();
    arrangeCards();
    rotateCarousel();
  });
  init();
});