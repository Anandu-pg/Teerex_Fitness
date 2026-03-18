/**
 * Teerex Fitness — script.js
 * Preloader, Navbar, Scroll Reveal, Chat Widget, Interactions
 */

'use strict';

/* ==========================================
   PRELOADER
   ========================================== */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('preloading');

  // Duration: 2.6s ring draw + fade out
  const PRELOADER_DURATION = 2800;

  function hidePreloader() {
    preloader.classList.add('hidden');
    document.body.classList.remove('preloading');

    // Trigger mobile vibration on reveal
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }

    // Remove from DOM after transition
    preloader.addEventListener('transitionend', () => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, { once: true });
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, PRELOADER_DURATION);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hidePreloader, PRELOADER_DURATION);
    });
  }
})();


/* ==========================================
   STICKY NAVBAR
   ========================================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ==========================================
   HAMBURGER MENU
   ========================================== */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });
})();


/* ==========================================
   ACTIVE NAV LINK ON SCROLL
   ========================================== */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => observer.observe(s));
})();


/* ==========================================
   SCROLL REVEAL (Intersection Observer)
   ========================================== */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.08
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ==========================================
   CHAT WIDGET
   ========================================== */
(function initChat() {
  const toggle   = document.getElementById('chat-toggle');
  const chatBox  = document.getElementById('chat-box');
  const closeBtn = document.getElementById('chat-close');
  const notif    = document.querySelector('.chat-notif');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');

  if (!toggle || !chatBox) return;

  let isOpen = false;

  function openChat() {
    isOpen = true;
    chatBox.classList.add('open');
    if (notif) notif.style.display = 'none';
    setTimeout(() => input && input.focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    chatBox.classList.remove('open');
  }

  toggle.addEventListener('click', () => {
    if (isOpen) closeChat();
    else openChat();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  // Bot responses knowledge base
  const responses = {
    default:   "Thanks for your message! For immediate help, please call us at 080750 90903 or visit us at Edappally. We'd love to see you! 💪",
    hours:     "We're open daily and stay open until 12 AM (midnight)! So whether you're an early bird or a night owl, we've got you covered. 🌙",
    price:     "Our plans start at just ₹999/month! We have Starter, Warrior, and Elite plans. Scroll up to see full pricing, or call us for a custom quote. 💛",
    classes:   "We offer Strength Training, Cardio, CrossFit, Yoga, Boxing, and Zumba — both in-gym and LIVE ONLINE! Ask us about joining an online session. 🔴",
    location:  "We're on the 2nd Floor, BM Building, Unnichira, Thykkavu, Edappally, Ernakulam, Kerala 682033. Easy to find, right off the main road! 📍",
    online:    "Yes! We have live online classes you can join from anywhere. Our trainers stream live sessions so you never miss a workout. DM us to get the schedule! 🏠💻",
    trainer:   "Our trainers are certified professionals with expertise in strength, conditioning, nutrition, and more. They'll design a program just for you! 🏋️",
    join:      "Joining is easy! Just drop by the gym, give us a call at 080750 90903, or message us here. We'll get you set up with the perfect plan! 🎉"
  };

  function getResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('hour') || m.includes('time') || m.includes('open') || m.includes('close')) return responses.hours;
    if (m.includes('price') || m.includes('cost') || m.includes('fee') || m.includes('pay') || m.includes('₹') || m.includes('plan') || m.includes('membership')) return responses.price;
    if (m.includes('class') || m.includes('workout') || m.includes('crossfit') || m.includes('yoga') || m.includes('zumba') || m.includes('cardio') || m.includes('strength')) return responses.classes;
    if (m.includes('location') || m.includes('address') || m.includes('where') || m.includes('map') || m.includes('edappally')) return responses.location;
    if (m.includes('online') || m.includes('live') || m.includes('stream') || m.includes('home')) return responses.online;
    if (m.includes('trainer') || m.includes('coach') || m.includes('personal')) return responses.trainer;
    if (m.includes('join') || m.includes('register') || m.includes('enroll') || m.includes('start') || m.includes('sign')) return responses.join;
    return responses.default;
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    const p = document.createElement('p');
    p.innerHTML = text;
    div.appendChild(p);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function botTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing-indicator';
    div.innerHTML = '<p>...</p>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const typingEl = botTyping();
    setTimeout(() => {
      messages.removeChild(typingEl);
      addMessage(getResponse(text), 'bot');
    }, 800 + Math.random() * 400);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Show notification after 3 seconds
  setTimeout(() => {
    if (!isOpen && notif) {
      notif.style.display = 'flex';
    }
  }, 3000);
})();


/* ==========================================
   NEWSLETTER FORM
   ========================================== */
(function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('visible');
  });
})();


/* ==========================================
   SMOOTH PARALLAX HERO IMAGE (subtle)
   ========================================== */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const offset  = scrollY * 0.25;
        heroImg.style.transform = `scale(1.06) translateY(${offset}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ==========================================
   COUNTERS ANIMATION (Stats in Hero)
   ========================================== */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  function animateCountUp(el) {
    const target = el.textContent;
    const isNumber = /\d+/.test(target);
    if (!isNumber) return;

    const prefix = target.replace(/[\d,]+/, '');
    const numStr = target.match(/[\d,]+/)[0].replace(',','');
    const num = parseInt(numStr);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current  = Math.round(ease * num);

      el.textContent = current.toLocaleString() + prefix;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target; // ensure final value
    }

    requestAnimationFrame(update);
  }

  // Delay until after the preloader is fully gone (2800ms duration + 300ms fade)
  // so the counter animation plays visibly in front of the user.
  const PRELOADER_DONE = 3100;

  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    statNums.forEach(el => observer.observe(el));
  }, PRELOADER_DONE);
})();


/* ==========================================
   GALLERY LIGHTBOX
   ========================================== */
function openLightbox(src, caption) {
  const lb   = document.getElementById('lightbox');
  const img  = document.getElementById('lightbox-img');
  const cap  = document.getElementById('lightbox-caption');
  if (!lb || !img) return;

  img.src = src;
  img.alt = caption || '';
  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


/* ==========================================
   MOBILE CLASSES AUTO-CAROUSEL
   ========================================== */
(function initClassesCarousel() {
  const grid = document.getElementById('classes-grid');
  const dotsEl = document.getElementById('classes-dots');
  if (!grid || !dotsEl) return;

  const cards = Array.from(grid.querySelectorAll('.class-card'));
  const dots  = Array.from(dotsEl.querySelectorAll('.dot'));
  const INTERVAL = 3500;
  let current = 0;
  let timer   = null;
  let active  = false;

  function isMobile() { return window.innerWidth <= 768; }

  function showCard(idx) {
    cards.forEach((c, i) => {
      c.classList.toggle('carousel-active', i === idx);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
    current = idx;
    if ("vibrate" in navigator) navigator.vibrate(40);
  }

  function next() {
    showCard((current + 1) % cards.length);
  }

  function startCarousel() {
    if (active) return;
    active = true;
    showCard(0);
    timer = setInterval(next, INTERVAL);
  }

  function stopCarousel() {
    active = false;
    clearInterval(timer);
    // Reset all cards to normal layout for desktop
    cards.forEach(c => c.classList.remove('carousel-active'));
    dots.forEach(d => d.classList.remove('active'));
    dots[0] && dots[0].classList.add('active');
  }

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      showCard(i);
      timer = setInterval(next, INTERVAL);
    });
  });

  // Touch swipe
  let touchX = 0;
  grid.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    clearInterval(timer);
    if (diff > 0) showCard((current + 1) % cards.length);
    else          showCard((current - 1 + cards.length) % cards.length);
    timer = setInterval(next, INTERVAL);
  }, { passive: true });

  // Init / resize
  function handleResize() {
    if (isMobile()) { if (!active) startCarousel(); }
    else            { if (active)  stopCarousel();  }
  }

  handleResize();
  window.addEventListener('resize', handleResize);
})();


/* ==========================================
   MOBILE 3D MEMBERSHIP CAROUSEL
   ========================================== */
(function initPlansCarousel() {
  const stage   = document.getElementById('plans-stage');
  const prevBtn = document.getElementById('plans-prev');
  const nextBtn = document.getElementById('plans-next');
  const dotsEl  = document.getElementById('plans-dots');
  if (!stage || !prevBtn) return;

  const cards = Array.from(stage.querySelectorAll('.plan-card'));
  const dots  = dotsEl ? Array.from(dotsEl.querySelectorAll('.plan-dot')) : [];
  const TOTAL = cards.length;
  let center  = 1;   // Warrior starts in the middle
  let active  = false;

  function isMobile() { return window.innerWidth <= 768; }

  // Positions relative to center: -1 = left, 0 = center, +1 = right
  function applyPositions() {
    cards.forEach((card, i) => {
      card.classList.remove('pos-left', 'pos-center', 'pos-right');
      const rel = i - center;
      if (rel === -1 || (center === 0 && i === TOTAL - 1)) {
        // wrap: if center=0, index TOTAL-1 is to the left
        card.classList.add(i === center - 1 ? 'pos-left' : '');
      }
      if (rel === 0)  card.classList.add('pos-center');
      if (rel === 1)  card.classList.add('pos-right');
      if (rel === -1) card.classList.add('pos-left');
    });
    // update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === center));
  }

  function goTo(idx) {
    center = (idx + TOTAL) % TOTAL;
    applyPositions();
    if ("vibrate" in navigator) navigator.vibrate(40);
  }

  function startCarousel() {
    if (active) return;
    active = true;
    applyPositions();
    prevBtn.style.display = '';
    nextBtn.style.display = '';
    if (dotsEl) dotsEl.style.display = '';
  }

  function stopCarousel() {
    if (!active) return;
    active = false;
    cards.forEach(c => c.classList.remove('pos-left', 'pos-center', 'pos-right'));
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    if (dotsEl) dotsEl.style.display = 'none';
  }

  prevBtn.addEventListener('click', () => goTo(center - 1));
  nextBtn.addEventListener('click', () => goTo(center + 1));

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Click on side card to bring it to center
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (active && i !== center) goTo(i);
    });
  });

  // Touch swipe
  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    goTo(diff > 0 ? center + 1 : center - 1);
  }, { passive: true });

  // Init / resize handling
  function handleResize() {
    if (isMobile()) { if (!active) startCarousel(); }
    else            { if (active)  stopCarousel();  }
  }

  handleResize();
  window.addEventListener('resize', handleResize);
})();


/* ==========================================
   MOBILE 3D TRAINERS RING
   ========================================== */
(function initTrainersRing() {
  const stage    = document.getElementById('trainers-ring-stage');
  const popup    = document.getElementById('trainer-popup');
  const closeBtn = document.getElementById('trainer-popup-close');
  if (!stage || !popup) return;

  // Trainer data keyed by ring-card index
  const TRAINERS = [
    {
      img:   'trainer1.png',
      name:  'Rahul Menon',
      spec:  'Strength & Powerlifting',
      bio:   '8+ years specializing in powerlifting, hypertrophy, and athletic conditioning. Certified NSCA-CSCS coach dedicated to helping you reach your peak.',
      stats: [{ val:'8+', lbl:'Years Exp.' }, { val:'200+', lbl:'Clients' }, { val:'NSCA', lbl:'Certified' }]
    },
    {
      img:   'trainer2.png',
      name:  'Priya Nair',
      spec:  'Cardio & Weight Loss',
      bio:   'Specialist in fat loss, HIIT training, and women\'s fitness. Certified ACE Personal Trainer with 6 years of transformative experience.',
      stats: [{ val:'6+', lbl:'Years Exp.' }, { val:'150+', lbl:'Clients' }, { val:'ACE', lbl:'Certified' }]
    },
    {
      img:   'trainer3.png',
      name:  'Arjun Krishnan',
      spec:  'CrossFit & Functional',
      bio:   'CrossFit Level 2 Trainer with expertise in functional movements, WOD programming, and high-intensity athletic performance.',
      stats: [{ val:'5+', lbl:'Years Exp.' }, { val:'120+', lbl:'Clients' }, { val:'CF-L2', lbl:'Certified' }]
    },
    {
      img:   'trainer4.png',
      name:  'Divya Suresh',
      spec:  'Yoga & Wellness',
      bio:   'Certified yoga instructor and nutritionist specializing in flexibility, mindfulness, mobility, and holistic wellness.',
      stats: [{ val:'7+', lbl:'Years Exp.' }, { val:'180+', lbl:'Clients' }, { val:'RYT', lbl:'Certified' }]
    }
  ];

  const RADIUS   = 150;   // px — circle radius in 3D space
  const SPEED    = 0.25;  // degrees per animation frame
  let   angle    = 0;
  let   animId   = null;
  let   paused   = false;
  let   mActive  = false;

  function isMobile() { return window.innerWidth <= 768; }

  // Position each ring-card around the circle
  const ringCards = Array.from(stage.querySelectorAll('.ring-card'));
  function positionCards() {
    const n = ringCards.length;
    ringCards.forEach((card, i) => {
      const deg = (360 / n) * i;
      card.style.transform = `rotateY(${deg}deg) translateZ(${RADIUS}px)`;
    });
  }

  // Animation loop — rotates the whole stage
  function tick() {
    if (paused) return;
    angle += SPEED;
    stage.style.transform = `rotateY(${angle}deg)`;
    animId = requestAnimationFrame(tick);
  }

  function startRing() {
    paused = false;
    if (!animId) animId = requestAnimationFrame(tick);
  }

  function pauseRing() {
    paused = true;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  // Populate and open the popup
  function openPopup(idx) {
    const t = TRAINERS[idx];
    if (!t) return;

    document.getElementById('popup-img').src  = t.img;
    document.getElementById('popup-img').alt  = t.name;
    document.getElementById('popup-spec').textContent = t.spec;
    document.getElementById('popup-name').textContent = t.name;
    document.getElementById('popup-bio').textContent  = t.bio;

    const statsEl = document.getElementById('popup-stats');
    statsEl.innerHTML = t.stats.map(s =>
      `<div class="popup-stat-item"><span>${s.val}</span><small>${s.lbl}</small></div>`
    ).join('');

    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
    pauseRing();
  }

  function closePopup() {
    popup.classList.remove('open');
    document.body.style.overflow = '';
    startRing();
  }

  // Wire up ring-card clicks
  ringCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!mActive) return;
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openPopup(idx);
    });
  });

  // Close button + tap outside card
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', e => {
    if (e.target === popup) closePopup();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });

  // Enable / disable based on viewport
  function enableRing() {
    mActive = true;
    positionCards();
    startRing();
  }

  function disableRing() {
    mActive = false;
    pauseRing();
    popup.classList.remove('open');
    document.body.style.overflow = '';
    stage.style.transform = '';
    ringCards.forEach(c => c.style.transform = '');
  }

  function handleResize() {
    if (isMobile()) { if (!mActive) enableRing(); }
    else            { if (mActive)  disableRing(); }
  }

  handleResize();
  window.addEventListener('resize', handleResize);
})();
