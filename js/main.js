/* ===========================
   JavaScript for Amber Awasthi Portfolio
   =========================== */

/* ══ NAVBAR SCROLL ══ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ══ HAMBURGER ══ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
  });
});

/* ══ VIDEO SMOOTH LOAD ══ */
const bgVideo = document.getElementById('bgVideo');
bgVideo.addEventListener('canplay', () => {
  bgVideo.classList.add('loaded');
});
setTimeout(() => bgVideo.classList.add('loaded'), 2000);

/* ══ SMOOTH SCROLL for Enter Portfolio ══ */
document.getElementById('enterBtn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('about').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ══ SCROLL-REVEAL (IntersectionObserver) ══ */
const fadeEls = document.querySelectorAll('.fade-in');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((el, idx) => { if (el === entry.target) delay = idx * 100; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => revealObserver.observe(el));

/* ══ SKILL BARS ANIMATION ══ */
const barFills = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      setTimeout(() => { entry.target.style.width = width + '%'; }, 200);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
barFills.forEach(bar => barObserver.observe(bar));

/* ══ COUNT-UP ANIMATION ══ */
const countEls = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 40);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

/* ══════════════════════════════════════════
   CERTIFICATES — exact filenames from public/certificates/
══════════════════════════════════════════ */
const CERTIFICATES = [
  { name: 'English for IT – Cisco',          file: 'ENGLISH FOR IT CISCO.png' },
  { name: 'Full Stack Web Development \u2013 HCL', file: 'HCL.png' },
  { name: 'HeatWave Implementation – Oracle', file: 'HEATWAVE IMPLEMENTATION ORACLE.png' },
  { name: 'JavaScript – Cisco',              file: 'JAVASCIPT CISCO.png' },
  { name: 'Operating System – Cisco',        file: 'OPERATING SYSTEM CISCO.png' },
];

const certsGrid      = document.getElementById('certsGrid');
const certModal      = document.getElementById('certModal');
const modalImg       = document.getElementById('modalImg');
const modalCaption   = document.getElementById('modalCaption');
const modalClose     = document.getElementById('modalClose');
const modalBackdrop  = document.getElementById('modalBackdrop');

function buildCertCards() {
  CERTIFICATES.forEach(cert => {
    const src  = `public/certificates/${cert.file}`;
    const card = document.createElement('div');
    card.className = 'cert-card fade-in';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View certificate: ${cert.name}`);
    card.innerHTML = `
      <div class="cert-img-wrap">
        <img src="${src}" alt="${cert.name}" loading="lazy" />
        <div class="cert-overlay"><i class="fas fa-expand"></i></div>
      </div>
      <div class="cert-body">
        <h4>${cert.name}</h4>
        <span class="cert-view"><i class="fas fa-eye"></i> Click to view full screen</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(src, cert.name));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(src, cert.name); }
    });
    certsGrid.appendChild(card);
  });
  document.querySelectorAll('.cert-card').forEach(el => revealObserver.observe(el));
}

function openModal(src, name) {
  modalImg.src = src;
  modalImg.alt = name;
  modalCaption.textContent = name;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalImg.src = ''; }, 400);
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

buildCertCards();

/* ══════════════════════════════════════════
   PROFILE VIDEO — play once when About visible
══════════════════════════════════════════ */
const profileVideo = document.getElementById('profileVideo');
if (profileVideo) {
  // Pause immediately so autoplay attribute doesn't fire before section is visible
  profileVideo.pause();
  profileVideo.currentTime = 0;

  const aboutSection = document.getElementById('about');
  const vidObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        profileVideo.currentTime = 0;
        profileVideo.play().catch(() => {});
        vidObserver.unobserve(aboutSection);
      }
    });
  }, { threshold: 0.3 });
  vidObserver.observe(aboutSection);
}

/* ══════════════════════════════════════════
   GALAXY BACKGROUND — canvas-per-section
══════════════════════════════════════════ */
function createGalaxy(section) {
  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], particles = [];
  const NUM_STARS = 160;
  const NUM_PARTICLES = 22;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    initStars();
    initParticles();
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: randomBetween(0, W),
        y: randomBetween(0, H),
        r: randomBetween(0.3, 1.6),
        alpha: randomBetween(0.2, 0.8),
        speed: randomBetween(0.0005, 0.002),
        phase: randomBetween(0, Math.PI * 2),
      });
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: randomBetween(0, W),
        y: randomBetween(0, H),
        r: randomBetween(1.2, 3),
        vx: randomBetween(-0.15, 0.15),
        vy: randomBetween(-0.12, 0.12),
        alpha: randomBetween(0.25, 0.6),
        hue: randomBetween(15, 40), // orange family
      });
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Stars — twinkle
    stars.forEach(s => {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(frame * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    // Floating orange particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `hsla(${p.hue},100%,60%,${p.alpha})`);
      grad.addColorStop(1, `hsla(${p.hue},100%,40%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  new ResizeObserver(resize).observe(section);
  draw();
}

document.querySelectorAll('.has-galaxy').forEach(sec => createGalaxy(sec));

/* ══════════════════════════════════════════
   FIRE CURSOR
══════════════════════════════════════════ */
(function fireCursor() {
  const dot    = document.getElementById('cursorDot');
  const ring   = document.getElementById('cursorRing');
  const trail  = [];
  const TRAIL_SIZE = 18;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  // Create trail particles
  for (let i = 0; i < TRAIL_SIZE; i++) {
    const p = document.createElement('div');
    p.className = 'cursor-trail';
    document.body.appendChild(p);
    trail.push({ el: p, x: mx, y: my });
  }

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Hover effects on interactive elements
  document.querySelectorAll('a, button, .cert-card, .project-card, .skill-pill, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  let frame = 0;
  function animCursor() {
    // Smooth ring follow
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // Trail: shift positions
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x = trail[i-1].x;
      trail[i].y = trail[i-1].y;
    }
    trail[0].x = mx;
    trail[0].y = my;

    trail.forEach((p, i) => {
      const progress = (i / trail.length);
      const size     = Math.max(1, 10 - i * 0.45);
      const opacity  = (1 - progress) * 0.75;
      const hue      = 20 + progress * 30; // orange → amber
      p.el.style.cssText = `
        left: ${p.x}px;
        top: ${p.y}px;
        width: ${size}px;
        height: ${size}px;
        opacity: ${opacity};
        background: hsl(${hue},100%,${55 - progress * 20}%);
        box-shadow: 0 0 ${size * 2}px hsl(${hue},100%,55%);
        transform: translate(-50%,-50%) scale(${1 - progress * 0.5});
      `;
    });

    frame++;
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    trail.forEach(p => { p.el.style.opacity = '0'; });
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ══ CONTACT FORM ══ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const msg   = document.getElementById('msgInput').value.trim();
  if (!name || !email || !msg) return;

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
  window.location.href = `mailto:realambera.official@gmail.com?subject=${subject}&body=${body}`;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
  formSuccess.classList.add('show');
  contactForm.reset();

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    formSuccess.classList.remove('show');
  }, 4000);
});

/* ══ BACK TO TOP ══ */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══ ACTIVE NAV LINK HIGHLIGHT ══ */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--orange-light)' : '';
  });
});

/* ══ HERO PARTICLES ══ */
(function createParticles() {
  const hero = document.getElementById('hero');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,${Math.floor(Math.random() * 80)},0,${Math.random() * 0.4 + 0.1});
      top: ${Math.random() * 85 + 5}%;
      left: ${Math.random() * 100}%;
      pointer-events: none;
      z-index: 3;
      animation: particleDrift ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    hero.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleDrift {
      0%,100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
      33% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
      66% { transform: translateY(15px) translateX(-8px); opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);
})();

/* ══ TYPEWRITER EFFECT ══ */
(function typewriter() {
  const el = document.querySelector('.type-cursor');
  if (!el) return;
  const texts = ['Software Developer', 'Full Stack Engineer', 'Problem Solver', 'Tech Enthusiast'];
  let textIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = texts[textIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  setTimeout(type, 2500);
})();

/* ══════════════════════════════════════════
   GALLERY — 3D Tilt, Stagger Reveal, Particles
══════════════════════════════════════════ */
(function initGallery() {
  /* ── 3D Tilt on hover ── */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  /* ── Stagger reveal for gallery cards ── */
  const galleryCards = document.querySelectorAll('.gallery-card.fade-in');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allCards = Array.from(galleryCards);
        const idx = allCards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 150);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  galleryCards.forEach(card => galleryObserver.observe(card));

  /* ── Floating orange particles ── */
  const particleContainer = document.getElementById('galleryParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'gallery-particle';
      const size = Math.random() * 4 + 1.5;
      const hue = 15 + Math.random() * 25;
      const duration = 6 + Math.random() * 10;
      const delay = Math.random() * duration;
      const left = Math.random() * 100;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -${size + 10}px;
        background: hsl(${hue}, 100%, ${50 + Math.random() * 15}%);
        box-shadow: 0 0 ${size * 3}px hsl(${hue}, 100%, 55%);
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ── Register gallery cards with fire cursor hover ── */
  const ring = document.getElementById('cursorRing');
  if (ring) {
    tiltCards.forEach(card => {
      card.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      card.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }
})();

console.log('%c Amber Awasthi Portfolio 🔥', 'color:#ff6a00; font-size:18px; font-weight:900;');

