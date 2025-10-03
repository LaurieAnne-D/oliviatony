document.body.classList.add('js');

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroElements = Array.from(document.querySelectorAll('.hero .animate-on-load'));
const revealElements = Array.from(document.querySelectorAll('.reveal-on-scroll'));

const applyHeroStagger = () => {
  heroElements.forEach((element, index) => {
    element.style.setProperty('--stagger', `${index * 140}ms`);
  });
};

const clearHeroStagger = () => {
  heroElements.forEach((element) => {
    element.style.removeProperty('--stagger');
  });
};

const applyRevealDelays = () => {
  revealElements.forEach((element, index) => {
    const clampedIndex = Math.min(index, 4);
    element.style.setProperty('--reveal-delay', `${clampedIndex * 90}ms`);
  });
};

const showAllRevealElements = () => {
  revealElements.forEach((element) => {
    element.classList.add('is-visible');
    element.style.removeProperty('--reveal-delay');
  });
};

let revealObserver = null;

const activateRevealObserver = () => {
  if (revealObserver || !revealElements.length) {
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealElements.forEach((element) => {
    if (!element.classList.contains('is-visible')) {
      revealObserver.observe(element);
    }
  });
};

const handleMotionPreferenceChange = (event) => {
  if (event.matches) {
    clearHeroStagger();
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    showAllRevealElements();
  } else {
    applyHeroStagger();
    applyRevealDelays();
    activateRevealObserver();
  }
};

if (reduceMotionQuery.matches) {
  clearHeroStagger();
  showAllRevealElements();
} else {
  applyHeroStagger();
  applyRevealDelays();
  activateRevealObserver();
}

if (typeof reduceMotionQuery.addEventListener === 'function') {
  reduceMotionQuery.addEventListener('change', handleMotionPreferenceChange);
} else if (typeof reduceMotionQuery.addListener === 'function') {
  reduceMotionQuery.addListener(handleMotionPreferenceChange);
}

const faqButtons = document.querySelectorAll('.faq__question');

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Close other entries for an accordion-like behavior
    faqButtons.forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
    });

    if (!isExpanded) {
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const countdownElements = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

if (Object.values(countdownElements).every(Boolean)) {
  const weddingDate = new Date('2026-12-12T15:00:00Z');

  const updateCountdown = () => {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      countdownElements.days.textContent = '00';
      countdownElements.hours.textContent = '00';
      countdownElements.minutes.textContent = '00';
      countdownElements.seconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownElements.days.textContent = String(days).padStart(2, '0');
    countdownElements.hours.textContent = String(hours).padStart(2, '0');
    countdownElements.minutes.textContent = String(minutes).padStart(2, '0');
    countdownElements.seconds.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const scrollButton = document.querySelector('.scroll-hint');
const introSection = document.getElementById('intro');

if (scrollButton && introSection) {
  scrollButton.addEventListener('click', () => {
    introSection.scrollIntoView({ behavior: 'smooth' });
  });
}

const modal = document.getElementById('site-modal');

if (modal) {
  const navToggle = document.querySelector('.site-nav-button');
  const modalOverlay = modal.querySelector('.modal__overlay');
  const modalCloseButtons = Array.from(modal.querySelectorAll('[data-close-modal]'));
  const modalNavButtons = Array.from(modal.querySelectorAll('[data-modal-target]'));
  const modalPanels = Array.from(modal.querySelectorAll('[data-modal-panel]'));
  const modalHomeLink = modal.querySelector('[data-modal-home]');
  const modalPanelsContainer = modal.querySelector('.modal__panels');
  const modalTriggers = Array.from(document.querySelectorAll('[data-open-modal]'));
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let previousActiveElement = null;
  let activePanel = 'default';

  const setPanel = (panelName = 'default') => {
    const targetPanel = modalPanels.find((panel) => panel.dataset.modalPanel === panelName);
    const finalPanel = targetPanel ? panelName : 'default';
    activePanel = finalPanel;

    modalPanels.forEach((panel) => {
      const isActive = panel.dataset.modalPanel === finalPanel;
      panel.toggleAttribute('hidden', !isActive);
    });

    modalNavButtons.forEach((button) => {
      const isActive = button.dataset.modalTarget === finalPanel;
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (modalPanelsContainer) {
      modalPanelsContainer.scrollTop = 0;
    }
  };

  const getFocusableElements = () =>
    Array.from(modal.querySelectorAll(focusableSelectors)).filter(
      (element) => !element.hasAttribute('hidden') && !element.closest('[hidden]')
    );

  const focusRsvpField = () => {
    const firstField = modal.querySelector('#last-name');
    if (firstField) {
      firstField.focus({ preventScroll: true });
    }
  };

  const trapFocus = (event) => {
    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const isShiftPressed = event.shiftKey;
    const activeElement = document.activeElement;

    if (!isShiftPressed && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (isShiftPressed && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      trapFocus(event);
    }
  };

  const openModal = (panelName = 'default') => {
    previousActiveElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    navToggle?.setAttribute('aria-expanded', 'true');

    setPanel(panelName);

    const closeButton = modal.querySelector('.modal__close');

    if (panelName === 'rsvp') {
      window.requestAnimationFrame(focusRsvpField);
    } else if (closeButton) {
      closeButton.focus();
    }

    document.addEventListener('keydown', handleKeydown);
  };

  const closeModal = () => {
    if (!modal.classList.contains('is-open')) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handleKeydown);

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus({ preventScroll: true });
    }

    previousActiveElement = null;
    setPanel('default');
  };

  navToggle?.addEventListener('click', () => {
    if (modal.classList.contains('is-open')) {
      closeModal();
    } else {
      openModal('default');
    }
  });

  modalOverlay?.addEventListener('click', closeModal);
  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modalNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetPanel = button.dataset.modalTarget;
      setPanel(targetPanel);
      if (targetPanel === 'rsvp') {
        window.requestAnimationFrame(focusRsvpField);
      }
    });
  });

  modalHomeLink?.addEventListener('click', (event) => {
    event.preventDefault();
    closeModal();
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
  });

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panelName = trigger.dataset.openModal || 'default';
      openModal(panelName);
    });
  });
}
