// ===== SLS SHARED JAVASCRIPT =====

// Active nav link
document.addEventListener('DOMContentLoaded', function () {
  // Dynamic copyright year
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-sls .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll animations
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(timer);
        }, 20);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  // WhatsApp toggle
  const waBtn = document.getElementById('waMainBtn');
  const waPopup = document.getElementById('waPopup');
  const waClose = document.getElementById('waClose');

  if (waBtn && waPopup) {
    waBtn.addEventListener('click', () => {
      waPopup.classList.toggle('open');
    });
    if (waClose) {
      waClose.addEventListener('click', () => waPopup.classList.remove('open'));
    }
    document.addEventListener('click', e => {
      if (!e.target.closest('.wa-fab')) waPopup.classList.remove('open');
    });
  }

  // Form submission simulation
  const SLS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzPSOHWiHgpjLVk16ZTEbprpoVjxJnqbWqNu5dO1Kn0cz4MO01DU-SwE8WzE48053pL/exec';

  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('.btn-submit');
      const errorBox = document.getElementById('formError');
      const originalBtnText = btn.textContent;

      if (errorBox) errorBox.style.display = 'none';
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const formData = new FormData(form);
      formData.append('source', document.title);
      formData.append('pageUrl', window.location.href);

      fetch(SLS_SCRIPT_URL, { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.result === 'success') {
            form.style.display = 'none';
            if (errorBox) errorBox.style.display = 'none';
            const success = document.getElementById('formSuccess');
            if (success) success.style.display = 'block';
          } else {
            throw new Error('Unexpected response');
          }
        })
        .catch(() => {
          btn.textContent = originalBtnText;
          btn.disabled = false;
          if (errorBox) {
            errorBox.style.display = 'flex';
            errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
    });
  }
});
