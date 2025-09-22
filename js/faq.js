/**
 * DigitalBoost Website - FAQ Functionality
 * Handles accordion functionality for FAQ sections
 */

class FAQManager {
    constructor() {
        this.faqItems = [];
        this.activeItem = null;
        this.init();
    }

    init() {
        this.loadFAQItems();
        this.setupEventListeners();
        this.initKeyboardNavigation();
    }

    loadFAQItems() {
        const faqElements = document.querySelectorAll('.faq-item');
        
        if (faqElements.length === 0) return;

        this.faqItems = Array.from(faqElements).map((element, index) => ({
            element: element,
            question: element.querySelector('.faq-item__question'),
            answer: element.querySelector('.faq-item__answer'),
            toggle: element.querySelector('.faq-item__toggle'),
            index: index,
            isOpen: false
        }));
    }

    setupEventListeners() {
        this.faqItems.forEach(item => {
            if (item.question) {
                item.question.addEventListener('click', () => {
                    this.toggleFAQ(item);
                });

                // Add keyboard support
                item.question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(item);
                    }
                });

                // Make questions focusable for accessibility
                item.question.setAttribute('tabindex', '0');
                item.question.setAttribute('role', 'button');
                item.question.setAttribute('aria-expanded', 'false');
            }
        });
    }

    toggleFAQ(item, forceOpen = null) {
        const wasOpen = item.isOpen;
        const shouldOpen = forceOpen !== null ? forceOpen : !wasOpen;

        if (shouldOpen && !wasOpen) {
            this.openFAQ(item);
        } else if (!shouldOpen && wasOpen) {
            this.closeFAQ(item);
        }
    }

    openFAQ(item) {
        if (item.isOpen) return;

        // Close other items if you want accordion behavior (only one open at a time)
        // Uncomment the next line for accordion behavior
        // this.closeAllFAQs();

        item.isOpen = true;
        item.element.classList.add('active');
        
        if (item.question) {
            item.question.setAttribute('aria-expanded', 'true');
        }

        if (item.answer) {
            // Calculate the scroll height for smooth animation
            const scrollHeight = item.answer.scrollHeight;
            item.answer.style.maxHeight = scrollHeight + 'px';
            
            // Add smooth transition
            item.answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
        }

        if (item.toggle) {
            item.toggle.style.transform = 'rotate(45deg)';
        }

        this.activeItem = item;

        // Trigger custom event
        this.dispatchFAQEvent('faq:opened', item);
    }

    closeFAQ(item) {
        if (!item.isOpen) return;

        item.isOpen = false;
        item.element.classList.remove('active');
        
        if (item.question) {
            item.question.setAttribute('aria-expanded', 'false');
        }

        if (item.answer) {
            item.answer.style.maxHeight = '0';
            item.answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
        }

        if (item.toggle) {
            item.toggle.style.transform = 'rotate(0deg)';
        }

        if (this.activeItem === item) {
            this.activeItem = null;
        }

        // Trigger custom event
        this.dispatchFAQEvent('faq:closed', item);
    }

    closeAllFAQs() {
        this.faqItems.forEach(item => {
            if (item.isOpen) {
                this.closeFAQ(item);
            }
        });
    }

    openAllFAQs() {
        this.faqItems.forEach(item => {
            if (!item.isOpen) {
                this.openFAQ(item);
            }
        });
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isInFAQSection(e.target)) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNextFAQ();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPreviousFAQ();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.focusFirstFAQ();
                    break;
                case 'End':
                    e.preventDefault();
                    this.focusLastFAQ();
                    break;
            }
        });
    }

    isInFAQSection(element) {
        return element.closest('.faq-container') !== null;
    }

    getCurrentFocusedIndex() {
        const focusedElement = document.activeElement;
        return this.faqItems.findIndex(item => item.question === focusedElement);
    }

    focusNextFAQ() {
        const currentIndex = this.getCurrentFocusedIndex();
        const nextIndex = currentIndex < this.faqItems.length - 1 ? currentIndex + 1 : 0;
        this.focusFAQByIndex(nextIndex);
    }

    focusPreviousFAQ() {
        const currentIndex = this.getCurrentFocusedIndex();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.faqItems.length - 1;
        this.focusFAQByIndex(prevIndex);
    }

    focusFirstFAQ() {
        this.focusFAQByIndex(0);
    }

    focusLastFAQ() {
        this.focusFAQByIndex(this.faqItems.length - 1);
    }

    focusFAQByIndex(index) {
        if (this.faqItems[index] && this.faqItems[index].question) {
            this.faqItems[index].question.focus();
        }
    }

    dispatchFAQEvent(eventType, item) {
        const event = new CustomEvent(eventType, {
            detail: {
                item: item,
                question: item.question?.textContent,
                index: item.index
            }
        });
        document.dispatchEvent(event);
    }

    // Search functionality for FAQs
    searchFAQs(query) {
        const results = [];
        
        this.faqItems.forEach(item => {
            const questionText = item.question?.textContent.toLowerCase() || '';
            const answerText = item.answer?.textContent.toLowerCase() || '';
            const searchQuery = query.toLowerCase();
            
            if (questionText.includes(searchQuery) || answerText.includes(searchQuery)) {
                results.push(item);
            }
        });
        
        return results;
    }

    highlightSearchResults(query) {
        this.clearHighlights();
        
        if (!query.trim()) return;
        
        const results = this.searchFAQs(query);
        
        // Hide non-matching items
        this.faqItems.forEach(item => {
            if (!results.includes(item)) {
                item.element.style.display = 'none';
            } else {
                item.element.style.display = 'block';
                this.highlightText(item, query);
            }
        });
    }

    highlightText(item, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        
        // Highlight in question
        if (item.question) {
            const questionText = item.question.innerHTML;
            item.question.innerHTML = questionText.replace(regex, '<mark>$1</mark>');
        }
        
        // Highlight in answer
        if (item.answer) {
            const answerText = item.answer.innerHTML;
            item.answer.innerHTML = answerText.replace(regex, '<mark>$1</mark>');
        }
    }

    clearHighlights() {
        this.faqItems.forEach(item => {
            item.element.style.display = 'block';
            
            if (item.question) {
                item.question.innerHTML = item.question.textContent;
            }
            
            if (item.answer) {
                item.answer.innerHTML = item.answer.textContent;
            }
        });
    }

    // Public API methods
    getFAQByIndex(index) {
        return this.faqItems[index] || null;
    }

    getOpenFAQs() {
        return this.faqItems.filter(item => item.isOpen);
    }

    getClosedFAQs() {
        return this.faqItems.filter(item => !item.isOpen);
    }

    // Analytics tracking
    trackFAQInteraction(item, action) {
        // Send analytics event if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                'faq_question': item.question?.textContent,
                'faq_action': action,
                'faq_index': item.index
            });
        }
        
        // Custom analytics implementation
        if (window.analytics) {
            window.analytics.track('FAQ Interaction', {
                question: item.question?.textContent,
                action: action,
                index: item.index
            });
        }
    }

    // Destroy method for cleanup
    destroy() {
        this.faqItems.forEach(item => {
            if (item.question) {
                item.question.removeEventListener('click', this.toggleFAQ);
                item.question.removeEventListener('keydown', this.toggleFAQ);
                item.question.removeAttribute('tabindex');
                item.question.removeAttribute('role');
                item.question.removeAttribute('aria-expanded');
            }
        });
        
        this.faqItems = [];
        this.activeItem = null;
    }
}

// Initialize FAQ manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.faqManager = new FAQManager();
    
    // Add event listeners for FAQ events
    document.addEventListener('faq:opened', (e) => {
        console.log('FAQ opened:', e.detail.question);
        // Track analytics
        if (window.faqManager) {
            window.faqManager.trackFAQInteraction(e.detail.item, 'opened');
        }
    });
    
    document.addEventListener('faq:closed', (e) => {
        console.log('FAQ closed:', e.detail.question);
        // Track analytics
        if (window.faqManager) {
            window.faqManager.trackFAQInteraction(e.detail.item, 'closed');
        }
    });
});

// Add FAQ-specific styles
const faqStyles = `
    .faq-item__question {
        cursor: pointer;
        user-select: none;
        transition: background-color var(--transition-fast);
        outline: none;
    }

    .faq-item__question:focus {
        background-color: var(--primary-50);
        box-shadow: 0 0 0 2px var(--primary-200);
    }

    .faq-item__question:hover {
        background-color: var(--neutral-50);
    }

    .faq-item__toggle {
        transition: transform var(--transition-fast);
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-600);
        user-select: none;
    }

    .faq-item.active .faq-item__toggle {
        transform: rotate(45deg);
    }

    .faq-item__answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        padding: 0 var(--space-6);
    }

    .faq-item.active .faq-item__answer {
        padding: 0 var(--space-6) var(--space-6);
    }

    /* Highlight styles for search */
    mark {
        background-color: var(--accent-200);
        color: var(--accent-900);
        padding: 2px 4px;
        border-radius: 2px;
        font-weight: 500;
    }

    /* Focus management */
    .faq-item__question:focus-visible {
        outline: 2px solid var(--primary-600);
        outline-offset: 2px;
    }

    /* Animation for FAQ items */
    .faq-item {
        transition: transform var(--transition-fast);
    }

    .faq-item:hover {
        transform: translateY(-2px);
    }

    .faq-item.active {
        box-shadow: var(--shadow-md);
    }
`;

// Add styles to document
const faqStyleSheet = document.createElement('style');
faqStyleSheet.textContent = faqStyles;
document.head.appendChild(faqStyleSheet);