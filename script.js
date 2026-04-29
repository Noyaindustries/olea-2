// ===== SCRIPT.JS - VERSION COMPLÈTE =====
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialisation AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 120,
        easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)'
    });

    // ===== MENU MOBILE =====
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header');

    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Empêche le scroll
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Fermeture du menu au clic sur un lien
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = hamburger?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Fermeture du menu au clic extérieur
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = hamburger?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                document.body.style.overflow = 'auto';
            }
        }
    });

    // ===== HEADER DYNAMIQUE (changement au scroll) =====
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // ===== LIENS ACTIFS (surligner la section courante) =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let scrollY = window.pageYOffset;
        let mainHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - mainHeight - 20;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ===== FORMULAIRE DE CONTACT =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Animation de chargement
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            submitBtn.disabled = true;
            
            // Simulation d'envoi (remplacer par un vrai fetch plus tard)
            setTimeout(() => {
                showNotification('✅ Message envoyé avec succès !', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===== NOTIFICATION =====
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed; top: 100px; right: 30px; background: ${type === 'success' ? 'linear-gradient(135deg, #00C851, #007E33)' : 'linear-gradient(135deg, #ff4444, #CC0000)'};
            color: white; padding: 18px 30px; border-radius: 50px; font-weight: 600; box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            z-index: 9999; animation: slideInRight 0.5s, fadeOut 0.5s 2.5s;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // ===== CARROUSEL HERO =====
    function initHeroCarousel() {
        const slides = document.querySelectorAll('.carousel-slide-hero');
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        
        // Changer d'image toutes les 5 secondes
        setInterval(nextSlide, 5000);
    }
    initHeroCarousel();

    // ===== CARROUSEL RÉALISATIONS (version corrigée) =====
function initRealisationsCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    
    // Fonction pour obtenir le nombre de slides à afficher
    function getSlidesToShow() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }
    
    // Fonction pour calculer la largeur d'un slide (incluant le gap)
    function getSlideWidth() {
        const slide = slides[0];
        const slideWidth = slide.offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        return slideWidth + gap;
    }
    
    function updateCarousel() {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        
        // S'assurer que currentIndex est dans les limites
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        // Calculer le déplacement
        const slideWidth = getSlideWidth();
        const translateX = currentIndex * slideWidth;
        track.style.transform = `translateX(-${translateX}px)`;
        
        // Mettre à jour les dots
        updateDots();
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const slidesToShow = getSlidesToShow();
        const dotCount = Math.max(1, slides.length - slidesToShow + 1);
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Aller à la slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
        
        updateDots();
    }
    
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Initialisation
    createDots();
    updateCarousel();
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Défilement automatique
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // Pause au survol
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 5000);
    });
    
    // Recalculer au redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const slidesToShow = getSlidesToShow();
            const maxIndex = Math.max(0, slides.length - slidesToShow);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            createDots(); // Recréer les dots
            updateCarousel();
        }, 150);
    });
}

    // Initialiser le carrousel des réalisations
    initRealisationsCarousel();

    // ===== EFFET DE PARALLAXE SUR LE HERO (optionnel) =====
    window.addEventListener('scroll', function() {
        const heroSlides = document.querySelectorAll('.carousel-slide-hero');
        if (heroSlides.length > 0) {
            const scrolled = window.pageYOffset;
            // Appliquer un léger effet de parallaxe sur l'image active
            heroSlides.forEach(slide => {
                if (slide.classList.contains('active')) {
                    slide.style.transform = `translateY(${scrolled * 0.2}px)`;
                } else {
                    slide.style.transform = 'translateY(0)';
                }
            });
        }
    });

    // ===== ANIMATION DES STATISTIQUES =====
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.innerText = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));

    // ===== GESTION DU RESIZE (fermer le menu si on repasse en desktop) =====
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            const icon = hamburger?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            document.body.style.overflow = 'auto';
        }
    });

    // ===== LAZY LOADING DES IMAGES (effet de fondu) =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.style.opacity = '0.6';
            imageObserver.observe(img);
        });
    }
});