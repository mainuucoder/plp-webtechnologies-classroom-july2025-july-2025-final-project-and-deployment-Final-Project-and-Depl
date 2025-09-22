/**
 * DigitalBoost Website - Form Validation
 * Handles contact form validation and submission
 */

class FormValidator {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.successMessage = document.getElementById('form-success');
        this.isSubmitting = false;
        
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: false,
                pattern: /^[\d\s\-\+\(\)]+$/,
                message: 'Please enter a valid phone number'
            },
            service: {
                required: true,
                message: 'Please select a service'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.initRealTimeValidation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
                // Validate on input for immediate feedback on certain fields
                if (input.type === 'email' || input.name === 'phone') {
                    setTimeout(() => this.validateField(input), 500);
                }
            });
        });
    }

    initRealTimeValidation() {
        // Character counter for message field
        const messageField = document.getElementById('message');
        if (messageField) {
            this.addCharacterCounter(messageField);
        }

        // Phone number formatting
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            this.initPhoneFormatting(phoneField);
        }
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        // Pattern validation
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        // Length validation
        else if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message;
        }
        else if (value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.message;
        }

        this.displayFieldError(field, isValid, errorMessage);
        return isValid;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('[name]');
        let isFormValid = true;

        fields.forEach(field => {
            const fieldValid = this.validateField(field);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    displayFieldError(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.form-error');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
        } else {
            field.classList.add('error');
            if (errorElement) {
                errorElement.classList.add('show');
                errorElement.textContent = message;
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    getFieldLabel(fieldName) {
        const labelMap = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            company: 'Company name',
            service: 'Service selection',
            budget: 'Budget range',
            message: 'Message'
        };
        
        return labelMap[fieldName] || fieldName;
    }

    addCharacterCounter(field) {
        const maxLength = 1000;
        const minLength = 10;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
            text-align: right;
        `;
        
        field.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            const currentLength = field.value.length;
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (currentLength < minLength) {
                counter.style.color = 'var(--warning-600)';
                counter.textContent += ` (minimum ${minLength})`;
            } else if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--warning-600)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        };
        
        field.addEventListener('input', updateCounter);
        updateCounter();
    }

    initPhoneFormatting(field) {
        field.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d+)/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        const isValid = this.validateForm();
        if (!isValid) {
            this.showFormError('Please correct the errors above before submitting.');
            return;
        }

        this.isSubmitting = true;
        this.updateSubmitButton(true);

        try {
            const formData = this.collectFormData();
            await this.submitForm(formData);
            this.showSuccess();
            this.resetForm();
        } catch (error) {
            this.showFormError('Sorry, there was an error submitting your form. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        return data;
    }

    async submitForm(data) {
        // Simulate form submission (replace with actual endpoint)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated server error'));
                }
            }, 2000);
        });
        
        // Uncomment and modify for actual form submission
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
        */
    }

    updateSubmitButton(isLoading) {
        if (!this.submitBtn) return;
        
        if (isLoading) {
            this.submitBtn.textContent = 'Sending...';
            this.submitBtn.disabled = true;
            this.submitBtn.style.opacity = '0.7';
        } else {
            this.submitBtn.textContent = 'Send Message';
            this.submitBtn.disabled = false;
            this.submitBtn.style.opacity = '1';
        }
    }

    showSuccess() {
        if (this.successMessage) {
            this.successMessage.classList.add('show');
            
            // Scroll to success message
            this.successMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }

        // Show notification if available
        if (window.DigitalBoost) {
            window.DigitalBoost.showNotification(
                'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
                'success'
            );
        }
    }

    showFormError(message) {
        // Show notification if available
        if (window.DigitalBoost) {
            window.DigitalBoost.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    resetForm() {
        this.form.reset();
        
        // Clear all error states
        const fields = this.form.querySelectorAll('[name]');
        fields.forEach(field => {
            this.clearFieldError(field);
        });
        
        // Update character counter
        const messageField = document.getElementById('message');
        if (messageField) {
            const counter = messageField.parentNode.querySelector('.character-counter');
            if (counter) {
                counter.textContent = '0/1000 characters (minimum 10)';
                counter.style.color = 'var(--warning-600)';
            }
        }
        
        // Hide success message after delay
        setTimeout(() => {
            if (this.successMessage) {
                this.successMessage.classList.remove('show');
            }
        }, 5000);
    }

    // Public method to validate specific field
    validateSpecificField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            return this.validateField(field);
        }
        return false;
    }

    // Public method to get form data
    getFormData() {
        return this.collectFormData();
    }

    // Public method to reset validation
    resetValidation() {
        const fields = this.form.querySelectorAll('[name]');
        fields.forEach(field => {
            this.clearFieldError(field);
        });
    }
}

// Initialize form validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
});

// Add form-specific styles
const formStyles = `
    .character-counter {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
        text-align: right;
        transition: color var(--transition-fast);
    }

    .form-field {
        position: relative;
    }

    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--error-500);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-error {
        color: var(--error-500);
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: none;
        font-weight: 500;
    }

    .form-error.show {
        display: block;
        animation: slideDown 0.3s ease;
    }

    .form-success {
        background: linear-gradient(135deg, var(--success-50), var(--success-100));
        border: 1px solid var(--success-200);
        color: var(--success-800);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        margin-top: 1.5rem;
        display: none;
        font-weight: 500;
    }

    .form-success.show {
        display: block;
        animation: slideDown 0.5s ease;
    }

    .form-success p {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Loading animation for submit button */
    .form-submit:disabled {
        cursor: not-allowed;
        position: relative;
    }

    .form-submit:disabled::after {
        content: '';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: translateY(-50%) rotate(360deg);
        }
    }
`;

// Add styles to document
const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formStyles;
document.head.appendChild(formStyleSheet);