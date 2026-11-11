/**
 * NeuroNiv — Unified Communication & AI Assistant Engine
 * 1. WhatsApp Integration (+91 83208 52144)
 * 2. Direct Phone Calling (+91 83208 52144)
 * 3. Custom Glassmorphic AI Chatbot with Rule-Based Decision Engine & Multi-Channel Handoff
 */

(function () {
    'use strict';

    // Official Business Communication Configuration
    const CONFIG = {
        WHATSAPP_PHONE: '918320852144',
        DISPLAY_PHONE: '+91 83208 52144',
        DEFAULT_WA_MESSAGE: 'Hello NeuroNiv, I would like to discuss a project.',
        SESSION_KEY: 'neuroniv_chat_session',
        GREETING_KEY: 'neuroniv_greeting_dismissed'
    };

    /**
     * Constructs official WhatsApp URL with pre-filled message
     */
    function getWhatsAppUrl(customMessage) {
        const msg = customMessage || CONFIG.DEFAULT_WA_MESSAGE;
        return `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }

    /**
     * Pre-selects service in contact form when visitor hands off from chatbot
     */
    function handleContactFormHandoff(serviceName) {
        const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.pathname.endsWith('contact');
        
        if (isContactPage) {
            const formHeading = document.getElementById('formHeading') || document.getElementById('contactForm');
            if (formHeading) {
                formHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (serviceName) {
                // Select matching chip if available
                const chips = document.querySelectorAll('.service-chip');
                chips.forEach(chip => {
                    const val = chip.getAttribute('data-val');
                    if (val && (val.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(val.toLowerCase()))) {
                        chip.click();
                    }
                });
                // Also update dropdown
                const select = document.getElementById('projectType');
                if (select) {
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
        } else {
            const targetUrl = serviceName 
                ? `contact.html?service=${encodeURIComponent(serviceName)}#contactForm`
                : 'contact.html#contactForm';
            window.location.href = targetUrl;
        }
    }

    /**
     * Future-proof AI engine abstraction:
     * Currently runs high-speed local decision tree with natural intent matching,
     * designed to plug seamlessly into a remote AI API if needed.
     */
    async function getBotResponse(userText, context) {
        const lower = (userText || '').toLowerCase().trim();
        const ctx = context || {};

        // 1. Handling Project Intake Flow
        if (ctx.step === 'awaiting_timeline') {
            ctx.timeline = userText;
            ctx.step = 'awaiting_action';
            return {
                text: `Got it — timeline: **${userText}** for your **${ctx.selectedService || 'digital'}** project.\n\nTell us briefly what you want to build, or choose your preferred communication channel:`,
                options: [
                    { label: '📝 Send Project Inquiry', action: 'handoff_contact', service: ctx.selectedService, cta: true },
                    { label: '💬 WhatsApp NeuroNiv', action: 'handoff_whatsapp', service: ctx.selectedService, whatsapp: true },
                    { label: '📞 Call NeuroNiv', action: 'handoff_phone', phone: true }
                ]
            };
        }

        if (ctx.step === 'awaiting_solution') {
            ctx.selectedService = userText;
            ctx.step = 'awaiting_timeline';
            return {
                text: `Excellent. What is your approximate timeline for the **${userText}** project?`,
                options: [
                    { label: '⚡ Immediate (< 1 month)', text: 'Immediate (< 1 month)' },
                    { label: '🗓️ 1 - 3 months', text: '1 - 3 months' },
                    { label: '🚀 3 - 6 months', text: '3 - 6 months' },
                    { label: '🔍 Flexible / Exploring', text: 'Flexible / Exploring' }
                ]
            };
        }

        // 2. Direct Core Triggers & Intent Matching
        if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml') || lower.includes('predictive') || lower.includes('llm')) {
            ctx.selectedService = 'AI & Machine Learning';
            return {
                text: 'We build practical AI and machine-learning solutions, including intelligent applications, predictive systems, automation and AI-powered workflows.\n\nWould you like to discuss an AI project?',
                options: [
                    { label: '✨ Yes, discuss my project', action: 'start_project', service: 'AI & Machine Learning', cta: true },
                    { label: '🌐 Explore AI services', link: 'services.html' },
                    { label: '💬 WhatsApp NeuroNiv', action: 'handoff_whatsapp', service: 'AI & Machine Learning', whatsapp: true }
                ]
            };
        }

        if (lower.includes('web') || lower.includes('saas') || lower.includes('application') || lower.includes('dashboard') || lower.includes('software')) {
            ctx.selectedService = 'Web Application Development';
            return {
                text: 'NeuroNiv builds custom web applications, dashboards, SaaS platforms, APIs and business systems designed around specific operational requirements.\n\nWhat are you planning to build?',
                options: [
                    { label: '💼 Business Application', action: 'start_project', service: 'Business Application' },
                    { label: '📊 Dashboard / Portal', action: 'start_project', service: 'Dashboard / Portal' },
                    { label: '☁️ SaaS Platform', action: 'start_project', service: 'SaaS Platform' },
                    { label: '🛠️ Custom Software', action: 'start_project', service: 'Custom Software' },
                    { label: '👥 Talk to the Team', action: 'handoff_whatsapp', service: 'Web Application', whatsapp: true }
                ]
            };
        }

        if (lower.includes('automation') || lower.includes('automate') || lower.includes('workflow') || lower.includes('process') || lower.includes('api')) {
            ctx.selectedService = 'Intelligent Automation';
            return {
                text: 'We can help automate repetitive business processes, connect systems and APIs, build workflows and reduce manual operational work.\n\nWhat would you like to automate?',
                options: [
                    { label: '⚙️ Business Process', action: 'start_project', service: 'Business Process Automation' },
                    { label: '🔗 API Integration', action: 'start_project', service: 'API Integration' },
                    { label: '🔄 Data Workflow', action: 'start_project', service: 'Data Workflow' },
                    { label: '📈 Reporting Automation', action: 'start_project', service: 'Reporting Automation' },
                    { label: '💬 Discuss Automation', action: 'handoff_whatsapp', service: 'Automation', whatsapp: true }
                ]
            };
        }

        if (lower.includes('digital marketing') || lower.includes('marketing') || lower.includes('google ads') || lower.includes('meta ads') || lower.includes('ads') || lower.includes('seo')) {
            ctx.selectedService = 'Digital Marketing & Growth';
            return {
                text: 'NeuroNiv provides digital growth solutions including Google Ads, Meta Ads, social media, content and performance-focused campaigns.',
                options: [
                    { label: '🎯 Google Ads', action: 'start_project', service: 'Google Ads Management' },
                    { label: '📱 Meta Ads', action: 'start_project', service: 'Meta Ads Campaigns' },
                    { label: '📈 Social Media Growth', action: 'start_project', service: 'Social Media Growth' },
                    { label: '✍️ Content Strategy', action: 'start_project', service: 'Content Strategy' },
                    { label: '💬 Talk to the Team', action: 'handoff_whatsapp', service: 'Digital Marketing', whatsapp: true }
                ]
            };
        }

        if (lower.includes('social media') || lower.includes('instagram') || lower.includes('linkedin') || lower.includes('branding')) {
            ctx.selectedService = 'Social Media Management';
            return {
                text: 'We help businesses build consistent social media presence through strategy, content and platform-focused execution.',
                options: [
                    { label: '📱 Social Media Management', action: 'start_project', service: 'Social Media Management' },
                    { label: '🎨 Content Creation', action: 'start_project', service: 'Content Creation' },
                    { label: '💡 Brand Strategy', action: 'start_project', service: 'Brand Strategy' },
                    { label: '🚀 Get Started', action: 'handoff_contact', service: 'Social Media', cta: true }
                ]
            };
        }

        if (lower.includes('start') || lower.includes('project') || lower.includes('quote') || lower.includes('hire') || lower.includes('pricing') || lower.includes('cost') || lower.includes('budget')) {
            ctx.step = 'awaiting_solution';
            return {
                text: "Great! Let's understand your project.\n\nWhat type of solution are you looking for?",
                options: [
                    { label: '🔮 AI & Machine Learning', text: 'AI & Machine Learning' },
                    { label: '💻 Web Application', text: 'Web Application' },
                    { label: '⚡ Automation System', text: 'Automation System' },
                    { label: '📈 Digital Growth & Marketing', text: 'Digital Growth & Marketing' },
                    { label: '🌐 Full Digital Solution', text: 'Full Digital Solution' }
                ]
            };
        }

        if (lower.includes('whatsapp') || lower.includes('chat') || lower.includes('human') || lower.includes('speak with human') || lower.includes('talk to someone')) {
            return {
                text: 'You can chat directly with our engineering and growth consultants on WhatsApp for an immediate discussion.',
                options: [
                    { label: '💬 Continue on WhatsApp', action: 'handoff_whatsapp', whatsapp: true, cta: true },
                    { label: '📞 Call Now', action: 'handoff_phone', phone: true }
                ]
            };
        }

        if (lower.includes('call') || lower.includes('phone') || lower.includes('number') || lower.includes('talk') || lower.includes('voice')) {
            return {
                text: `You can reach our team directly at **${CONFIG.DISPLAY_PHONE}**. Available Mon–Sat for project discovery calls.`,
                options: [
                    { label: `📞 Call ${CONFIG.DISPLAY_PHONE}`, action: 'handoff_phone', phone: true, cta: true },
                    { label: '💬 Chat on WhatsApp', action: 'handoff_whatsapp', whatsapp: true }
                ]
            };
        }

        if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('office') || lower.includes('rajkot')) {
            return {
                text: 'NeuroNiv is headquartered in **Rajkot, Gujarat, India**, engineering digital solutions for clients worldwide.\n\nWe would love to connect in person or via video consultation.',
                options: [
                    { label: '💬 WhatsApp Us', action: 'handoff_whatsapp', whatsapp: true },
                    { label: '📝 Submit Project Details', action: 'handoff_contact', cta: true }
                ]
            };
        }

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return {
                text: "Hello! Welcome to NeuroNiv. I'm here to help you learn about our AI systems, web platforms, and growth services.\n\nWhat are you looking to build or explore?",
                options: [
                    { label: '🔮 AI & Machine Learning', text: 'AI & Machine Learning' },
                    { label: '💻 Web Application', text: 'Web Application' },
                    { label: '⚡ Automation', text: 'Automation' },
                    { label: '📈 Digital Marketing', text: 'Digital Marketing' },
                    { label: '🚀 Start a Project', action: 'start_project', cta: true }
                ]
            };
        }

        // Generic intelligent fallback
        return {
            text: "I'd be happy to assist you with that! At NeuroNiv, we turn technical challenges into custom AI, web, and growth systems.\n\nExplore our core services or connect directly with our engineers:",
            options: [
                { label: '🔮 AI & ML', text: 'AI & Machine Learning' },
                { label: '💻 Web Applications', text: 'Web Application' },
                { label: '⚡ Automation', text: 'Automation' },
                { label: '🚀 Start a Project', action: 'start_project', cta: true },
                { label: '💬 WhatsApp Us', action: 'handoff_whatsapp', whatsapp: true }
            ]
        };
    }

    /**
     * Initializes the Unified Communication System on DOM ready
     */
    function initCommunicationSystem() {
        if (document.getElementById('nnCommHub')) return;

        // 1. Create Floating Hub Container
        const hub = document.createElement('div');
        hub.id = 'nnCommHub';
        hub.className = 'nn-comm-hub';
        hub.setAttribute('aria-label', 'NeuroNiv Direct Communication Hub');

        // 2. Hub HTML Markup
        hub.innerHTML = `
            <!-- Chatbot Window -->
            <div class="nn-chat-window" id="nnChatWindow" role="dialog" aria-modal="true" aria-labelledby="nnChatTitle" aria-hidden="true">
                <header class="nn-chat-header">
                    <div class="nn-chat-header-profile">
                        <div class="nn-chat-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ffffff"/>
                                <path d="M2 17L12 22L22 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="nn-chat-avatar-status" title="Active"></span>
                        </div>
                        <div class="nn-chat-title-wrap">
                            <h3 class="nn-chat-title" id="nnChatTitle">NeuroNiv AI</h3>
                            <span class="nn-chat-subtitle">
                                <span class="nn-chat-status-pulse"></span>
                                Online • Ready to help
                            </span>
                        </div>
                    </div>
                    <div class="nn-chat-actions">
                        <button type="button" class="nn-chat-action-btn" id="nnChatRestart" title="Restart conversation" aria-label="Restart conversation">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                        </button>
                        <button type="button" class="nn-chat-action-btn" id="nnChatMinimize" title="Minimize chat" aria-label="Minimize chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <button type="button" class="nn-chat-action-btn" id="nnChatClose" title="Close chat" aria-label="Close chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </header>

                <div class="nn-chat-messages" id="nnChatMessages" aria-live="polite">
                    <!-- Messages will be rendered here dynamically -->
                </div>

                <div class="nn-chat-input-wrap">
                    <form class="nn-chat-form" id="nnChatForm">
                        <input type="text" class="nn-chat-input" id="nnChatInput" placeholder="Ask a question or select an option..." autocomplete="off" aria-label="Type message">
                        <button type="submit" class="nn-chat-send-btn" id="nnChatSend" aria-label="Send message">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                    <div class="nn-chat-micro-copy">
                        <span>NeuroNiv Assistant • Instant answers</span>
                        <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer">WhatsApp Help</a>
                    </div>
                </div>
            </div>

            <!-- Floating Triggers Stack -->
            <div class="nn-comm-triggers">
                <!-- Phone Trigger -->
                <a href="tel:+918320852144" class="nn-comm-btn nn-comm-btn--phone" data-tooltip="Call ${CONFIG.DISPLAY_PHONE}" aria-label="Call NeuroNiv at ${CONFIG.DISPLAY_PHONE}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                </a>

                <!-- WhatsApp Trigger -->
                <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="nn-comm-btn nn-comm-btn--whatsapp" data-tooltip="Chat with NeuroNiv on WhatsApp" aria-label="Chat on WhatsApp">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.39 1.3-1.92 1.38-.49.08-1.12.11-3.26-.78-2.73-1.14-4.5-3.92-4.64-4.1-.14-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.28.24-.24.52-.3.7-.3.17 0 .35 0 .5.01.16.01.38-.06.59.45.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.2-.15.32-.3.49-.15.17-.31.39-.45.52-.15.15-.3.32-.13.62.17.3 1.09 1.8 2.34 2.91 1.62 1.44 2.98 1.89 3.41 2.1.42.21.67.18.92-.1.25-.29 1.07-1.25 1.36-1.68.29-.43.58-.36.98-.21.4.15 2.54 1.2 2.98 1.42.44.22.73.33.84.51.11.19.11 1.09-.13 1.77z"/>
                    </svg>
                </a>

                <!-- Chatbot Launcher Trigger -->
                <button type="button" class="nn-comm-btn nn-comm-btn--bot" id="nnChatLauncher" data-tooltip="Chat with NeuroNiv AI" aria-label="Open AI Assistant" aria-expanded="false" aria-controls="nnChatWindow">
                    <span class="bot-icon-sparkle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            <circle cx="12" cy="12" r="3" fill="#e879f9" stroke="none"/>
                        </svg>
                    </span>
                    <span class="bot-icon-close">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                    <span class="nn-bot-badge" id="nnBotBadge" aria-hidden="true"></span>

                    <!-- Subtle Greeting Pill -->
                    <div class="nn-bot-greeting" id="nnBotGreeting" role="status">
                        <span class="nn-bot-greeting-dot"></span>
                        <span class="nn-bot-greeting-text">Hi! How can we help?</span>
                        <button type="button" class="nn-bot-greeting-close" id="nnBotGreetingClose" aria-label="Dismiss greeting">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </button>
            </div>
        `;

        document.body.appendChild(hub);

        // 3. Setup Elements & State
        const chatWindow = document.getElementById('nnChatWindow');
        const launcher = document.getElementById('nnChatLauncher');
        const badge = document.getElementById('nnBotBadge');
        const greeting = document.getElementById('nnBotGreeting');
        const greetingClose = document.getElementById('nnBotGreetingClose');
        const chatClose = document.getElementById('nnChatClose');
        const chatMinimize = document.getElementById('nnChatMinimize');
        const chatRestart = document.getElementById('nnChatRestart');
        const messagesContainer = document.getElementById('nnChatMessages');
        const chatForm = document.getElementById('nnChatForm');
        const chatInput = document.getElementById('nnChatInput');

        let chatContext = {
            step: 'idle',
            selectedService: null,
            timeline: null
        };

        // 4. Greeting Notification Timer (shown once per session after 2.5s)
        const isDismissed = sessionStorage.getItem(CONFIG.GREETING_KEY);
        if (!isDismissed && greeting) {
            setTimeout(() => {
                if (!chatWindow.classList.contains('is-open')) {
                    greeting.classList.add('is-visible');
                }
            }, 2500);
        }

        if (greetingClose) {
            greetingClose.addEventListener('click', (e) => {
                e.stopPropagation();
                greeting.classList.add('is-dismissed');
                sessionStorage.setItem(CONFIG.GREETING_KEY, 'true');
            });
        }

        // 5. Toggle Chat Window Functionality
        function openChat() {
            chatWindow.classList.add('is-open');
            chatWindow.classList.remove('is-minimized');
            chatWindow.setAttribute('aria-hidden', 'false');
            launcher.classList.add('is-active');
            launcher.setAttribute('aria-expanded', 'true');
            if (badge) badge.style.display = 'none';
            if (greeting) {
                greeting.classList.add('is-dismissed');
                sessionStorage.setItem(CONFIG.GREETING_KEY, 'true');
            }
            chatInput.focus();
            scrollToBottom();
        }

        function closeChat() {
            chatWindow.classList.remove('is-open');
            chatWindow.setAttribute('aria-hidden', 'true');
            launcher.classList.remove('is-active');
            launcher.setAttribute('aria-expanded', 'false');
        }

        function toggleChat() {
            if (chatWindow.classList.contains('is-open')) {
                closeChat();
            } else {
                openChat();
            }
        }

        launcher.addEventListener('click', (e) => {
            // If click was on greeting dismiss button, do not toggle
            if (e.target.closest('#nnBotGreetingClose')) return;
            toggleChat();
        });

        if (chatClose) chatClose.addEventListener('click', closeChat);
        if (chatMinimize) {
            chatMinimize.addEventListener('click', () => {
                chatWindow.classList.toggle('is-minimized');
            });
        }

        // Keyboard navigation (Esc to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWindow.classList.contains('is-open')) {
                closeChat();
            }
        });

        // 6. Message Rendering Helpers
        function scrollToBottom() {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 40);
        }

        function appendUserMessage(text) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const bubble = document.createElement('div');
            bubble.className = 'nn-chat-bubble nn-chat-bubble--user';
            bubble.innerHTML = `
                <div>${escapeHtml(text)}</div>
                <span class="nn-chat-time">${time}</span>
            `;
            messagesContainer.appendChild(bubble);
            scrollToBottom();
            saveSession();
        }

        function showTypingIndicator() {
            const typing = document.createElement('div');
            typing.id = 'nnChatTyping';
            typing.className = 'nn-chat-typing';
            typing.innerHTML = `
                <span class="nn-chat-typing-dot"></span>
                <span class="nn-chat-typing-dot"></span>
                <span class="nn-chat-typing-dot"></span>
            `;
            messagesContainer.appendChild(typing);
            scrollToBottom();
            return typing;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('nnChatTyping');
            if (typing) typing.remove();
        }

        function appendBotResponse(response) {
            removeTypingIndicator();

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const bubble = document.createElement('div');
            bubble.className = 'nn-chat-bubble nn-chat-bubble--bot';

            // Format markdown-like bold text & line breaks
            let formattedText = escapeHtml(response.text || '')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');

            let optionsHtml = '';
            if (response.options && response.options.length > 0) {
                optionsHtml = '<div class="nn-chat-options">';
                response.options.forEach((opt, idx) => {
                    let chipClass = 'nn-chat-chip';
                    if (opt.whatsapp) chipClass += ' nn-chat-chip--whatsapp';
                    else if (opt.phone) chipClass += ' nn-chat-chip--phone';
                    else if (opt.cta) chipClass += ' nn-chat-chip--cta';

                    const actionAttr = opt.action ? `data-action="${opt.action}"` : '';
                    const textAttr = opt.text ? `data-text="${escapeHtml(opt.text)}"` : '';
                    const serviceAttr = opt.service ? `data-service="${escapeHtml(opt.service)}"` : '';
                    const linkAttr = opt.link ? `href="${opt.link}"` : 'href="javascript:void(0)"';

                    optionsHtml += `
                        <a ${linkAttr} class="${chipClass}" ${actionAttr} ${textAttr} ${serviceAttr} role="button">
                            ${opt.label}
                        </a>
                    `;
                });
                optionsHtml += '</div>';
            }

            bubble.innerHTML = `
                <div>${formattedText}</div>
                ${optionsHtml}
                <span class="nn-chat-time">${time}</span>
            `;

            messagesContainer.appendChild(bubble);

            // Bind click handlers to quick options
            bubble.querySelectorAll('.nn-chat-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    const action = chip.getAttribute('data-action');
                    const text = chip.getAttribute('data-text') || chip.textContent.trim();
                    const service = chip.getAttribute('data-service') || chatContext.selectedService;

                    if (action === 'handoff_whatsapp') {
                        e.preventDefault();
                        const waMsg = service 
                            ? `Hello NeuroNiv, I was using your website chatbot and would like to discuss my project (${service}).`
                            : 'Hello NeuroNiv, I was using your website chatbot and would like to discuss my project.';
                        window.open(getWhatsAppUrl(waMsg), '_blank', 'noopener,noreferrer');
                        appendUserMessage('Connected to WhatsApp');
                        setTimeout(() => {
                            appendBotResponse({
                                text: 'Opening WhatsApp with our team... You can also continue chatting here whenever you like!'
                            });
                        }, 400);
                        return;
                    }

                    if (action === 'handoff_phone') {
                        e.preventDefault();
                        window.location.href = `tel:+${CONFIG.WHATSAPP_PHONE}`;
                        appendUserMessage('Called NeuroNiv');
                        return;
                    }

                    if (action === 'handoff_contact') {
                        e.preventDefault();
                        closeChat();
                        handleContactFormHandoff(service);
                        return;
                    }

                    if (action === 'start_project') {
                        e.preventDefault();
                        if (service) chatContext.selectedService = service;
                        handleUserQuery(text);
                        return;
                    }

                    // Standard text selection
                    if (chip.getAttribute('href') === 'javascript:void(0)') {
                        e.preventDefault();
                        handleUserQuery(text);
                    }
                });
            });

            scrollToBottom();
            saveSession();
        }

        // 7. Dispatcher & Intent Handler
        async function handleUserQuery(queryText) {
            if (!queryText || !queryText.trim()) return;
            const text = queryText.trim();

            appendUserMessage(text);
            chatInput.value = '';

            const typingEl = showTypingIndicator();

            // Natural realistic response latency (450ms - 750ms)
            const latency = Math.floor(Math.random() * 300) + 450;
            setTimeout(async () => {
                try {
                    const response = await getBotResponse(text, chatContext);
                    appendBotResponse(response);
                } catch (err) {
                    removeTypingIndicator();
                    appendBotResponse({
                        text: "I'm having trouble processing that right now. Feel free to connect directly via WhatsApp or phone!",
                        options: [
                            { label: '💬 WhatsApp Us', action: 'handoff_whatsapp', whatsapp: true },
                            { label: '📞 Call Now', action: 'handoff_phone', phone: true }
                        ]
                    });
                }
            }, latency);
        }

        // Form Submit
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = chatInput.value.trim();
            if (val) {
                handleUserQuery(val);
            }
        });

        // 8. Session Storage Management
        function saveSession() {
            try {
                const sessionData = {
                    html: messagesContainer.innerHTML,
                    context: chatContext
                };
                sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
            } catch (e) {
                // Ignore storage quotas
            }
        }

        function restoreSession() {
            try {
                const saved = sessionStorage.getItem(CONFIG.SESSION_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.html) {
                        messagesContainer.innerHTML = parsed.html;
                        chatContext = parsed.context || chatContext;

                        // Rebind any chips from saved HTML
                        messagesContainer.querySelectorAll('.nn-chat-chip').forEach(chip => {
                            chip.addEventListener('click', (e) => {
                                const action = chip.getAttribute('data-action');
                                const text = chip.getAttribute('data-text') || chip.textContent.trim();
                                const service = chip.getAttribute('data-service') || chatContext.selectedService;

                                if (action === 'handoff_whatsapp') {
                                    e.preventDefault();
                                    const waMsg = service 
                                        ? `Hello NeuroNiv, I was using your website chatbot and would like to discuss my project (${service}).`
                                        : 'Hello NeuroNiv, I was using your website chatbot and would like to discuss my project.';
                                    window.open(getWhatsAppUrl(waMsg), '_blank', 'noopener,noreferrer');
                                    return;
                                }
                                if (action === 'handoff_phone') {
                                    e.preventDefault();
                                    window.location.href = `tel:+${CONFIG.WHATSAPP_PHONE}`;
                                    return;
                                }
                                if (action === 'handoff_contact') {
                                    e.preventDefault();
                                    closeChat();
                                    handleContactFormHandoff(service);
                                    return;
                                }
                                if (chip.getAttribute('href') === 'javascript:void(0)') {
                                    e.preventDefault();
                                    handleUserQuery(text);
                                }
                            });
                        });
                        return true;
                    }
                }
            } catch (e) {}
            return false;
        }

        // 9. Initial Greeting Setup
        function renderInitialGreeting() {
            messagesContainer.innerHTML = '';
            chatContext = { step: 'idle', selectedService: null, timeline: null };

            appendBotResponse({
                text: "Hi 👋 Welcome to NeuroNiv.\n\nI can help you explore our services, understand what we build, or connect you with our team.\n\nWhat are you looking for?",
                options: [
                    { label: '🔮 AI & Machine Learning', text: 'AI & Machine Learning' },
                    { label: '💻 Web Application', text: 'Web Application' },
                    { label: '⚡ Automation', text: 'Automation' },
                    { label: '📈 Digital Marketing', text: 'Digital Marketing' },
                    { label: '📱 Social Media', text: 'Social Media' },
                    { label: '🚀 Start a Project', action: 'start_project', cta: true },
                    { label: '💬 Talk on WhatsApp', action: 'handoff_whatsapp', whatsapp: true },
                    { label: '📞 Call NeuroNiv', action: 'handoff_phone', phone: true }
                ]
            });
        }

        // Restart conversation
        if (chatRestart) {
            chatRestart.addEventListener('click', () => {
                sessionStorage.removeItem(CONFIG.SESSION_KEY);
                renderInitialGreeting();
            });
        }

        // Restore or initialize
        const restored = restoreSession();
        if (!restored) {
            renderInitialGreeting();
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommunicationSystem);
    } else {
        initCommunicationSystem();
    }

    // Expose global API
    window.NeuroNivComm = {
        getWhatsAppUrl: getWhatsAppUrl,
        openChat: function () {
            const launcher = document.getElementById('nnChatLauncher');
            const chatWindow = document.getElementById('nnChatWindow');
            if (chatWindow && !chatWindow.classList.contains('is-open')) {
                launcher && launcher.click();
            }
        },
        handoffContact: handleContactFormHandoff
    };
})();
