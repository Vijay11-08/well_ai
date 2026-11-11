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

        // Smooth cursor positioning (passive & 60fps)
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
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursorRing.style.opacity = '0';
            cursorDot.style.opacity = '0';
            cursorArrow.style.opacity = '0';
            isVisible = false;
        });

        // High performance event delegation for hover states (No DOM thrashing, zero MutationObserver penalty)
        const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, .industry-tile, .service-card, .ai-flow-step, .problem-card, .capability-card, .principle-card, .insight-card, .marketing-service-card, .cap-strip-item, .growth-funnel-step, .faq-card-modern, .contact-submit-btn, .whatsapp-floating-btn, .phone-floating-btn, .chatbot-trigger-btn';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
                cursorRing.classList.add('hovered');
                cursorArrow.classList.add('hovered');
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
                cursorRing.classList.remove('hovered');
                cursorArrow.classList.remove('hovered');
            }
        }, { passive: true });

        // Click effect
        document.addEventListener('mousedown', () => {
            cursorRing.classList.add('clicked');
            cursorDot.classList.add('clicked');
            setTimeout(() => {
                cursorRing.classList.remove('clicked');
                cursorDot.classList.remove('clicked');
            }, 250);
        });

        // Smooth lagging ring with RAF
        const updateRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate3d(${ringX - 19}px, ${ringY - 19}px, 0)`;
            requestAnimationFrame(updateRing);
        };
        updateRing();
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

    /* ==========================================================================
       9. NEURONIV SHARED BACKGROUND ANIMATION SYSTEM (ALL PAGES)
       ========================================================================== */
    (function initNeuroNivBackground() {
        if (prefersReducedMotion) return;

        // Ensure single global background container
        let bgContainer = document.querySelector('.nn-bg-system');
        if (!bgContainer) {
            bgContainer = document.createElement('div');
            bgContainer.className = 'nn-bg-system';
            bgContainer.setAttribute('aria-hidden', 'true');
            bgContainer.innerHTML = `
                <div class="nn-bg-system__layer-gradient"></div>
                <div class="nn-bg-system__layer-grid"></div>
                <canvas class="nn-bg-system__canvas" id="nnBgCanvas"></canvas>
            `;
            document.body.insertBefore(bgContainer, document.body.firstChild);
        }

        const canvas = document.getElementById('nnBgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Identify current page
        const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const isServices = path.includes('services');
        const isAbout = path.includes('about');
        const isWork = path.includes('work');
        const isCareers = path.includes('careers');
        const isContact = path.includes('contact');

        let width = 0, height = 0;
        let particles = [];
        let networkNodes = [];
        let pulses = [];
        let mouseX = -9999, mouseY = -9999;

        // Particle and node density adapted for mobile & page context
        const isMobile = window.innerWidth < 768;
        const nodeDensity = isMobile ? (isServices ? 16 : 14) : (isServices ? 36 : (isAbout ? 24 : 28));
        const particleDensity = isMobile ? 18 : (isAbout ? 25 : 40);
        const connectionThreshold = isMobile ? 100 : (isServices ? 170 : 140);

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes();
        }

        function initNodes() {
            networkNodes = [];
            particles = [];

            // Background floating neural nodes
            for (let i = 0; i < nodeDensity; i++) {
                networkNodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * (isAbout ? 0.25 : 0.45),
                    vy: (Math.random() - 0.5) * (isAbout ? 0.25 : 0.45),
                    radius: Math.random() * 2 + 1.2,
                    color: Math.random() > 0.4 ? 'rgba(232, 121, 249,' : (Math.random() > 0.5 ? 'rgba(139, 92, 246,' : 'rgba(56, 189, 248,'),
                    alpha: Math.random() * 0.4 + 0.2,
                    highlight: 0
                });
            }

            // Floating subtle dust particles
            for (let j = 0; j < particleDensity; j++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: -Math.random() * 0.3 - 0.1, // gently rising
                    size: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.4 + 0.1,
                    pulse: Math.random() * Math.PI
                });
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouseX = -9999;
            mouseY = -9999;
        });

        // Periodic light pulse along connected lines
        setInterval(() => {
            if (networkNodes.length < 2) return;
            const fromIdx = Math.floor(Math.random() * networkNodes.length);
            const a = networkNodes[fromIdx];
            for (let j = 0; j < networkNodes.length; j++) {
                if (fromIdx === j) continue;
                const b = networkNodes[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < connectionThreshold) {
                    pulses.push({
                        from: a,
                        to: b,
                        progress: 0,
                        speed: Math.random() * 0.02 + 0.015,
                        color: Math.random() > 0.5 ? '#e879f9' : '#38bdf8'
                    });
                    break;
                }
            }
            if (pulses.length > 20) pulses.shift();
        }, isAbout ? 700 : 400);

        // Service page interactive node booster
        window.boostBackgroundAt = (x, y) => {
            networkNodes.forEach(node => {
                const dist = Math.hypot(node.x - x, node.y - y);
                if (dist < 320) {
                    node.highlight = 1;
                }
            });
        };

        let animFrame;
        function render() {
            ctx.clearRect(0, 0, width, height);

            // 1. Draw floating ambient particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.02;

                if (p.y < 0) p.y = height;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                const curAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 121, 249, ${Math.max(0.05, curAlpha)})`;
                ctx.fill();
            }

            // 2. Update and draw nodes
            for (let i = 0; i < networkNodes.length; i++) {
                const n = networkNodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                if (n.highlight > 0) {
                    n.highlight -= 0.02;
                }

                // Subtle cursor reaction
                const distMouse = Math.hypot(n.x - mouseX, n.y - mouseY);
                if (distMouse < 140 && distMouse > 0) {
                    const repel = (140 - distMouse) / 140 * 0.6;
                    n.x += ((n.x - mouseX) / distMouse) * repel;
                    n.y += ((n.y - mouseY) / distMouse) * repel;
                }

                const alpha = Math.min(1, n.alpha + n.highlight * 0.5);
                // Outer glow without shadowBlur performance penalty
                if (n.highlight > 0.1) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.radius + n.highlight * 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(232, 121, 249, ${n.highlight * 0.25})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius + n.highlight * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `${n.color} ${alpha})`;
                ctx.fill();

                // Connect nearby nodes
                for (let j = i + 1; j < networkNodes.length; j++) {
                    const m = networkNodes[j];
                    const dist = Math.hypot(n.x - m.x, n.y - m.y);
                    if (dist < connectionThreshold) {
                        const lineAlpha = (1 - dist / connectionThreshold) * 0.14 + (n.highlight + m.highlight) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.strokeStyle = `rgba(232, 121, 249, ${Math.min(0.6, lineAlpha)})`;
                        ctx.lineWidth = 0.75 + (n.highlight > 0.1 ? 0.75 : 0);
                        ctx.stroke();
                    }
                }
            }

            // 3. Draw synaptic pulses
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += pulse.speed;
                if (pulse.progress >= 1) {
                    pulses.splice(p, 1);
                    continue;
                }
                const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
                const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

                // Glowing outer halo + inner core without shadowBlur
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(232, 121, 249, 0.28)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fillStyle = pulse.color;
                ctx.fill();
            }

            animFrame = requestAnimationFrame(render);
        }
        render();

        // Pause animation when tab is inactive to preserve battery
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animFrame);
            } else {
                animFrame = requestAnimationFrame(render);
            }
        });
    })();

    /* ==========================================================================
       10. SERVICE CARD NETWORK HOVER INTERACTION (SERVICES PAGE)
       ========================================================================== */
    (function initServiceHoverEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        if (!serviceCards.length) return;

        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                card.classList.add('service-highlighted');
                if (typeof window.boostBackgroundAt === 'function') {
                    const rect = card.getBoundingClientRect();
                    window.boostBackgroundAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('service-highlighted');
            });
        });
    })();

    /* ==========================================================================
       11. TRANSMISSION ENGINE FOR CONTACT FORM (5-STAGE EXPERIENCE)
       ========================================================================== */
    window.initTransmissionFlow = function({
        formEl,
        overlayEl,
        stagePackage,
        stageTransmit,
        stageSuccess,
        stageError,
        progressBar,
        payload,
        onComplete,
        onErrorRetry
    }) {
        if (!overlayEl) return;

        overlayEl.classList.add('active');

        // Helper to switch stages smoothly
        const showStage = (targetStage) => {
            [stagePackage, stageTransmit, stageSuccess, stageError].forEach(s => {
                if (!s) return;
                s.classList.remove('is-visible');
            });
            if (targetStage) {
                targetStage.classList.add('is-visible');
            }
        };

        // Populate Packet Metadata in Stage 1
        const metaName = overlayEl.querySelector('#packetSender');
        const metaService = overlayEl.querySelector('#packetService');
        const metaTimestamp = overlayEl.querySelector('#packetTime');
        if (metaName) metaName.textContent = payload.fullName || 'Anonymous';
        if (metaService) metaService.textContent = payload.projectType || 'General Inquiry';
        if (metaTimestamp) metaTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // STAGE 1 & 2: Packaging Message (0 - 550ms)
        showStage(stagePackage);
        if (progressBar) progressBar.style.width = '20%';

        // Setup Transmission Canvas
        const transCanvas = overlayEl.querySelector('#transmissionCanvas');
        let tCtx = null;
        let transAnimId = null;
        if (transCanvas && !prefersReducedMotion) {
            transCanvas.width = overlayEl.offsetWidth;
            transCanvas.height = overlayEl.offsetHeight;
            tCtx = transCanvas.getContext('2d');
        }

        let isDelivering = false;
        let transmissionFailed = false;
        let failureReason = '';

        // Real API Call
        const apiPromise = fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            const data = await res.json().catch(() => ({}));
            if (res.ok && data && data.success) {
                return { success: true };
            }
            throw new Error(data.error || 'Server could not deliver message. Status: ' + res.status);
        });

        // STAGE 3: Transmission animation along glowing path (550ms -> 1400ms)
        setTimeout(() => {
            showStage(stageTransmit);
            if (progressBar) progressBar.style.width = '60%';

            // Draw glowing data packet travel on canvas
            if (tCtx && transCanvas) {
                const W = transCanvas.width;
                const H = transCanvas.height;
                let travelProgress = 0;

                const drawTransmission = () => {
                    tCtx.clearRect(0, 0, W, H);

                    const startX = W * 0.2;
                    const startY = H * 0.7;
                    const endX = W * 0.8;
                    const endY = H * 0.3;
                    const cpX = W * 0.5;
                    const cpY = H * 0.85;

                    // Draw connecting circuit path
                    tCtx.beginPath();
                    tCtx.moveTo(startX, startY);
                    tCtx.quadraticCurveTo(cpX, cpY, endX, endY);
                    tCtx.strokeStyle = 'rgba(232, 121, 249, 0.2)';
                    tCtx.lineWidth = 2;
                    tCtx.stroke();

                    // Animate packet along curve
                    travelProgress = Math.min(travelProgress + 0.02, 1);
                    const t = travelProgress;
                    const curX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * endX;
                    const curY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * endY;

                    // Packet glow outer ring + solid core (GPU friendly)
                    tCtx.beginPath();
                    tCtx.arc(curX, curY, 9, 0, Math.PI * 2);
                    tCtx.fillStyle = 'rgba(56, 189, 248, 0.28)';
                    tCtx.fill();

                    tCtx.beginPath();
                    tCtx.arc(curX, curY, 4.5, 0, Math.PI * 2);
                    tCtx.fillStyle = '#38bdf8';
                    tCtx.fill();

                    if (travelProgress < 1 && !isDelivering) {
                        transAnimId = requestAnimationFrame(drawTransmission);
                    }
                };
                drawTransmission();
            }

            // Await API Confirmation
            apiPromise
                .then(() => {
                    isDelivering = true;
                    if (progressBar) progressBar.style.width = '100%';

                    // STAGE 4 & 5: Delivery & Success Confirmation
                    setTimeout(() => {
                        if (tCtx && transCanvas) tCtx.clearRect(0, 0, transCanvas.width, transCanvas.height);
                        showStage(stageSuccess);

                        if (typeof onComplete === 'function') {
                            onComplete();
                        }
                    }, 400);
                })
                .catch(err => {
                    transmissionFailed = true;
                    isDelivering = true;
                    failureReason = err.message || 'Unable to transmit message.';
                    if (tCtx && transCanvas) tCtx.clearRect(0, 0, transCanvas.width, transCanvas.height);

                    // STAGE 4 (Error variant)
                    const errorMsgEl = overlayEl.querySelector('#packetErrorMsg');
                    if (errorMsgEl) errorMsgEl.textContent = failureReason;
                    showStage(stageError);

                    if (typeof onErrorRetry === 'function') {
                        const retryBtn = overlayEl.querySelector('#packetRetryBtn');
                        if (retryBtn) {
                            retryBtn.onclick = () => {
                                overlayEl.classList.remove('active');
                                onErrorRetry();
                            };
                        }
                    }
                });

        }, 600);
    };
});

