
        // Mobile Navigation
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile nav when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Testimonial Slider
        const testimonials = document.querySelectorAll('.testimonial');
        const buttons = document.querySelectorAll('.testimonial-nav button');

        function showTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            buttons.forEach(button => button.classList.remove('active'));
            
            testimonials[index].classList.add('active');
            buttons[index].classList.add('active');
        }

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                showTestimonial(index);
            });
        });

        // Auto rotate testimonials
        let currentTestimonial = 0;
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);

        // Scroll animations
        function checkScroll() {
            const elements = document.querySelectorAll('.service-card, .stat-item, .news-card, .hero-text, .hero-image');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('visible');
                }
            });

            // Scroll to top button
            const scrollToTopBtn = document.querySelector('.scroll-to-top');
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }

            // Header background on scroll
            const header = document.querySelector('header');
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', checkScroll);
        window.addEventListener('load', checkScroll);

        // Counter animation
        function startCounters() {
            const counters = document.querySelectorAll('.counter');
            const speed = 200;
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = Math.ceil(target / speed);
                
                if (count < target) {
                    counter.innerText = Math.min(count + increment, target);
                    setTimeout(() => startCounters(), 1);
                }
            });
        }

        // Check if counters are in view
        function checkCounterView() {
            const countersSection = document.querySelector('.stats');
            const sectionPosition = countersSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (sectionPosition < screenPosition) {
                startCounters();
                window.removeEventListener('scroll', checkCounterView);
            }
        }

        window.addEventListener('scroll', checkCounterView);

        // Modal functionality
        const modal = document.getElementById('contactModal');
        const openModalBtn = document.querySelector('.open-contact-modal');
        const closeModalBtn = document.querySelector('.close-modal');

        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Form validation
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                modal.style.display = 'none';
            } else {
                alert('Please fill in all fields.');
            }
        });

        // Read more buttons
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('This would open a detailed page about this service/article.');
            });
        });

        // News title click
        const newsTitles = document.querySelectorAll('.news-title');
        
        newsTitles.forEach(title => {
            title.addEventListener('click', () => {
                alert('This would open the full article.');
            });
        });

        // Theme switcher
        const themeSwitcher = document.querySelector('.theme-switcher');
        
        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });

        // Scroll to top
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Animate floating elements
        function animateFloatingElements() {
            const floatingElements = document.querySelectorAll('.floating-element');
            
            floatingElements.forEach((element, index) => {
                // Set different animation delays
                element.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite alternate`;
            });
        }

        // Add keyframes for floating animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float {
                0% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(5deg); }
                100% { transform: translateY(0) rotate(0deg); }
            }
        `;
        document.head.appendChild(style);

        animateFloatingElements();

        // Initialize the page
        window.addEventListener('load', () => {
            // Animate hero elements
            document.querySelector('.hero-text').classList.add('visible');
            document.querySelector('.hero-image').classList.add('visible');
            
            // Check for counters on load
            checkCounterView();
        });
