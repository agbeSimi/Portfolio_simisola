document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Menu mobile ---------- */
    const menuButton = document.querySelector('#mobile-menu');
    const navList = document.querySelector('#nav-links');
    const navLinks = navList.querySelectorAll('a');

    function setMenu(open) {
        menuButton.classList.toggle('active', open);
        navList.classList.toggle('active', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    menuButton.addEventListener('click', () => {
        setMenu(!navList.classList.contains('active'));
    });

    navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenu(false);
    });

    /* ---------- En-tête et bouton retour en haut ---------- */
    const header = document.querySelector('#header');
    const backToTop = document.querySelector('#backToTop');

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 30);
        backToTop.classList.toggle('show', window.scrollY > 300);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Lien actif dans la navigation ---------- */
    const sections = document.querySelectorAll('main section[id]');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    /* ---------- Copie de l'email et du téléphone ---------- */
    document.querySelectorAll('.copy-btn').forEach(button => {
        const label = button.textContent;

        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = 'Copié';
            } catch {
                button.textContent = 'Copie impossible';
            }
            setTimeout(() => { button.textContent = label; }, 2000);
        });
    });
});
