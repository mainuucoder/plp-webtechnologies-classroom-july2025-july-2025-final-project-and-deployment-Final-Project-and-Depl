/**
 * DigitalBoost Website - Portfolio Page
 * Handles portfolio filtering, modals, and carousel functionality
 */

class PortfolioManager {
    constructor() {
        this.currentFilter = 'all';
        this.portfolioItems = [];
        this.currentSlide = 0;
        this.testimonials = [];
        this.caseStudies = this.initCaseStudies();
        this.init();
    }

    init() {
        this.initPortfolioFilter();
        this.initPortfolioModal();
        this.initTestimonialCarousel();
        this.loadPortfolioItems();
    }

    initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length === 0) return;

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterPortfolio(filter);
                this.updateActiveFilter(btn, filterButtons);
            });
        });

        // Store portfolio items
        this.portfolioItems = Array.from(portfolioItems);
    }

    filterPortfolio(filter) {
        this.currentFilter = filter;
        
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (item.style.animation.includes('fadeOut')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Trigger animation reset
        if (window.animationController) {
            setTimeout(() => {
                window.animationController.resetAnimations();
            }, 400);
        }
    }

    updateActiveFilter(activeBtn, allButtons) {
        allButtons.forEach(btn => {
            btn.classList.remove('filter-btn--active');
        });
        activeBtn.classList.add('filter-btn--active');
    }

    loadPortfolioItems() {
        // Simulate loading portfolio items with a slight delay for better UX
        setTimeout(() => {
            const portfolioGrid = document.querySelector('.portfolio-grid');
            if (portfolioGrid) {
                portfolioGrid.style.opacity = '1';
            }
        }, 100);
    }

    initPortfolioModal() {
        const modal = document.getElementById('portfolio-modal');
        const portfolioButtons = document.querySelectorAll('.portfolio-item__btn');
        const closeButton = document.querySelector('.modal__close');

        if (!modal) return;

        portfolioButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = btn.getAttribute('data-portfolio');
                this.openCaseStudy(projectId);
            });
        });

        // Close modal events
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openCaseStudy(projectId) {
        const modal = document.getElementById('portfolio-modal');
        const caseStudyContent = document.getElementById('case-study-content');
        
        if (!modal || !caseStudyContent) return;

        const caseStudy = this.caseStudies[projectId];
        if (!caseStudy) return;

        caseStudyContent.innerHTML = this.renderCaseStudy(caseStudy);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderCaseStudy(caseStudy) {
        return `
            <div class="case-study__header">
                <h2 class="case-study__title">${caseStudy.title}</h2>
                <p class="case-study__client">${caseStudy.client}</p>
            </div>
            
            <div class="case-study__overview">
                <div class="case-study__challenge">
                    <h3>The Challenge</h3>
                    <p>${caseStudy.challenge}</p>
                </div>
                
                <div class="case-study__solution">
                    <h3>Our Solution</h3>
                    <p>${caseStudy.solution}</p>
                </div>
            </div>
            
            <div class="case-study__results">
                <h3>Results Achieved</h3>
                <div class="case-study__metrics">
                    ${caseStudy.results.map(result => `
                        <div class="metric">
                            <div class="metric__value">${result.value}</div>
                            <div class="metric__label">${result.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="case-study__testimonial">
                <blockquote>
                    "${caseStudy.testimonial.quote}"
                </blockquote>
                <cite>- ${caseStudy.testimonial.author}, ${caseStudy.testimonial.position}</cite>
            </div>
        `;
    }

    closeModal() {
        const modal = document.getElementById('portfolio-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    initTestimonialCarousel() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (slides.length === 0) return;

        this.testimonials = Array.from(slides);
        this.currentSlide = 0;

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Auto-play carousel
        this.startAutoPlay();

        // Pause on hover
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (carousel && this.isElementVisible(carousel)) {
                if (e.key === 'ArrowLeft') {
                    this.previousSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
        this.updateCarousel();
    }

    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.testimonials.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        // Update slides
        this.testimonials.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    initCaseStudies() {
        return {
            project1: {
                title: "TechStartup SEO Success",
                client: "TechStartup Inc.",
                challenge: "A growing tech startup was struggling with organic visibility despite having innovative products. Their website wasn't ranking for relevant keywords, and they were losing potential customers to competitors.",
                solution: "We implemented a comprehensive SEO strategy including technical optimization, content marketing, and strategic link building. We optimized their site architecture, created valuable content targeting buyer-intent keywords, and built high-quality backlinks from industry publications.",
                results: [
                    { value: "300%", label: "Organic Traffic Increase" },
                    { value: "#1", label: "Rankings for Target Keywords" },
                    { value: "150%", label: "Lead Generation Boost" },
                    { value: "85%", label: "Improvement in SERP Visibility" }
                ],
                testimonial: {
                    quote: "DigitalBoost transformed our online presence completely. In just 6 months, we saw a 300% increase in organic traffic and our sales doubled.",
                    author: "Sarah Johnson",
                    position: "CEO, TechStartup Inc."
                }
            },
            project2: {
                title: "Fashion Brand Social Growth",
                client: "StyleCo Fashion",
                challenge: "A fashion brand wanted to build a strong social media presence to reach younger demographics and increase brand awareness. They had great products but limited social media engagement.",
                solution: "We developed a comprehensive social media strategy focusing on visual storytelling, influencer partnerships, and community building. We created engaging content calendars and implemented targeted advertising campaigns across Instagram, TikTok, and Facebook.",
                results: [
                    { value: "500K+", label: "New Followers in 6 Months" },
                    { value: "1200%", label: "Engagement Rate Increase" },
                    { value: "400%", label: "Social Commerce Sales" },
                    { value: "50+", label: "Influencer Partnerships" }
                ],
                testimonial: {
                    quote: "Working with DigitalBoost was a game-changer for our fashion brand. They helped us grow from 10K to 500K followers and increased our online sales by 400%.",
                    author: "Emma Davis",
                    position: "Founder, StyleCo Fashion"
                }
            },
            project3: {
                title: "E-commerce PPC Success",
                client: "ShopSmart E-commerce",
                challenge: "An e-commerce store was struggling with high customer acquisition costs and low ROI from their paid advertising campaigns. Their ads weren't converting, and they were wasting budget on irrelevant traffic.",
                solution: "We restructured their entire PPC strategy with detailed audience segmentation, improved ad copy and creative, and implemented advanced conversion tracking. We also optimized their landing pages for better conversion rates.",
                results: [
                    { value: "400%", label: "ROI Improvement" },
                    { value: "60%", label: "Cost Per Acquisition Reduction" },
                    { value: "250%", label: "Conversion Rate Increase" },
                    { value: "$2.5M", label: "Additional Revenue Generated" }
                ],
                testimonial: {
                    quote: "The ROI on our PPC campaigns improved by 400% after partnering with DigitalBoost. Their data-driven approach and continuous optimization have been crucial to our e-commerce success.",
                    author: "Mike Chen",
                    position: "Marketing Director, ShopSmart"
                }
            },
            project4: {
                title: "Restaurant Website Redesign",
                client: "Bella Vista Restaurant",
                challenge: "A popular restaurant needed a modern website that would drive online orders and reservations. Their old site was outdated, not mobile-friendly, and didn't showcase their cuisine effectively.",
                solution: "We designed and developed a modern, mobile-responsive website with integrated online ordering, reservation system, and beautiful food photography. We also implemented local SEO strategies to improve local search visibility.",
                results: [
                    { value: "250%", label: "Online Orders Increase" },
                    { value: "180%", label: "Website Traffic Growth" },
                    { value: "95%", label: "Mobile User Experience Score" },
                    { value: "#1", label: "Local Search Ranking" }
                ],
                testimonial: {
                    quote: "Our new website has transformed how customers interact with our restaurant. Online orders increased by 250% and we're booked solid thanks to the new reservation system.",
                    author: "Antonio Rossi",
                    position: "Owner, Bella Vista Restaurant"
                }
            },
            project5: {
                title: "Law Firm SEO Campaign",
                client: "Smith & Associates Law",
                challenge: "A law firm wanted to increase their online visibility for competitive legal keywords and establish themselves as thought leaders in their practice areas.",
                solution: "We implemented a comprehensive SEO and content marketing strategy, focusing on creating authoritative legal content, optimizing for local search, and building citations from legal directories.",
                results: [
                    { value: "Top 3", label: "Rankings for Key Legal Terms" },
                    { value: "320%", label: "Organic Traffic Increase" },
                    { value: "150%", label: "Qualified Lead Generation" },
                    { value: "90%", label: "Local Search Visibility" }
                ],
                testimonial: {
                    quote: "DigitalBoost helped us dominate local search results for our practice areas. We're now the go-to law firm in our city and have more qualified leads than ever.",
                    author: "Jennifer Smith",
                    position: "Partner, Smith & Associates Law"
                }
            },
            project6: {
                title: "Fitness Brand Social Strategy",
                client: "FitLife Gym",
                challenge: "A fitness center chain wanted to build a strong community on social media and drive membership sign-ups through digital channels.",
                solution: "We created a comprehensive social media strategy focusing on fitness education, member success stories, and community building. We also implemented targeted advertising campaigns and influencer partnerships with local fitness enthusiasts.",
                results: [
                    { value: "1M+", label: "Engagement Increase" },
                    { value: "200K+", label: "New Social Followers" },
                    { value: "300%", label: "Membership Inquiries" },
                    { value: "25%", label: "Member Retention Improvement" }
                ],
                testimonial: {
                    quote: "DigitalBoost helped us build an incredible fitness community online. Our social media engagement increased by over 1 million interactions and we've seen a huge boost in new memberships.",
                    author: "David Martinez",
                    position: "Marketing Manager, FitLife Gym"
                }
            }
        };
    }

    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
    }
}

// Initialize portfolio manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
});

// Add CSS for case study modal
const portfolioStyles = `
    .case-study__header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--neutral-200);
    }

    .case-study__title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 0.5rem;
    }

    .case-study__client {
        color: var(--primary-600);
        font-size: 1.125rem;
        font-weight: 500;
    }

    .case-study__overview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .case-study__challenge,
    .case-study__solution {
        padding: 1.5rem;
        background: var(--neutral-50);
        border-radius: var(--radius-lg);
    }

    .case-study__challenge h3,
    .case-study__solution h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 1rem;
    }

    .case-study__challenge p,
    .case-study__solution p {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .case-study__results {
        margin-bottom: 2rem;
    }

    .case-study__results h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .case-study__metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
    }

    .metric {
        text-align: center;
        padding: 1.5rem;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--neutral-200);
    }

    .metric__value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-600);
        margin-bottom: 0.5rem;
    }

    .metric__label {
        color: var(--text-secondary);
        font-weight: 500;
    }

    .case-study__testimonial {
        background: var(--primary-50);
        padding: 2rem;
        border-radius: var(--radius-lg);
        text-align: center;
        border-left: 4px solid var(--primary-600);
    }

    .case-study__testimonial blockquote {
        font-size: 1.25rem;
        font-style: italic;
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .case-study__testimonial cite {
        color: var(--primary-600);
        font-weight: 600;
        font-style: normal;
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }

    @media (max-width: 768px) {
        .case-study__overview {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .case-study__metrics {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .case-study__title {
            font-size: 1.5rem;
        }
        
        .metric__value {
            font-size: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .case-study__metrics {
            grid-template-columns: 1fr;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = portfolioStyles;
document.head.appendChild(styleSheet);