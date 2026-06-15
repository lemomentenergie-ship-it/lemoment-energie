document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE MENU BURGER ---
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- PRICING TABS ---
  const tabButtons = document.querySelectorAll('.pricing-tab-btn');
  const tabContents = document.querySelectorAll('.pricing-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      // Hide all contents
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // Show target content
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // --- SCROLL REVEAL (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once shown, we can unobserve
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.15 // trigger when 15% visible
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- NAVBAR ACTIVE LINK ON SCROLL ---
  const sections = document.querySelectorAll('section');
  
  const scrollActiveLink = () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // adjust offset for header
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', scrollActiveLink);

  // --- CONTACT FORM SUBMISSION FEEDBACK ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // We let it submit to Formspree, but we can display a loader or custom notice if desired.
      // For GitHub pages, we can just show a thank you alert or let the form action handle it.
      // Below is a simple visual feedback that we can trigger:
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      // Note: Since the form has action="https://formspree.io/f/xoqgypzo", the browser will redirect
      // to formspree success page unless handled via fetch. Let's handle it with fetch for a seamless SPA feel!
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => data[key] = value);

      fetch(contactForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          contactForm.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
              <span style="font-size: 3rem; display: block; margin-bottom: 20px;">✉️</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 10px; color: var(--color-primary);">Message envoyé !</h4>
              <p style="color: var(--color-text-muted);">Merci pour votre intérêt. Je vous recontacterai dans les plus brefs délais pour convenir d'un rendez-vous.</p>
            </div>
          `;
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      })
      .catch(error => {
        submitBtn.textContent = 'Erreur. Réessayer';
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        alert("Une erreur s'est produite lors de l'envoi de votre message. N'hésitez pas à m'écrire directement à lemomentenergie@gmail.com.");
      });
    });
  }

});
