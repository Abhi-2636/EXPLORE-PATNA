document.addEventListener("DOMContentLoaded", function () {
    // 1. Preloader Removal
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }
    });

    // 2. Advanced Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Ultra Smooth Modal Handling
    const itemModal = $('#itemModal');
    document.querySelectorAll('.card').forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                
                const title = card.querySelector('.card-title').textContent;
                const imageSrc = card.querySelector('.card-img-top').src;
                const fullDescriptionData = card.querySelector('.full-text');
                
                let content = '';
                if (fullDescriptionData) {
                    content = fullDescriptionData.innerHTML;
                } else {
                    content = `<p class="lead">${card.querySelector('.card-text').textContent}</p>`;
                }

                document.getElementById('modalTitle').textContent = title.toUpperCase();
                document.getElementById('modalImage').src = imageSrc;
                document.getElementById('modalDescription').innerHTML = `
                    <div class="pe-lg-4">
                        <div class="section-badge mb-3">Discovery</div>
                        <h2 class="font-weight-bold mb-4" style="color: var(--secondary);">${title}</h2>
                        ${content}
                    </div>
                `;
                
                itemModal.modal('show');
            });
        }
    });

    // 4. Hero Navigation & Tab Switching with Reset
    document.querySelectorAll('.tab-link, .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target && target.startsWith('#')) {
                // Smooth scroll to top when switching tabs
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Advanced Form Interaction
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const btn = this.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Success!';
                btn.classList.add('btn-success');
                
                alert("Your message has been securely dispatched to our Hub. We'll connect soon.");
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('btn-success');
                    this.reset();
                }, 3000);
            }, 2000);
        });
    }

    // 6. Scroll Indicator & Entry Animations
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.weather-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Initialize Tooltips if any
    if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }
});