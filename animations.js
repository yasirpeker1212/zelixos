/* ============================================
   ZelixOS — Animations & Interactions
   Scroll reveals, navbar, mobile menu, etc.
   ============================================ */

(function () {
    /* ── Scroll Reveal ──────────────────────── */
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        reveals.forEach(el => observer.observe(el));
    }

    /* ── Navbar Scroll Effect ───────────────── */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    navbar.classList.toggle('scrolled', window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ── Mobile Menu ────────────────────────── */
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Active Nav Link ────────────────────── */
    function initActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;

        // Remove all existing active classes from nav links first
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });

        // Find the best match: prefer exact page+hash, then page-only (no hash in href)
        let bestMatch = null;
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const parts = href.split('/').pop();
            const [page, hash] = (parts || 'index.html').split('#');
            const linkPage = page || 'index.html';

            if (linkPage !== currentPath) return;

            // If link has a hash, it only matches if we're at that hash
            if (hash) {
                if (currentHash === '#' + hash) {
                    bestMatch = link;
                }
            } else {
                // Page-only link (no hash) — default match if nothing better found
                if (!bestMatch) {
                    bestMatch = link;
                }
            }
        });

        if (bestMatch) {
            bestMatch.classList.add('active');
        }
    }

    /* ── Smooth Counter Animation ───────────── */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = Math.round(ease * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    /* ── Wiki Sidebar Toggle (mobile) ───────── */
    function initWikiSidebar() {
        const toggle = document.querySelector('.wiki-mobile-toggle');
        const sidebar = document.querySelector('.wiki-sidebar');
        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            const isOpen = sidebar.classList.contains('open');
            toggle.innerHTML = isOpen
                ? '✕ Close Navigation'
                : '☰ Navigation';
        });
    }

    /* ── Wiki Sidebar Scroll Tracking ─────── */
    function initWikiScrollTracking() {
        const sidebarLinks = document.querySelectorAll('.wiki-sidebar a[href^="#"]');
        const sections = document.querySelectorAll('.wiki-section[id]');
        if (!sidebarLinks.length || !sections.length) return;

        // Click handler — immediately update active state
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Scroll tracking via IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        sidebarLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                        });
                    }
                });
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
        );

        sections.forEach(section => observer.observe(section));
    }

    /* ── Parallax Orbs on Mouse Move ────────── */
    function initParallaxOrbs() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const orbs = hero.querySelectorAll('.orb');
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            orbs.forEach((orb, i) => {
                const factor = (i + 1) * 15;
                orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    /* ── Tilt Effect on Cards ───────────────── */
    function initCardTilt() {
        const cards = document.querySelectorAll('.feature-card, .about-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 8;
                const rotateY = (x - 0.5) * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ── Initialise everything ──────────────── */
    function init() {
        initScrollReveal();
        initNavbarScroll();
        initMobileMenu();
        initActiveNavLink();
        initCounters();
        initWikiSidebar();
        initWikiScrollTracking();
        initParallaxOrbs();
        initCardTilt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
