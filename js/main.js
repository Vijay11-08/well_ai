/**
 * NeuroNiv — AI-Native Engineering Studio
 * Premium Motion & Interactive Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    /* ==========================================================================
       1. CUSTOM CURSOR — Luminous Ring, High-Precision Arrow & Sparkle Trail
       ========================================================================== */
    if (!isTouchDevice && !prefersReducedMotion) {
        const cursorRing = document.createElement('div');
        cursorRing.id = 'cursor-ring';
        document.body.appendChild(cursorRing);

        const cursorDot = document.createElement('div');
        cursorDot.id = 'cursor-dot';
        document.body.appendChild(cursorDot);

        const cursorArrow = document.createElement('div');
        cursorArrow.id = 'cursor-arrow';
        cursorArrow.innerHTML = `
            <svg viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0624093 2.63315C-0.364399 0.858711 1.48098 -0.56636 3.06827 0.222996L3.22061 0.306004L17.9921 9.10581C19.6149 10.0726 19.268 12.5174 17.4403 12.9945L11.0976 14.6488L8.08194 20.1322C7.14495 21.8351 4.60242 21.4942 4.14737 19.6039L0.0624093 2.63315Z" fill="#e879f9"/>
                <path d="M2.45315 1.5952C1.97515 1.31043 1.39011 1.74137 1.52034 2.28232L5.60604 19.2537C5.74041 19.8119 6.49121 19.9125 6.76789 19.4094L10.0946 13.3608L17.0614 11.5434C17.6012 11.4026 17.7037 10.6807 17.2245 10.3952L2.45315 1.5952Z" fill="white"/>
            </svg>
        `;
        document.body.appendChild(cursorArrow);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let isVisible = false;
        let lastSparkleTime = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                cursorRing.style.opacity = '1';
                cursorDot.style.opacity = '1';
                cursorArrow.style.opacity = '1';
                isVisible = true;
            }

            cursorArrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            cursorDot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

            // Spawn subtle trail sparkle
            const now = performance.now();
            if (now - lastSparkleTime > 45) {
                lastSparkleTime = now;
                spawnSparkle(mouseX, mouseY);
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursorRing.style.opacity = '0';
            cursorDot.style.opacity = '0';
            cursorArrow.style.opacity = '0';
            isVisible = false;
        });

        // Hover expand on interactive elements
        const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, .industry-tile, .service-card, .ai-flow-step, .problem-card, .capability-card, .principle-card, .insight-card, .marketing-service-card, .cap-strip-item, .growth-funnel-step';
        const addHoverListeners = (el) => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovered');
                cursorArrow.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovered');
                cursorArrow.classList.remove('hovered');
            });
        };
        document.querySelectorAll(interactiveSelectors).forEach(addHoverListeners);

        // Dynamic element observer
        const mutObs = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches(interactiveSelectors)) addHoverListeners(node);
                    if (node.querySelectorAll) node.querySelectorAll(interactiveSelectors).forEach(addHoverListeners);
                }
            }));
        });
        mutObs.observe(document.body, { childList: true, subtree: true });

        // Click effect
        document.addEventListener('mousedown', () => {
            cursorRing.classList.add('clicked');
            cursorDot.classList.add('clicked');
            setTimeout(() => {
                cursorRing.classList.remove('clicked');
                cursorDot.classList.remove('clicked');
            }, 300);
        });

        // Smooth lagging ring with RAF
        const updateRing = () => {
            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;
            cursorRing.style.transform = `translate3d(${ringX - 19}px, ${ringY - 19}px, 0)`;
            requestAnimationFrame(updateRing);
        };
        updateRing();

        function spawnSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.className = 'cursor-sparkle';
            const offsetX = (Math.random() - 0.5) * 12;
            const offsetY = (Math.random() - 0.5) * 12;
            const size = Math.random() * 4 + 2;

            sparkle.style.left = `${x + offsetX}px`;
            sparkle.style.top = `${y + offsetY}px`;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.opacity = '0.85';
            document.body.appendChild(sparkle);

            requestAnimationFrame(() => {
                sparkle.style.transform = `translate(${offsetX * 1.5}px, ${offsetY * 1.5 - 12}px) scale(0)`;
                sparkle.style.opacity = '0';
            });
            setTimeout(() => sparkle.remove(), 550);
        }
    }

    /* ==========================================================================
       2. SCROLL REVEAL — Blur to Clear & Translation
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    document.querySelectorAll('.fade-up, .stagger-child').forEach(el => revealObserver.observe(el));

    // Staggered lists / rows
    document.querySelectorAll('.fade-up-stagger').forEach(parent => {
        Array.from(parent.children).forEach((child, i) => {
            child.classList.add('fade-up');
            child.style.transitionDelay = `${i * 0.08}s`;
            revealObserver.observe(child);
        });
    });

    /* ==========================================================================
       3. NAVBAR — Top to Docked Bottom Navigation with Smooth Morph
       ========================================================================== */
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('site-header');
        let docked = false;
        const updateNavDock = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            if (!docked && y > 140) {
                docked = true;
                header.classList.add('nav-bottom', 'nav-scrolled');
                header.classList.remove('nav-top');
                document.body.classList.add('has-bottom-nav');
            } else if (docked && y < 50) {
                docked = false;
                header.classList.remove('nav-bottom', 'nav-scrolled');
                header.classList.add('nav-top');
                document.body.classList.remove('has-bottom-nav');
            }
        };
        updateNavDock();
        window.addEventListener('scroll', updateNavDock, { passive: true });
    }

    /* ==========================================================================
       3b. MOBILE NAV OVERLAY
       ========================================================================== */
    (function initMobileNav() {
        if (!header) return;
        const toggle = header.querySelector('.nav-toggle, button[aria-label="Open menu"]');
        const desktopNav = header.querySelector('nav');
        if (!toggle || !desktopNav) return;

        toggle.classList.add('nav-toggle');
        toggle.setAttribute('aria-controls', 'mobileNav');
        toggle.setAttribute('aria-expanded', 'false');

        const panel = document.createElement('div');
        panel.id = 'mobileNav';
        panel.className = 'mobile-nav';
        panel.setAttribute('hidden', '');

        const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const linksHtml = Array.from(desktopNav.querySelectorAll('a')).map((a) => {
            const href = a.getAttribute('href') || '#';
            const file = href.split('/').pop().split('#')[0].toLowerCase() || 'index.html';
            const isCurrent = file === currentPage;
            return `<a href="${href}" class="mobile-nav-link${isCurrent ? ' is-current' : ''}">${a.textContent.trim()}</a>`;
        }).join('');

        panel.innerHTML = `
            <nav class="mobile-nav-links" aria-label="Mobile Navigation">
                ${linksHtml}
                <a href="contact.html" class="btn-primary-custom mobile-nav-cta">
                    Contact Us
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                </a>
            </nav>
        `;
        document.body.appendChild(panel);

        const setOpen = (open) => {
            document.body.classList.toggle('nav-open', open);
            panel.classList.toggle('is-open', open);
            if (open) panel.removeAttribute('hidden');
            else panel.setAttribute('hidden', '');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        toggle.addEventListener('click', () => {
            setOpen(!document.body.classList.contains('nav-open'));
        });
        panel.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setOpen(false));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) setOpen(false);
        });
    })();

    /* ==========================================================================
       4. HERO NEURAL NETWORK & SYNAPTIC DATA FLOW CANVAS
       ========================================================================== */
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && !prefersReducedMotion) {
        let canvas = heroSection.querySelector('#hero-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'hero-canvas';
            canvas.style.position = 'absolute';
            canvas.style.inset = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '0';
            heroSection.insertBefore(canvas, heroSection.firstChild);
        }

        const ctx = canvas.getContext('2d');
        let width = 0, height = 0;
        let nodes = [];
        let pulses = [];
        const nodeCount = window.innerWidth < 768 ? 38 : 72;
        const connectionDist = window.innerWidth < 768 ? 95 : 135;
        let mouseX = -9999, mouseY = -9999;

        const resize = () => {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            mouseX = -9999;
            mouseY = -9999;
        });

        // Initialize neural nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.55,
                vy: (Math.random() - 0.5) * 0.55,
                radius: Math.random() * 1.8 + 1.2,
                color: Math.random() > 0.4 ? 'rgba(232, 121, 249,' : 'rgba(139, 92, 246,',
                alpha: Math.random() * 0.5 + 0.3
            });
        }

        // Periodic data pulse generation
        setInterval(() => {
            if (nodes.length < 2) return;
            const fromIdx = Math.floor(Math.random() * nodes.length);
            const a = nodes[fromIdx];
            for (let j = 0; j < nodes.length; j++) {
                if (fromIdx === j) continue;
                const b = nodes[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < connectionDist) {
                    pulses.push({
                        from: a,
                        to: b,
                        progress: 0,
                        speed: Math.random() * 0.025 + 0.015,
                        color: Math.random() > 0.5 ? '#e879f9' : '#38bdf8'
                    });
                    break;
                }
            }
            if (pulses.length > 25) pulses.shift();
        }, 320);

        let animationFrameId;
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Update & draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                // Mouse gentle repulsion
                const dx = n.x - mouseX;
                const dy = n.y - mouseY;
                const dist = Math.hypot(dx, dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120 * 0.8;
                    n.x += (dx / dist) * force;
                    n.y += (dy / dist) * force;
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${n.color} ${n.alpha})`;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const d = Math.hypot(n.x - m.x, n.y - m.y);
                    if (d < connectionDist) {
                        const alpha = (1 - d / connectionDist) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.strokeStyle = `rgba(232, 121, 249, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }
            }

            // Draw data pulses along synaptic filaments
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += pulse.speed;
                if (pulse.progress >= 1) {
                    pulses.splice(p, 1);
                    continue;
                }
                const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
                const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;
                ctx.beginPath();
                ctx.arc(px, py, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = pulse.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = pulse.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        // Pause canvas when out of view
        const heroObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!animationFrameId) render();
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }, { threshold: 0.05 });
        heroObserver.observe(heroSection);
    }

    /* ==========================================================================
       5. STAT COUNTER ANIMATION — High-Precision Easing
       ========================================================================== */
    const statCards = document.querySelectorAll('.stat-card .fs-3');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const numMatch = raw.match(/\d+(\.\d+)?/);
            if (!numMatch) return;

            const target = parseFloat(numMatch[0]);
            const suffix = raw.replace(numMatch[0], '');
            const isDecimal = raw.includes('.');
            const duration = 1200;
            const startTime = performance.now();

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Cubic ease out
                const ease = 1 - Math.pow(1 - progress, 3);
                const val = ease * target;
                el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            statObserver.unobserve(el);
        });
    }, { threshold: 0.35 });
    statCards.forEach(el => statObserver.observe(el));

    /* ==========================================================================
       6. CARD SPOTLIGHT HOVER & MICRO-TILT
       ========================================================================== */
    if (!isTouchDevice && !prefersReducedMotion) {
        document.querySelectorAll('.glass-card, .service-card, .ai-flow-step, .problem-card, .principle-card, .insight-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const dx = (x - cx) / cx;
                const dy = (y - cy) / cy;

                // Subtle 3D tilt under 3 degrees
                card.style.transform = `perspective(900px) rotateY(${dx * 2.5}deg) rotateX(${-dy * 2.5}deg) translateY(-4px)`;
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ==========================================================================
       7. AI FLOW PIPELINE INTERACTIVE HIGHLIGHT
       ========================================================================== */
    const flowSteps = document.querySelectorAll('.ai-flow-step');
    if (flowSteps.length > 0) {
        let activeIdx = 0;
        setInterval(() => {
            flowSteps.forEach((step, idx) => {
                if (idx === activeIdx) {
                    step.style.borderColor = 'rgba(232, 121, 249, 0.7)';
                    step.style.boxShadow = '0 0 20px rgba(232, 121, 249, 0.2)';
                } else {
                    step.style.borderColor = '';
                    step.style.boxShadow = '';
                }
            });
            activeIdx = (activeIdx + 1) % flowSteps.length;
        }, 1800);
    }

    /* ==========================================================================
       8. MARQUEE HOVER PAUSE
       ========================================================================== */
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
        marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
    }
});
