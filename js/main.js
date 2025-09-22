/**
 * DigitalBoost Website - Main JavaScript
 * Handles navigation, smooth scrolling, and core functionality
 */

class DigitalBoostApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initNavigation();
        this.initSmoothScrolling();
        this.initHeaderScroll();
        this.initCounterAnimation();
    }

    setupEventListeners() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }

        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
    }

    onDOMReady() {
        // Initialize components that require DOM to be ready
        this.highlightActiveNavLink();
        console.log('DigitalBoost website initialized successfully');
    }

    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle && navMenu) {
            // Toggle mobile menu
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            // Close mobile menu
            const closeMenu = () => {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            };

            if (navClose) {
                navClose.addEventListener('click', closeMenu);
            }

            // Close menu when clicking outside
            navMenu.addEventListener('click', (e) => {
                if (e.target === navMenu) {
                    closeMenu();
                }
            });

            // Close menu when clicking on nav links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu();
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                    closeMenu();
                }
            });
        }
    }

    initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                this.smoothScrollTo(target);
            }
        });
    }

    smoothScrollTo(target, offset = 80) {
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let isScrollingUp = true;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            isScrollingUp = currentScrollY < lastScrollY;

            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
        };

        this.handleScroll = updateHeader;
    }

    handleScroll() {
        // This will be overridden by initHeaderScroll if header exists
    }

    handleResize() {
        // Handle window resize events
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.classList.remove('show');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    highlightActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav__link');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            const linkPath = link.getAttribute('href');
            
            if (linkPath === currentPage || 
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === '/' && linkPath === 'index.html')) {
                link.classList.add('nav__link--active');
            }
        });
    }

    initCounterAnimation() {
        const counters = document.querySelectorAll('[data-target]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public utility methods for other scripts
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success-500)' : 'var(--error-500)'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    isElementInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight - offset &&
            rect.bottom >= offset
        );
    }
}

// Initialize the application
const app = new DigitalBoostApp();

// Expose app instance globally for other scripts
window.DigitalBoost = app;