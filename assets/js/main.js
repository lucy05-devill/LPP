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

 // ================================
// GOOGLE SHEETS FORM SUBMISSION
// ================================

const SLS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPrIE_83HPbTxm3uiaF2AGgDkhSssNLOjsaSHg0RPhPCYX6-0J9z72jW7wF0tAABaN/exec";

const form = document.getElementById("quoteForm");

if (form) {

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    // HTML5 Validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector(".btn-submit");
    const errorBox = document.getElementById("formError");
    const successBox = document.getElementById("formSuccess");

    if (errorBox) errorBox.style.display = "none";
    if (successBox) successBox.style.display = "none";

    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    // Collect Form Data
    const data = {
      page: window.location.pathname.split("/").pop() || "index.html",

      name: document.getElementById("name").value.trim(),
      company: document.getElementById("company").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      city: document.getElementById("city").value.trim(),
      service: document.getElementById("service").value,
      origin: document.getElementById("origin").value.trim(),
      destination: document.getElementById("destination").value.trim(),
      cargoDescription: document.getElementById("cargoDescription").value.trim(),
      weight: document.getElementById("weight").value.trim(),
      dimensions: document.getElementById("dimensions").value.trim(),
      additionalRequirements: document.getElementById("additionalRequirements").value.trim()
    };

    try {

      const response = await fetch(SLS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.result === "success") {

        form.reset();

        form.style.display = "none";

        if (successBox) {
          successBox.style.display = "block";
          successBox.scrollIntoView({
            behavior: "smooth"
          });
        }

      } else {
        throw new Error(result.message || "Submission Failed");
      }

    } catch (err) {

      console.error(err);

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (errorBox) {
        errorBox.style.display = "flex";
        errorBox.scrollIntoView({
          behavior: "smooth"
        });
      }

    }

  });

}
