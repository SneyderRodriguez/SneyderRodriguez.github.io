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