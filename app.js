document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('artifactContainer');
  const sparksContainer = document.getElementById('sparksContainer');
  const STATES = {
    ACTIVE: 'state-active',
    FAULT: 'state-fault',
    OFFLINE: 'state-offline',
    RECHARGING: 'state-recharging'
  };

  let currentState = STATES.ACTIVE;
  let stateTimer = null;
  container.classList.add(STATES.ACTIVE);
  scheduleFaultSequence();
  container.addEventListener('mouseenter', () => {
    if (currentState === STATES.OFFLINE) {
      initiateRechargeSequence();
    }
  });

  function transitionTo(newState) {
    Object.values(STATES).forEach(stateClass => {
      container.classList.remove(stateClass);
    });
    container.classList.add(newState);
    currentState = newState;
  }

  function scheduleFaultSequence() {
    const delay = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
    stateTimer = setTimeout(() => {
      if (currentState !== STATES.ACTIVE) return;
      transitionTo(STATES.FAULT);
      setTimeout(() => {
        if (currentState === STATES.FAULT) {
          triggerSparks();
          transitionTo(STATES.OFFLINE);
        }
      }, 1400);
    }, delay);
  }
  function initiateRechargeSequence() {
    clearTimeout(stateTimer);
    transitionTo(STATES.RECHARGING);
    setTimeout(() => {
      if (currentState === STATES.RECHARGING) {
        transitionTo(STATES.ACTIVE);
        scheduleFaultSequence();
      }
    }, 1800);
  }
  function triggerSparks() {
    sparksContainer.innerHTML = '';
    const sparkCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.floor(Math.random() * 25) + 15;
      const tx = Math.cos(angle) * distance + 'px';
      const ty = Math.sin(angle) * distance + 'px';

      spark.style.setProperty('--tx', tx);
      spark.style.setProperty('--ty', ty);
      spark.style.left = '50%';
      spark.style.top = '50%';
      spark.style.animation = 'sparkEmit 0.6s ease-out forwards';

      sparksContainer.appendChild(spark);
    }
  }
});
/*=====================================================================
                        FUNCION CAROUSEL
  =====================================================================*/
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const carousel = document.querySelector(".project-carousel");
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const projectLinks = document.querySelectorAll(".project-links a");

  // Variables
  let currentIndex = 0;
  let startX, startY;
  let isDragging = false;
  let theta = 0;
  let radius = window.innerWidth <= 768 ? 250 : 300;
  const totalCards = cards.length;

  // Initialize
  function init() {
    // Position cards in a circle
    arrangeCards();

    // Add event listeners
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

    // Touch/mouse events for dragging
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart, { passive: true });
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);

    // Keyboard navigation
    document.addEventListener("keydown", handleKeyDown);
  }

  // Arrange cards in a circle
  function arrangeCards() {
    const angle = 360 / totalCards;
    cards.forEach((card, index) => {
      // Calculate the angle for this card
      const cardAngle = angle * index;
      // Convert to radians
      const rad = (cardAngle * Math.PI) / 180;
      // Calculate position
      const x = radius * Math.sin(rad);
      const z = radius * Math.cos(rad) * -1;

      // Apply transform
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

      // Store the card's index
      card.dataset.index = index;
    });
  }

  // Rotate carousel
  function rotateCarousel() {
    carousel.style.transform = `rotateY(${theta}deg)`;

    // Update current card index
    currentIndex = Math.round(
      Math.abs(theta / (360 / totalCards)) % totalCards
    );
    if (currentIndex >= totalCards) currentIndex = 0;
  }

  // Next card
  function nextCard() {
    theta -= 360 / totalCards; // Changed direction to match swipe
    rotateCarousel();
  }

  // Previous card
  function prevCard() {
    theta += 360 / totalCards; // Changed direction to match swipe
    rotateCarousel();
  }

  // Flip card
  function flipCard(e) {
    const card = e.currentTarget;
    const cardIndex = parseInt(card.dataset.index);

    // Only flip the current front-facing card
    if (cardIndex === currentIndex) {
      card.classList.toggle("flipped");
    }
  }

  // Drag functions
  function dragStart(e) {
    e.preventDefault(); // Prevent default behavior
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default scrolling

    const currentX = e.pageX || (e.touches ? e.touches[0].pageX : startX);
    const diffX = currentX - startX;

    // Rotate based on drag distance - FIXED DIRECTION
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

    // FIXED DIRECTION: If swiping right, show previous card (theta increases)
    // If swiping left, show next card (theta decreases)
    if (Math.abs(diffX) > 20) {
      if (diffX > 0) {
        prevCard(); // Swipe right to see previous card
      } else {
        nextCard(); // Swipe left to see next card
      }
    } else {
      // Snap to the closest card
      const anglePerCard = 360 / totalCards;
      const snapAngle = Math.round(theta / anglePerCard) * anglePerCard;
      theta = snapAngle;
      rotateCarousel();
    }
  }

  // Keyboard navigation
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
  // Resize handler
  window.addEventListener("resize", () => {
    radius = window.innerWidth <= 768 ? 250 : 400;
    arrangeCards();
    rotateCarousel();
  });

  // Initialize the carousel
  init();
});
/*=====================================================================
                        FUNCION FONDO
  =====================================================================*/
function createParticles() {
    const container = document.querySelector(".particles");
    const totalParticles = 36;

    for (let i = 0; i < totalParticles; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = (Math.random() * 0.25 + 0.08).toFixed(2);

        const random = Math.random();
        if (random < 0.70) {
            particle.style.background = "var(--azumagico)";
        } else if (random < 0.95) {
            particle.style.background = "var(--textoprincipal)";
        } else {
            particle.style.background = "var(--doradorunico)";
        }
        const duration = Math.random() * 10 + 12;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        container.appendChild(particle);
    }
}
createParticles();