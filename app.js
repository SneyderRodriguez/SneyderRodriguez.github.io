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
            PARTÍCULAS COMPACTAS DE PLASMA Y FLAMA
  =====================================================================*/
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("core-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 320;
    canvas.height = 320;
    const particles = [];
    const particleCount = 55;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;
    const colors = [
        "rgba(17, 157, 164, ",   // --azumagico
        "rgba(12, 116, 137, ",   // --azulbrillante
        "rgba(207, 207, 234, ",  // --textosecundario
        "rgba(255, 255, 255, "   // Blanco
    ];
    class CompactPlasmaParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = centerX + (Math.random() - 0.5) * 30;
            this.y = centerY + (Math.random() - 0.5) * 15;
            this.size = Math.random() * 9 + 4;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = -Math.random() * 2.0 - 0.8; 
            this.alpha = 1;
            this.decay = Math.random() * 0.025 + 0.012;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx + Math.sin(this.y * 0.08) * 0.5;
            this.y += this.vy;
            this.alpha -= this.decay;

            if (this.alpha <= 0 || this.size <= 0.4) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ")";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#119DA4";
            ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) {
        particles.push(new CompactPlasmaParticle());
    }
    function animateCompactPlasma() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateCompactPlasma);
    }
    animateCompactPlasma();
});
document.addEventListener("DOMContentLoaded", function () {
    const coreContainer = document.querySelector(".energy-core-container");
    const canvas = document.getElementById("core-canvas");
    if (!coreContainer || !canvas) return;
    let fadeTimer = null;
    function turnOffCore() {
        coreContainer.classList.add("is-off");
    }
    function activateCore() {
        coreContainer.classList.remove("is-off");
        if (fadeTimer) clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
            turnOffCore();
        }, 10000);
    }
    fadeTimer = setTimeout(() => {
        turnOffCore();
    }, 5000);
    coreContainer.addEventListener("mouseenter", activateCore);
    coreContainer.addEventListener("touchstart", activateCore, { passive: true });
    const ctx = canvas.getContext("2d");
    canvas.width = 320;
    canvas.height = 320;
    const particles = [];
    const particleCount = 55;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;
    const colors = [
        "rgba(17, 157, 164, ",   // --azumagico
        "rgba(12, 116, 137, ",   // --azulbrillante
        "rgba(207, 207, 234, ",  // --textosecundario
        "rgba(255, 255, 255, "   // Blanco
    ];
    class CompactPlasmaParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = centerX + (Math.random() - 0.5) * 30;
            this.y = centerY + (Math.random() - 0.5) * 15;
            
            this.size = Math.random() * 9 + 4;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = -Math.random() * 2.0 - 0.8; 
            
            this.alpha = 1;
            this.decay = Math.random() * 0.025 + 0.012;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx + Math.sin(this.y * 0.08) * 0.5;
            this.y += this.vy;
            this.alpha -= this.decay;
            this.size *= 0.95;

            if (this.alpha <= 0 || this.size <= 0.4) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ")";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#119DA4";
            ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) {
        particles.push(new CompactPlasmaParticle());
    }
    function animateCompactPlasma() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!coreContainer.classList.contains("is-off")) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }

        requestAnimationFrame(animateCompactPlasma);
    }

    animateCompactPlasma();
});
/*=====================================================================
                        FUNCION FONDO
  =====================================================================*/
  