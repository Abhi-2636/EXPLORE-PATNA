/**
 * Explore Patna — Master Script v2.0
 * All interactivity consolidated + new features:
 * - Reading progress bar
 * - Floating action button menu
 * - Search overlay with live filtering
 * - Typewriter hero effect
 * - URL hash routing
 * - Keyboard shortcuts
 * - Parallax card tilt
 * - Explorer badge / gamification system
 * - Image error handling
 * - Enhanced Vishwa AI (15+ patterns)
 */

document.addEventListener("DOMContentLoaded", function () {

    // ═══════════════════════════════════════════════════
    // 1. TOUCH DEVICE DETECTION
    // ═══════════════════════════════════════════════════
    const isTouchDevice = window.matchMedia('(hover: none)').matches
                          || 'ontouchstart' in window;

    if (isTouchDevice) {
        const cursor = document.getElementById('tikuli-cursor');
        const follower = document.getElementById('tikuli-cursor-follower');
        if (cursor) cursor.remove();
        if (follower) follower.remove();
        document.body.style.cursor = 'auto';
        document.querySelectorAll('a, button, .card, .tab-link, .theme-toggle').forEach(el => {
            el.style.cursor = 'pointer';
        });
    }

    // ═══════════════════════════════════════════════════
    // 2. PRELOADER
    // ═══════════════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, 1500);
        });
    }

    // ═══════════════════════════════════════════════════
    // 3. READING PROGRESS BAR
    // ═══════════════════════════════════════════════════
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        });
    }

    // ═══════════════════════════════════════════════════
    // 4. NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    // ═══════════════════════════════════════════════════
    // 5. THEME TOGGLE
    // ═══════════════════════════════════════════════════
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
            awardBadge('dark_mode');
        });

        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeToggle.click(); }
        });

        function updateThemeIcon(theme) {
            if (!icon) return;
            icon.classList.toggle('fa-moon', theme === 'light');
            icon.classList.toggle('fa-sun', theme === 'dark');
        }
    }

    // ═══════════════════════════════════════════════════
    // 6. TIKULI CURSOR (Desktop Only)
    // ═══════════════════════════════════════════════════
    if (!isTouchDevice) {
        const cursor = document.getElementById('tikuli-cursor');
        const follower = document.getElementById('tikuli-cursor-follower');

        if (cursor && follower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
                follower.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
            });

            document.querySelectorAll('a, button, .card, .tab-link, .theme-toggle').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.width = '44px';
                    cursor.style.height = '44px';
                    cursor.style.backgroundColor = 'var(--primary)';
                    cursor.style.mixBlendMode = 'normal';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.width = '';
                    cursor.style.height = '';
                    cursor.style.backgroundColor = '';
                    cursor.style.mixBlendMode = 'difference';
                });
            });
        }
    }

    // ═══════════════════════════════════════════════════
    // 7. DETAIL MODAL — Dynamic Content Injection
    // ═══════════════════════════════════════════════════
    const itemModal = (typeof $ !== 'undefined') ? $('#itemModal') : null;

    document.querySelectorAll('.card').forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        if (readMoreBtn && !readMoreBtn.closest('a')) {
            readMoreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const title = card.querySelector('.card-title')?.textContent || '';
                const imageSrc = card.querySelector('.card-img-top')?.src || '';
                const fullDescriptionData = card.querySelector('.full-text');
                let content = fullDescriptionData ? fullDescriptionData.innerHTML
                    : `<p class="lead">${card.querySelector('.card-text')?.textContent || ''}</p>`;

                const modalTitle = document.getElementById('modalTitle');
                const modalImage = document.getElementById('modalImage');
                const modalDescription = document.getElementById('modalDescription');

                if (modalTitle) modalTitle.textContent = title.toUpperCase();
                if (modalImage) { modalImage.src = imageSrc; modalImage.alt = title; }
                if (modalDescription) {
                    modalDescription.innerHTML = `
                        <div class="pe-lg-4">
                            <div class="section-badge mb-3">Discovery</div>
                            <h2 class="font-weight-bold mb-4" style="color: var(--secondary);">${title}</h2>
                            ${content}
                        </div>
                    `;
                }
                if (itemModal) itemModal.modal('show');
            });
        }
    });

    // ═══════════════════════════════════════════════════
    // 8. TAB NAVIGATION — Fixed with Bootstrap events
    // ═══════════════════════════════════════════════════
    if (typeof $ !== 'undefined') {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Update URL hash without jumping
            history.replaceState(null, null, e.target.getAttribute('href'));
            // Track tabs visited for badges
            trackTabVisit(e.target.getAttribute('href'));
        });
    }

    // Hero tab-links (not Bootstrap data-toggle on some)
    document.querySelectorAll('.tab-link[data-toggle="tab"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        });
    });

    // ═══════════════════════════════════════════════════
    // 9. URL HASH ROUTING — Deep link to tabs
    // ═══════════════════════════════════════════════════
    const hash = window.location.hash;
    if (hash && typeof $ !== 'undefined') {
        const tabLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (tabLink) {
            $(tabLink).tab('show');
        }
    }

    // ═══════════════════════════════════════════════════
    // 10. CONTACT FORM HANDLING
    // ═══════════════════════════════════════════════════
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const btn = this.querySelector('.submit-btn');
            if (!btn) return;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.classList.add('btn-success');
                alert("Your message has been securely dispatched to our Hub. We'll connect soon.");
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('btn-success');
                    contactForm.reset();
                }, 3000);
            }, 2000);
        });
    }

    // ═══════════════════════════════════════════════════
    // 11. SCROLL INDICATOR
    // ═══════════════════════════════════════════════════
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.city-pulse-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════════════════
    // 12. LIVE CLOCK
    // ═══════════════════════════════════════════════════
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
        function updateClock() {
            clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
                hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // ═══════════════════════════════════════════════════
    // 13. FESTIVAL COUNTDOWN (Dynamic)
    // ═══════════════════════════════════════════════════
    const countdownEl = document.getElementById('festival-countdown');
    if (countdownEl) {
        const festivals = [
            { name: 'Chhath Puja 2026', date: 'November 15, 2026' },
            { name: 'Makar Sankranti 2027', date: 'January 14, 2027' },
            { name: 'Holi 2027', date: 'March 14, 2027' },
            { name: 'Ram Navami 2027', date: 'April 5, 2027' },
            { name: 'Chhath Puja 2027', date: 'November 4, 2027' },
        ];
        function updateCountdown() {
            const now = Date.now();
            const next = festivals.find(f => new Date(f.date).getTime() > now);
            if (!next) return;
            const diff = new Date(next.date).getTime() - now;
            const nameEl = document.querySelector('.event-name');
            if (nameEl) nameEl.textContent = next.name;
            const d = countdownEl.querySelector('.days');
            const h = countdownEl.querySelector('.hours');
            const m = countdownEl.querySelector('.minutes');
            if (d) d.textContent = Math.floor(diff / 86400000);
            if (h) h.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
            if (m) m.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        }
        setInterval(updateCountdown, 60000);
        updateCountdown();
    }

    // ═══════════════════════════════════════════════════
    // 14. VIBE QUIZ
    // ═══════════════════════════════════════════════════
    window.selectVibe = function(vibe) {
        const container = document.getElementById('vibe-quiz-container');
        if (!container) return;
        const results = {
            spiritual: "<strong>The Divine Path:</strong> Start at Mahavir Mandir, then visit Patan Devi and end with evening Aarti at Gandhi Ghat.",
            historical: "<strong>The Imperial Trail:</strong> Explore the Bihar Museum, then Golghar, and finally the ruins of Kumhrar.",
            foodie: "<strong>The Flavor Hub:</strong> Begin with Litti Chokha at Maurya Lok, then Tilkut in local markets, and dinner at a rooftop Ganga-view cafe.",
            explorer: "<strong>Modern Pulse:</strong> Visit Eco Park, then do some shopping at P&M Mall and walk along the Marine Drive (JP Ganga Path)."
        };
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-wand-magic-sparkles fa-3x text-primary mb-4"></i>
                <h3 class="font-weight-bold mb-3">Your Vibe Found!</h3>
                <p class="lead mb-4">${results[vibe] || 'Explore all sections above!'}</p>
                <button class="btn btn-primary rounded-pill px-5" onclick="location.reload()">Take Quiz Again</button>
            </div>
        `;
        awardBadge('vibe_quiz');
    };

    // ═══════════════════════════════════════════════════
    // 15. VISHWA AI CONCIERGE (Enhanced - 15+ patterns)
    // ═══════════════════════════════════════════════════
    const vishwaToggle = document.getElementById('vishwa-toggle');
    const vishwaChat = document.getElementById('vishwa-chat-box');
    const vishwaClose = document.getElementById('vishwa-close');
    const vishwaInput = document.getElementById('vishwa-input');
    const vishwaSend = document.getElementById('vishwa-send');
    const vishwaMessages = document.getElementById('vishwa-messages');

    if (vishwaToggle && vishwaChat) {
        // The vishwa-toggle is now inside the FAB, handled by FAB logic
        // But keep direct toggle as fallback
        if (!document.querySelector('.fab-container')) {
            vishwaToggle.addEventListener('click', () => {
                vishwaChat.style.display = vishwaChat.style.display === 'flex' ? 'none' : 'flex';
                if (vishwaInput) vishwaInput.focus();
            });
        }

        vishwaToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vishwaToggle.click(); }
        });

        if (vishwaClose) {
            vishwaClose.addEventListener('click', () => { vishwaChat.style.display = 'none'; });
        }

        function addVishwaMessage(text, isUser = false) {
            if (!vishwaMessages) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isUser ? 'sent text-right' : 'received'} mb-3`;
            msgDiv.innerHTML = `<div class="p-3 ${isUser ? 'bg-primary text-white' : 'glass-morphism'} rounded-lg small d-inline-block" style="max-width: 80%;">${text}</div>`;
            vishwaMessages.appendChild(msgDiv);
            vishwaMessages.scrollTop = vishwaMessages.scrollHeight;
        }

        function getVishwaResponse(text) {
            const l = text.toLowerCase();
            if (l.includes('food') || l.includes('eat') || l.includes('restaurant') || l.includes('hungry'))
                return "🍽️ Food is Patna's love language! Try <strong>Litti Chokha</strong> near Gandhi Maidan, <strong>Silao Khaja</strong>, <strong>Malpua with Rabri</strong>, and <strong>Sattu Paratha</strong>. Head to <strong>Boring Road</strong> or <strong>Maurya Lok</strong>!";
            if (l.includes('temple') || l.includes('spiritual') || l.includes('mandir'))
                return "🙏 Visit <strong>Mahavir Mandir</strong> (5 AM–11 PM), <strong>Patan Devi</strong>, <strong>ISKCON</strong>, and <strong>Takht Shri Patna Sahib</strong>. Check the Spiritual tab!";
            if (l.includes('museum') || l.includes('history') || l.includes('historical'))
                return "🏛️ Explore <strong>Bihar Museum</strong> (₹100), <strong>Patna Museum</strong> (50,000+ artifacts), <strong>Golghar</strong> (145 steps, ₹15), and <strong>Agam Kuan</strong>. Check Historical tab!";
            if (l.includes('weather') || l.includes('climate') || l.includes('when'))
                return "🌤️ <strong>Best: Oct–Mar</strong> (15–25°C). Summers hit 45°C. Monsoon brings heavy rain. Winter mornings can be foggy.";
            if (l.includes('hotel') || l.includes('stay') || l.includes('accommodation'))
                return "🏨 Stay at <strong>Fraser Road</strong> (upscale), <strong>Exhibition Road</strong> (budget), or <strong>Boring Road</strong> (local). Top: Maurya Patna, Lemon Tree, Chanakya.";
            if (l.includes('transport') || l.includes('airport') || l.includes('train'))
                return "✈️ <strong>JP Airport</strong> connects to metros. <strong>Patna Junction</strong> is a rail hub. Use Ola/Uber, autos (₹20–80), or city buses.";
            if (l.includes('chhath') || l.includes('festival') || l.includes('event'))
                return "🎉 <strong>Chhath Puja</strong> (Nov) is the grandest! Also: <strong>Sonepur Mela</strong>, <strong>Ram Navami</strong>, <strong>Holi</strong>, <strong>Diwali</strong>.";
            if (l.includes('ganga') || l.includes('river') || l.includes('ghat'))
                return "🌊 <strong>JP Ganga Path</strong> — 5 km promenade for sunsets. Key ghats: <strong>Gandhi Ghat</strong>, <strong>NIT Ghat</strong>.";
            if (l.includes('shopping') || l.includes('mall') || l.includes('market'))
                return "🛍️ <strong>City Centre</strong> (Fraser Rd), <strong>P&M Mall</strong>, <strong>Maurya Lok</strong>, <strong>Khaitan Market</strong> (ethnic wear).";
            if (l.includes('dark') || l.includes('theme')) return "🌙 Click the moon/sun icon in navbar to toggle themes!";
            if (l.includes('zoo') || l.includes('park') || l.includes('family'))
                return "🎢 Family fun: <strong>Patna Zoo</strong> (₹30), <strong>Eco Park</strong>, <strong>Buddha Smriti</strong>, <strong>Hungama World</strong>. Check Recreation tab!";
            if (l.includes('planetarium') || l.includes('science'))
                return "🔭 <strong>Indira Gandhi Planetarium</strong> — 23m dome, 278 seats, ₹40. Shows every 1.5 hrs, closed Mondays.";
            if (l.match(/\b(hi|hello|hey|namaste|hii+)\b/))
                return "🙏 <strong>Namaste!</strong> I'm Vishwa, your guide to Patna's 2,500-year legacy. Ask about places, food, festivals, hotels, or transport!";
            if (l.includes('thank')) return "🙏 Happy to help! Explore all tabs for hidden gems. Happy travelling! 🌟";
            return "Great question! Check our tabs — <strong>Spiritual, Historical, Foods, Culture, Recreation, Shopping</strong>. Ask me about food, temples, weather, hotels, or festivals!";
        }

        if (vishwaSend) {
            vishwaSend.addEventListener('click', () => {
                const text = vishwaInput?.value.trim();
                if (!text) return;
                addVishwaMessage(text, true);
                vishwaInput.value = '';
                awardBadge('vishwa_chat');
                setTimeout(() => addVishwaMessage(getVishwaResponse(text)), 700 + Math.random() * 500);
            });
        }
        if (vishwaInput) {
            vishwaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') vishwaSend?.click(); });
        }
    }

    // ═══════════════════════════════════════════════════
    // 16. FLOATING ACTION BUTTON MENU
    // ═══════════════════════════════════════════════════
    const fabContainer = document.querySelector('.fab-container');
    const fabMain = document.querySelector('.fab-main');

    if (fabMain && fabContainer) {
        fabMain.addEventListener('click', () => {
            fabContainer.classList.toggle('open');
            fabMain.classList.toggle('active');
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target) && fabContainer.classList.contains('open')) {
                fabContainer.classList.remove('open');
                fabMain.classList.remove('active');
            }
        });
    }

    // FAB: Vishwa chat trigger
    const fabVishwa = document.getElementById('fab-vishwa');
    if (fabVishwa && vishwaChat) {
        fabVishwa.addEventListener('click', () => {
            vishwaChat.style.display = vishwaChat.style.display === 'flex' ? 'none' : 'flex';
            if (vishwaInput) vishwaInput.focus();
            fabContainer?.classList.remove('open');
            fabMain?.classList.remove('active');
        });
    }

    // FAB: Back to top
    const fabTop = document.getElementById('fab-top');
    if (fabTop) {
        fabTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fabContainer?.classList.remove('open');
            fabMain?.classList.remove('active');
        });
    }

    // FAB: Print
    const fabPrint = document.getElementById('fab-print');
    if (fabPrint) {
        fabPrint.addEventListener('click', () => {
            fabContainer?.classList.remove('open');
            fabMain?.classList.remove('active');
            window.print();
        });
    }

    // FAB: Search
    const fabSearch = document.getElementById('fab-search');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    if (fabSearch && searchOverlay) {
        fabSearch.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            fabContainer?.classList.remove('open');
            fabMain?.classList.remove('active');
            setTimeout(() => searchInput?.focus(), 200);
        });
    }
    if (searchClose) {
        searchClose.addEventListener('click', () => searchOverlay?.classList.remove('active'));
    }
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) searchOverlay.classList.remove('active');
        });
    }

    // ═══════════════════════════════════════════════════
    // 17. SEARCH — Live card filtering
    // ═══════════════════════════════════════════════════
    if (searchInput) {
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!searchResults) return;

            if (query.length < 2) {
                searchResults.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:20px;">Type at least 2 characters...</p>';
                return;
            }

            const cards = document.querySelectorAll('.card');
            let results = [];

            cards.forEach(card => {
                const title = card.querySelector('.card-title')?.textContent || '';
                const text = card.querySelector('.card-text')?.textContent || '';
                const label = card.querySelector('.card-label')?.textContent || '';
                const combined = (title + ' ' + text + ' ' + label).toLowerCase();

                if (combined.includes(query)) {
                    const img = card.querySelector('.card-img-top')?.src || '';
                    const tab = card.closest('.tab-pane')?.id || 'home';
                    results.push({ title, label, img, tab });
                }
            });

            if (results.length === 0) {
                searchResults.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:20px;">No results found</p>';
                return;
            }

            searchResults.innerHTML = results.slice(0, 8).map(r => `
                <div class="search-result-item" data-tab="${r.tab}">
                    ${r.img ? `<img src="${r.img}" alt="${r.title}" loading="lazy">` : ''}
                    <div class="result-info">
                        <h5>${r.title}</h5>
                        <p>${r.label || r.tab}</p>
                    </div>
                </div>
            `).join('');

            // Click result → go to that tab
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const tab = item.dataset.tab;
                    const tabLink = document.querySelector(`.nav-link[href="#${tab}"]`);
                    if (tabLink && typeof $ !== 'undefined') {
                        $(tabLink).tab('show');
                    }
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                });
            });
        });
    }

    // ═══════════════════════════════════════════════════
    // 18. TYPEWRITER HERO EFFECT
    // ═══════════════════════════════════════════════════
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const phrases = [
            'Chronicles of 2,500 Years',
            'Vibrant Traditions & Heritage',
            'The Bihari Kitchen Awaits',
            'Modern Pulse of Bihar',
            'The Eternal City Since 490 BCE'
        ];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;

        // Add cursor element
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typewriter-cursor';
        heroSubtitle.parentNode.insertBefore(cursorSpan, heroSubtitle.nextSibling);

        function typewrite() {
            const current = phrases[phraseIndex];
            heroSubtitle.textContent = current.substring(0, charIndex);

            if (!isDeleting && charIndex === current.length) {
                setTimeout(() => { isDeleting = true; typewrite(); }, 2500);
                return;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typewrite, 400);
                return;
            }

            charIndex += isDeleting ? -1 : 1;
            setTimeout(typewrite, isDeleting ? 25 : 70);
        }

        // Start typewriter after preloader
        setTimeout(typewrite, 3500);
    }

    // ═══════════════════════════════════════════════════
    // 19. KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Don't trigger when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.altKey && typeof $ !== 'undefined') {
            const keyMap = {
                '1': '#home-tab', '2': '#spiritual-tab', '3': '#historical-tab',
                '4': '#foods-tab', '5': '#cultural-tab', '6': '#recreation-tab',
                '7': '#shopping-tab', '8': '#contact-tab'
            };
            const target = keyMap[e.key];
            if (target) {
                e.preventDefault();
                const tab = document.querySelector(target);
                if (tab) $(tab).tab('show');
            }
        }

        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                setTimeout(() => searchInput?.focus(), 200);
            }
        }

        // Escape to close overlays
        if (e.key === 'Escape') {
            searchOverlay?.classList.remove('active');
            if (vishwaChat) vishwaChat.style.display = 'none';
            fabContainer?.classList.remove('open');
            fabMain?.classList.remove('active');
        }
    });

    // ═══════════════════════════════════════════════════
    // 20. PARALLAX CARD TILT (Desktop Only)
    // ═══════════════════════════════════════════════════
    if (!isTouchDevice) {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
                card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════
    // 21. IMAGE ERROR HANDLING
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.background = 'linear-gradient(135deg, var(--primary-glow), var(--bg-warm))';
            img.style.minHeight = '200px';
            img.alt = 'Image unavailable';
            img.classList.add('img-error');
        });
    });

    // ═══════════════════════════════════════════════════
    // 22. LAZY LOADING — Auto-apply
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('img:not(.loader-logo):not(.logo-img)').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
        }
    });

    // ═══════════════════════════════════════════════════
    // 23. EXPLORER BADGE SYSTEM (Gamification)
    // ═══════════════════════════════════════════════════
    const badgeDefs = {
        first_visit:  { name: 'Welcome Explorer', icon: '🎒', desc: 'First visit to Explore Patna!' },
        dark_mode:    { name: 'Night Owl', icon: '🦉', desc: 'Toggled Dark Mode' },
        all_tabs:     { name: 'Grand Tour', icon: '🏆', desc: 'Visited all 8 sections' },
        vishwa_chat:  { name: 'AI Friend', icon: '🤖', desc: 'Chatted with Vishwa' },
        vibe_quiz:    { name: 'Vibe Checker', icon: '✨', desc: 'Completed the Vibe Quiz' },
        scroll_master:{ name: 'Deep Diver', icon: '🤿', desc: 'Scrolled past 80% of the page' },
    };

    const earnedBadges = JSON.parse(localStorage.getItem('patna_badges') || '[]');
    const tabsVisited = new Set(JSON.parse(localStorage.getItem('patna_tabs_visited') || '[]'));

    function awardBadge(id) {
        if (earnedBadges.includes(id) || !badgeDefs[id]) return;
        earnedBadges.push(id);
        localStorage.setItem('patna_badges', JSON.stringify(earnedBadges));

        const badge = badgeDefs[id];
        showBadgeNotification(badge.icon, badge.name, badge.desc);
    }

    function showBadgeNotification(icon, name, desc) {
        const notif = document.getElementById('badge-notification');
        if (!notif) return;

        notif.querySelector('.badge-icon').textContent = icon;
        notif.querySelector('.badge-info h5').textContent = name + ' Unlocked!';
        notif.querySelector('.badge-info p').textContent = desc;
        notif.classList.add('show');

        setTimeout(() => notif.classList.remove('show'), 4000);
    }

    function trackTabVisit(tabHash) {
        if (!tabHash) return;
        tabsVisited.add(tabHash);
        localStorage.setItem('patna_tabs_visited', JSON.stringify([...tabsVisited]));

        // Check for all-tabs badge
        const allTabs = ['#home', '#spiritual', '#historical', '#foods', '#cultural', '#recreation', '#shopping', '#contact'];
        if (allTabs.every(t => tabsVisited.has(t))) {
            awardBadge('all_tabs');
        }
    }

    // Award first visit badge
    if (!localStorage.getItem('patna_visited')) {
        localStorage.setItem('patna_visited', 'true');
        setTimeout(() => awardBadge('first_visit'), 4000);
    }

    // Track home tab visit
    trackTabVisit('#home');

    // Scroll depth badge
    let scrollBadgeAwarded = earnedBadges.includes('scroll_master');
    if (!scrollBadgeAwarded) {
        window.addEventListener('scroll', () => {
            if (scrollBadgeAwarded) return;
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            if (pct > 0.8) {
                scrollBadgeAwarded = true;
                awardBadge('scroll_master');
            }
        });
    }

    // Make awardBadge available globally for inline onclick handlers
    window.awardBadge = awardBadge;

    // ═══════════════════════════════════════════════════
    // 24. SCROLL REVEAL
    // ═══════════════════════════════════════════════════
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.info-card, .tip-card, .feature-list li').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        revealObserver.observe(el);
    });

    // ═══════════════════════════════════════════════════
    // 25. TOOLTIPS
    // ═══════════════════════════════════════════════════
    if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }

});