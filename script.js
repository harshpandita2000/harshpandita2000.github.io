// DOM Elements
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const statNumbers = document.querySelectorAll('.stat-number');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initProgressBar();
    initThemeToggle(); // This is the main issue - theme toggle needs to be initialized first
    initProjectFilters();
    initStatCounters();
    initSmoothScrolling();
    initAwardClicks();
    
    // Use ONLY the enhanced mobile menu (remove the duplicate)
    initEnhancedMobileMenu();
    initTouchGestures();
    initKeyboardNavigation();
});

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    console.log('Initializing stat counters, found:', statNumbers.length, 'elements');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Starting counter animation for:', entry.target.getAttribute('data-target'));
                
                const statElements = Array.from(document.querySelectorAll('.stat-number'));
                const index = statElements.indexOf(entry.target);
                
                entry.target.textContent = '0';
                
                setTimeout(() => {
                    animateCounter(entry.target);
                }, index * 200);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        stat.textContent = '0';
        observer.observe(stat);
    });

    // Fallback timer
    setTimeout(() => {
        statNumbers.forEach((stat, index) => {
            if (stat.textContent === '0') {
                console.log('Fallback animation for:', stat.getAttribute('data-target'));
                setTimeout(() => {
                    animateCounter(stat);
                }, index * 200);
            }
        });
    }, 3000);
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    let current = 0;
    
    if (element.animationTimer) {
        clearInterval(element.animationTimer);
    }
    
    element.textContent = '0';
    
    element.animationTimer = setInterval(() => {
        current++;
        
        if (current >= target) {
            if (target === 3) {
                element.textContent = '3+';
            } else if (target === 4) {
                element.textContent = '4';
            } else if (target === 1) {
                element.textContent = '1+';
            } else {
                element.textContent = target;
            }
            clearInterval(element.animationTimer);
            element.animationTimer = null;
        } else {
            element.textContent = current;
        }
    }, 150);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > .container > *').forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.classList.add('scale-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.experience-card').forEach((el, index) => {
        el.classList.add('slide-in-left');
        el.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.award-card').forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Progress Bar with throttling for better performance
function initProgressBar() {
    let ticking = false;
    
    function updateProgressBar() {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        if (window.scrollY > 100) {
            if (currentTheme === 'light') {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
            }
            header.classList.add('scrolled');
        } else {
            if (currentTheme === 'light') {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.8)';
            }
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgressBar);
            ticking = true;
        }
    });
}

// FIXED Theme Toggle - This is the main fix
function initThemeToggle() {
    // Ensure themeToggle element exists
    if (!themeToggle) {
        console.error('Theme toggle element not found');
        return;
    }
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    console.log('Theme initialized:', savedTheme);

    // Add click event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Update header background immediately
        setTimeout(() => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                if (newTheme === 'light') {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    header.style.background = 'rgba(0, 0, 0, 0.95)';
                }
            } else {
                if (newTheme === 'light') {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                } else {
                    header.style.background = 'rgba(0, 0, 0, 0.8)';
                }
            }
        }, 10);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Project Filters
function initProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Award Links
function initAwardClicks() {
    const clickableAwards = document.querySelectorAll('.clickable-award');
    
    clickableAwards.forEach(award => {
        award.setAttribute('tabindex', '0');
        award.setAttribute('role', 'button');
        
        award.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        award.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
}

// Function to open award/certification links
function openAward(url) {
    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#51cf66'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced Mobile Navigation - SINGLE VERSION
function initEnhancedMobileMenu() {
    if (!hamburger || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Add mobile social links if not present
    const mobileLinksHTML = `
        <div class="mobile-social-links">
            <a href="https://www.linkedin.com/in/harsh-pandita-dev/" target="_blank" aria-label="LinkedIn" title="LinkedIn Profile">
                <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/harshpandita2000" target="_blank" aria-label="GitHub" title="GitHub Profile">
                <i class="fab fa-github"></i>
            </a>
            <a href="https://leetcode.com/harshpandita/" target="_blank" aria-label="LeetCode" title="LeetCode Profile" class="mobile-leetcode">
                <img src="https://github.com/rahuldkjain/github-profile-readme-generator/raw/master/src/images/icons/Social/leet-code.svg" alt="LeetCode" class="mobile-platform-icon">
            </a>
            <a href="https://auth.geeksforgeeks.org/user/harshpandita/?utm_source=geeksforgeeks&utm_medium=my_profile&utm_campaign=auth_user" target="_blank" aria-label="GeeksforGeeks" title="GeeksforGeeks Profile" class="mobile-gfg">
                <img src="https://github.com/rahuldkjain/github-profile-readme-generator/raw/master/src/images/icons/Social/geeks-for-geeks.svg" alt="GeeksforGeeks" class="mobile-platform-icon">
            </a>
            <a href="mailto:Panditaharsh32@gmail.com" aria-label="Email" title="Send Email">
                <i class="fas fa-envelope"></i>
            </a>
        </div>
    `;
    
    if (!navMenu.querySelector('.mobile-social-links')) {
        navMenu.insertAdjacentHTML('beforeend', mobileLinksHTML);
    }
    
    // Hamburger click event
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking nav links or social links
    setTimeout(() => {
        const allNavLinks = document.querySelectorAll('.nav-link, .mobile-social-links a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }, 100);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 100);
    });
}

// Touch gesture support
function initTouchGestures() {
    let startY = 0;
    let currentY = 0;
    let startX = 0;
    let currentX = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        currentX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', () => {
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        if (navMenu && navMenu.classList.contains('active')) {
            // Swipe up to close mobile menu
            if (diffY > 50 && Math.abs(diffX) < 100) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Swipe right to close mobile menu
            if (diffX > 100 && Math.abs(diffY) < 50) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            if (hamburger) {
                hamburger.focus();
            }
        }
    });
}
