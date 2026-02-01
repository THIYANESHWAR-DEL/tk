// Additional interactive features for demonstration

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    // Ripple effect for buttons
    const buttons = document.querySelectorAll('.btn, .login-btn, .btn-small');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover sound effect simulation (visual feedback)
    const cards = document.querySelectorAll('.form-card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });
    
    // Enhanced input focus effects
    const inputs = document.querySelectorAll('.input, .login-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Page transition animations
    const links = document.querySelectorAll('.side-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('active')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Fade out effect
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location = href;
                }, 300);
            }
        });
    });
});

// Add CSS for ripple effect
const rippleCSS = `
    .btn, .login-btn, .btn-small {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .form-card, .stat-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .input:focus, .login-input:focus {
        transition: all 0.2s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleCSS;
document.head.appendChild(styleSheet);
