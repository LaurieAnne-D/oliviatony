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

const weddingDate = new Date('2026-12-12T15:00:00Z');

function updateCountdown() {
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
}

updateCountdown();
setInterval(updateCountdown, 1000);

const scrollButton = document.querySelector('.scroll-hint');
const introSection = document.getElementById('intro');

if (scrollButton && introSection) {
  scrollButton.addEventListener('click', () => {
    introSection.scrollIntoView({ behavior: 'smooth' });
  });
}
