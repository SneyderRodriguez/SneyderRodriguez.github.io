document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }
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
    energyPiece.classList.add("is-active");
    if (heroContent) heroContent.classList.add("energy-glow");
    spawnEnergyParticles();
    particleInterval = setInterval(() => {
      if (energyPiece.classList.contains("is-active")) {
        spawnEnergyParticles();
      }
    }, 2200);
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