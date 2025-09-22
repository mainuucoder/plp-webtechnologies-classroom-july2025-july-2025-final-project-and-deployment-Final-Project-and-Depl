/**
 * DigitalBoost Website - Animation System
 * Handles scroll-triggered animations and visual effects
 */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initScrollAnimations();
        this.initParallaxEffects();
        this.setupReducedMotionSupport();
    }

    setupIntersectionObserver() {
        // Default options for animations
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Staggered animations
        const staggeredOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        // Main animation observer
        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, defaultOptions);

        // Counter animation observer
        this.counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.hasAttribute('data-target')) {
                    this.animateCounter(entry.target);
                    this.counterObserver.unobserve(entry.target);
                }
            });
        }, staggeredOptions);
    }

    initScrollAnimations() {
        // Observe elements with animation attributes
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        animatedElements.forEach((element, index) => {
            // Add staggered delay if not specified
            if (!element.hasAttribute('data-aos-delay')) {
                const delay = (index % 3) * 100; // Stagger in groups of 3
                element.setAttribute('data-aos-delay', delay.toString());
            }
            
            this.mainObserver.observe(element);
        });

        // Observe counter elements
        const counterElements = document.querySelectorAll('[data-target]');
        counterElements.forEach(element => {
            this.counterObserver.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-aos') || 'fade-up';
        const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
        const duration = parseInt(element.getAttribute('data-aos-duration')) || 600;

        // Apply animation with delay
        setTimeout(() => {
            element.classList.add('aos-animate');
            
            // Add custom animation class based on type
            switch (animationType) {
                case 'fade-up':
                    this.fadeUp(element, duration);
                    break;
                case 'fade-down':
                    this.fadeDown(element, duration);
                    break;
                case 'fade-left':
                    this.fadeLeft(element, duration);
                    break;
                case 'fade-right':
                    this.fadeRight(element, duration);
                    break;
                case 'zoom-in':
                    this.zoomIn(element, duration);
                    break;
                case 'counter-up':
                    this.animateCounter(element);
                    break;
                default:
                    this.fadeUp(element, duration);
            }
        }, delay);
    }

    fadeUp(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }

    fadeDown(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }

    fadeLeft(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
    }

    fadeRight(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
    }

    zoomIn(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = this.easeOutCubic(progress);
            const currentValue = Math.floor(target * easedProgress);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrollTop = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.getAttribute('data-speed') || 0.5;
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + scrollTop;
                    const elementHeight = rect.height;
                    const windowHeight = window.innerHeight;
                    
                    // Only apply parallax when element is in viewport
                    if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
                        const translateY = (scrollTop - elementTop) * speed;
                        element.style.transform = `translateY(${translateY}px)`;
                    }
                });
            }, 16));
        }
    }

    setupReducedMotionSupport() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }
        
        // Listen for changes in motion preference
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'reduced-motion-style';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            [data-aos] {
                opacity: 1 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    enableAnimations() {
        const reducedMotionStyle = document.getElementById('reduced-motion-style');
        if (reducedMotionStyle) {
            reducedMotionStyle.remove();
        }
    }

    // Utility functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

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

    // Public methods for manual triggering
    triggerAnimation(selector, animationType = 'fade-up') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.setAttribute('data-aos', animationType);
            this.animateElement(element);
        });
    }

    // Method to reset animations (useful for dynamic content)
    resetAnimations() {
        this.animatedElements.clear();
        
        document.querySelectorAll('[data-aos]').forEach(element => {
            element.classList.remove('aos-animate');
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
            
            this.mainObserver.observe(element);
        });
    }

    // Cleanup method
    destroy() {
        this.mainObserver.disconnect();
        this.counterObserver.disconnect();
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Reinitialize animations for dynamically loaded content
window.addEventListener('contentLoaded', () => {
    if (window.animationController) {
        window.animationController.resetAnimations();
    }
});