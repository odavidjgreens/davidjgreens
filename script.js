// ============================================================
//  script.js — Animações GSAP + Dark Mode
// ============================================================

// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


// ============================================================
//  DARK MODE TOGGLE
// ============================================================
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Lê preferência salva ou usa preferência do sistema
const savedTheme  = localStorage.getItem('theme');
const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
html.setAttribute('data-theme', initialTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  // Pequena animação no botão ao clicar
  gsap.fromTo(themeToggle,
    { scale: 0.85, rotate: -20 },
    { scale: 1,    rotate: 0,   duration: 0.35, ease: 'back.out(2)' }
  );
});


// ============================================================
//  NAVBAR — sombra ao rolar
// ============================================================
const navbar = document.getElementById('navbar');

ScrollTrigger.create({
  start: 'top -60',
  onEnter:      () => gsap.to(navbar, { boxShadow: '0 4px 24px rgba(0,0,0,0.1)', duration: 0.3 }),
  onLeaveBack:  () => gsap.to(navbar, { boxShadow: '0 0px 0px rgba(0,0,0,0)',    duration: 0.3 }),
});


// ============================================================
//  HERO — entrada sequencial
// ============================================================
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
  .to('.hero-tag', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power3.out',
    from: { y: 20 }
  })
  .fromTo('.hero-title',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.hero-subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.hero-code',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.hero-btns',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
    '-=0.3'
  );


// ============================================================
//  HELPER — anima elementos ao entrar no viewport
// ============================================================
function revealOnScroll(selector, options = {}) {
  const els = gsap.utils.toArray(selector);

  els.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: options.y ?? 30 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.65,
        ease: options.ease ?? 'power3.out',
        delay: (options.stagger ?? 0.1) * i,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}


// ============================================================
//  SOBRE — textos e stat-boxes
// ============================================================
revealOnScroll('.sobre-text-col .section-label, .sobre-text-col .section-title', { stagger: 0.12 });
revealOnScroll('.sobre-text',  { stagger: 0.12 });
revealOnScroll('.stat-box',    { stagger: 0.12, y: 20 });


// ============================================================
//  SKILLS — cards com entrada em cascata + barras animadas
// ============================================================
revealOnScroll('.skill-card', { stagger: 0.08, y: 24 });

// Anima as barras de progresso quando entram na tela
gsap.utils.toArray('.skill-bar').forEach((bar) => {
  const targetWidth = bar.getAttribute('data-width') + '%';

  ScrollTrigger.create({
    trigger: bar,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(bar, {
        width: targetWidth,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.15,
      });
    }
  });
});


// ============================================================
//  PROJETOS — cards com stagger
// ============================================================
revealOnScroll('.project-card', { stagger: 0.1, y: 36 });


// ============================================================
//  CONTATO — info e formulário
// ============================================================
revealOnScroll('.contato-info .section-label, .contato-info .section-title, .contato-desc', { stagger: 0.12 });
revealOnScroll('.contact-item',  { stagger: 0.1, y: 20 });
revealOnScroll('.contato-form',  { y: 30, stagger: 0 });


// ============================================================
//  BOTÕES — efeito de press ao clicar
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    gsap.to(btn, { scale: 0.96, duration: 0.1, ease: 'power2.out' });
  });
  btn.addEventListener('mouseup', () => {
    gsap.to(btn, { scale: 1,    duration: 0.2, ease: 'back.out(3)' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { scale: 1,    duration: 0.15 });
  });
});


// ============================================================
//  LINKS DE NAVEGAÇÃO — scroll suave com highlight ativo
// ============================================================
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function setActiveLink(id) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + id;
    gsap.to(link, {
      color: isActive ? 'var(--accent)' : 'var(--text2)',
      fontWeight: isActive ? 600 : 400,
      duration: 0.3,
    });
  });
}

sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end:   'bottom 55%',
    onEnter:      () => setActiveLink(section.id),
    onEnterBack:  () => setActiveLink(section.id),
  });
});


// ============================================================
//  FORMULÁRIO — envio funcional
// ============================================================

// ── OPÇÃO A: mailto (funciona sem configuração) ──────────────
// Abre o cliente de e-mail do usuário com os dados preenchidos.
// Troque pelo Formspree (Opção B) quando tiver uma conta.

// ── OPÇÃO B: Formspree (recomendado para produção) ───────────
// 1. Crie conta gratuita em https://formspree.io
// 2. Crie um Form e copie o endpoint (ex: https://formspree.io/f/xyzabcde)
// 3. Defina USE_FORMSPREE = true e cole o endpoint abaixo

const USE_FORMSPREE   = false;
const FORMSPREE_URL   = 'https://formspree.io/f/SEU_ID_AQUI'; // ← troque
const SEU_EMAIL       = 'davidjuniorsilva10@gmail.com';

// ─────────────────────────────────────────────────────────────

const sendBtn = document.querySelector('.btn-full');

function shakeBtn() {
  gsap.fromTo(sendBtn,
    { x: -8 },
    { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)',
      keyframes: { x: [-8, 8, -6, 6, -3, 3, 0] }
    }
  );
}

function feedbackSucesso() {
  const textoOriginal = sendBtn.textContent;
  sendBtn.textContent = '✓ Mensagem enviada!';
  sendBtn.style.background = '#10b981';
  sendBtn.disabled = true;

  gsap.fromTo(sendBtn,
    { scale: 0.95 },
    { scale: 1, duration: 0.4, ease: 'back.out(2)' }
  );

  setTimeout(() => {
    sendBtn.textContent      = textoOriginal;
    sendBtn.style.background = '';
    sendBtn.disabled         = false;
    document.getElementById('nome').value     = '';
    document.getElementById('email').value    = '';
    document.getElementById('assunto').value  = '';
    document.getElementById('mensagem').value = '';
  }, 3000);
}

function feedbackErro() {
  const textoOriginal = sendBtn.textContent;
  sendBtn.textContent = '✗ Erro ao enviar. Tente novamente.';
  sendBtn.style.background = '#ef4444';
  sendBtn.disabled = true;

  setTimeout(() => {
    sendBtn.textContent      = textoOriginal;
    sendBtn.style.background = '';
    sendBtn.disabled         = false;
  }, 3000);
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const assunto  = document.getElementById('assunto').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Validação básica
    if (!nome || !email || !mensagem) {
      shakeBtn();
      return;
    }

    // Validação de formato de e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      shakeBtn();
      document.getElementById('email').focus();
      return;
    }

    // ── OPÇÃO B: Formspree ──
    if (USE_FORMSPREE) {
      sendBtn.textContent = 'Enviando...';
      sendBtn.disabled    = true;

      try {
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ nome, email, assunto, mensagem }),
        });

        if (res.ok) {
          feedbackSucesso();
        } else {
          feedbackErro();
        }
      } catch {
        feedbackErro();
      }

    // ── OPÇÃO A: mailto ──
    } else {
      const subject = encodeURIComponent(assunto || `Contato de ${nome} via portfólio`);
      const body    = encodeURIComponent(
        `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`
      );
      window.location.href = `mailto:${SEU_EMAIL}?subject=${subject}&body=${body}`;
      feedbackSucesso();
    }
  });
}