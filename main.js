// Main Interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log('Proyecto Nómade Landing Loaded');

    const navbar = document.querySelector('.navbar');

    // Handle Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Watch all elements with .reveal class
    document.querySelectorAll('.reveal, .service-card, .blog-card, article').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
        observer.observe(el);
    });

    // Handle Waitlist Form Submission
    const waitlistForm = document.querySelector('.waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = waitlistForm.querySelector('button');
            const originalText = btn.innerText;

            // Visual feedback - Loading
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            try {
                const formData = new FormData(waitlistForm);
                const response = await fetch(waitlistForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = '¡Anotado con éxito!';
                    btn.style.backgroundColor = '#1A3C34';
                    btn.style.color = '#fff';
                    waitlistForm.reset();
                } else {
                    throw new Error('Error en el envío');
                }
            } catch (error) {
                btn.innerText = 'Hubo un error, reintentá';
                btn.style.backgroundColor = '#e74c3c';
            } finally {
                btn.disabled = false;
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 4000);
            }
        });
    }

    // Experiences Carousel Navigation
    const carousel = document.querySelector('.experiences-carousel');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 400;

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Auto-rotate stories on mobile/tablet
        const experienceCards = document.querySelectorAll('.experience-card');
        if (experienceCards.length > 0) {
            let currentStoryIndex = -1;
            let storyInterval;

            const rotateStories = () => {
                experienceCards.forEach(card => card.classList.remove('active-story'));
                currentStoryIndex = (currentStoryIndex + 1) % experienceCards.length;
                experienceCards[currentStoryIndex].classList.add('active-story');
            };

            const startStoryRotation = () => {
                if (storyInterval) clearInterval(storyInterval);
                storyInterval = setInterval(rotateStories, 5000);
            };

            const stopStoryRotation = () => {
                clearInterval(storyInterval);
                experienceCards.forEach(card => card.classList.remove('active-story'));
            };

            // Start observation for viewport trigger
            const carouselObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start immediately and then interval
                        rotateStories();
                        startStoryRotation();
                        // Once started, we can stop observing this section
                        carouselObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 }); // Trigger when 50% visible

            carouselObserver.observe(carousel);

            // Pause on hover
            experienceCards.forEach(card => {
                card.addEventListener('mouseenter', stopStoryRotation);
                card.addEventListener('mouseleave', startStoryRotation);
                // On touch, we show the story and stop auto-rotation temporarily
                card.addEventListener('touchstart', () => {
                    stopStoryRotation();
                    experienceCards.forEach(c => c.classList.remove('active-story'));
                    card.classList.add('active-story');
                    // Resume after 8 seconds of inactivity
                    setTimeout(startStoryRotation, 8000);
                }, { passive: true });
            });
        }

        // Hide hint on first scroll
        carousel.addEventListener('scroll', () => {
            const hint = document.querySelector('.carousel-hint');
            if (hint && carousel.scrollLeft > 50) {
                hint.style.opacity = '0';
                setTimeout(() => { if (hint.parentNode) hint.remove(); }, 500);
            }
        }, { once: true });
    }
});
