document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ---------- Écran de chargement ---------- */
    const loader = document.querySelector('#loader');
    const startTime = performance.now();

    function hideLoader() {
        const minDuration = reduceMotion ? 0 : 1500;
        const remaining = Math.max(0, minDuration - (performance.now() - startTime));
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('is-loading');
            revealHero();
        }, remaining);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader, { once: true });
        setTimeout(hideLoader, 4000); // sécurité si une ressource tarde
    }

    /* ---------- Menu mobile ---------- */
    const mobileMenuButton = document.querySelector('#mobile-menu');
    const navLinksList = document.querySelector('.nav-links');
    const navLinksA = document.querySelectorAll('.nav-links a');

    function toggleMenu(forceClose = false) {
        const open = forceClose ? false : !navLinksList.classList.contains('active');
        mobileMenuButton.classList.toggle('active', open);
        navLinksList.classList.toggle('active', open);
        mobileMenuButton.setAttribute('aria-expanded', String(open));
        mobileMenuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    mobileMenuButton.addEventListener('click', () => toggleMenu());
    navLinksA.forEach(link => link.addEventListener('click', () => toggleMenu(true)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinksList.classList.contains('active')) toggleMenu(true);
    });

    /* ---------- Défilement : en-tête, progression, retour en haut ---------- */
    const header = document.querySelector('#header');
    const progress = document.querySelector('#scrollProgress');
    const backToTopButton = document.querySelector('#backToTop');
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        header.classList.toggle('scrolled', scrollY > 30);
        backToTopButton.classList.toggle('show', scrollY > 300);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Lien actif dans la navigation ---------- */
    const sections = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksA.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    /* ---------- Apparition au défilement ---------- */
    const allReveals = [...document.querySelectorAll('.reveal')];
    const heroReveals = allReveals.filter(el => el.closest('.hero'));
    const otherReveals = allReveals.filter(el => !el.closest('.hero'));

    function markVisible(el) {
        el.classList.add('visible');
        // Une fois l'animation terminée, on libère la propriété transform pour l'effet 3D
        if (el.classList.contains('tilt')) {
            setTimeout(() => el.classList.remove('reveal', 'visible'), 1400);
        }
    }

    function revealHero() {
        heroReveals.forEach(markVisible);
    }

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    markVisible(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        otherReveals.forEach(el => revealObserver.observe(el));
    } else {
        otherReveals.forEach(markVisible);
    }

    /* ---------- Effet machine à écrire ---------- */
    const typed = document.querySelector('#typed');
    const roles = [
        'Développeur Fullstack',
        'Symfony & API Platform',
        'React & JavaScript',
        'Passionné de dev web'
    ];

    if (!reduceMotion) {
        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = true;

        function typeLoop() {
            const current = roles[roleIndex];
            if (deleting) {
                charIndex--;
                typed.textContent = current.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
                setTimeout(typeLoop, 40);
            } else {
                const next = roles[roleIndex];
                charIndex++;
                typed.textContent = next.slice(0, charIndex);
                if (charIndex === next.length) {
                    deleting = true;
                    setTimeout(typeLoop, 2200);
                } else {
                    setTimeout(typeLoop, 80);
                }
            }
        }
        setTimeout(typeLoop, 3500);
    }

    /* ---------- Effet glitch ponctuel sur le nom ---------- */
    const glitch = document.querySelector('.glitch');
    if (glitch && !reduceMotion) {
        setInterval(() => {
            glitch.classList.add('glitching');
            setTimeout(() => glitch.classList.remove('glitching'), 350);
        }, 5000);
    }

    /* ---------- Cartes 3D + reflet lumineux ---------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.tilt').forEach(card => {
            const maxTilt = 8;

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
                card.style.transform =
                    `perspective(900px) rotateX(${(0.5 - y) * maxTilt}deg) rotateY(${(x - 0.5) * maxTilt}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        /* Boutons magnétiques */
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        /* Halo lumineux qui suit le curseur */
        const glow = document.querySelector('#cursorGlow');
        let glowX = window.innerWidth / 2;
        let glowY = window.innerHeight / 2;
        let targetX = glowX;
        let targetY = glowY;

        window.addEventListener('mousemove', e => {
            targetX = e.clientX;
            targetY = e.clientY;
            glow.classList.add('visible');
        }, { passive: true });

        document.addEventListener('mouseleave', () => glow.classList.remove('visible'));

        (function followCursor() {
            glowX += (targetX - glowX) * 0.12;
            glowY += (targetY - glowY) * 0.12;
            glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
            requestAnimationFrame(followCursor);
        })();
    }

    /* ---------- Copier email / téléphone ---------- */
    const toast = document.querySelector('#toast');
    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                showToast('✓ Copié dans le presse-papier');
                btn.textContent = 'Copié !';
                setTimeout(() => { btn.textContent = 'Copier'; }, 2000);
            } catch {
                showToast('Impossible de copier automatiquement');
            }
        });
    });

    /* ---------- Réseau de particules en arrière-plan ---------- */
    const canvas = document.querySelector('#particles');
    const ctx = canvas.getContext('2d');
    const mouse = { x: null, y: null, radius: 160 };
    let particles = [];
    let width = 0;
    let height = 0;
    let animationId = null;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(110, Math.floor((width * height) / 14000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.6 + 0.6,
            hue: Math.random() < 0.7 ? 188 : 262
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        const linkDist = 130;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Les particules s'écartent doucement du curseur
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += (dx / dist) * force * 1.5;
                    p.y += (dy / dist) * force * 1.5;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, 0.8)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < linkDist * linkDist) {
                    const alpha = 1 - Math.sqrt(distSq) / linkDist;
                    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.18})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();

    if (reduceMotion) {
        // Une seule image fixe, sans animation
        drawParticles();
        cancelAnimationFrame(animationId);
    } else {
        drawParticles();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 200);
        });

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });
        document.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Pause de l'animation quand l'onglet n'est pas visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                drawParticles();
            }
        });
    }
});
