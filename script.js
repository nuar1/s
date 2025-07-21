// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const galleryTrack = document.getElementById('gallery-track');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade-in on scroll animation
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

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Testimonial Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial and activate dot
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials every 5 seconds
setInterval(nextTestimonial, 5000);

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Gallery Drag Functionality
let isDown = false;
let startX;
let scrollLeft;

if (galleryTrack) {
    galleryTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryTrack.classList.add('active');
        startX = e.pageX - galleryTrack.offsetLeft;
        scrollLeft = galleryTrack.scrollLeft;
    });

    galleryTrack.addEventListener('mouseleave', () => {
        isDown = false;
        galleryTrack.classList.remove('active');
    });

    galleryTrack.addEventListener('mouseup', () => {
        isDown = false;
        galleryTrack.classList.remove('active');
    });

    galleryTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryTrack.offsetLeft;
        const walk = (x - startX) * 2;
        galleryTrack.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    galleryTrack.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - galleryTrack.offsetLeft;
        scrollLeft = galleryTrack.scrollLeft;
    });

    galleryTrack.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - galleryTrack.offsetLeft;
        const walk = (x - startX) * 2;
        galleryTrack.scrollLeft = scrollLeft - walk;
    });

    galleryTrack.addEventListener('touchend', () => {
        isDown = false;
    });
}

// Lightbox functionality
function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple form validation
        if (!data.fullName.trim() || !data.phone.trim()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Phone number validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            alert('Please enter a valid phone number.');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you! We\'ll contact you within 30 minutes for your free estimate.');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Add loading animation to CTA buttons
document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('loading');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery auto-scroll (subtle)
let galleryAutoScroll = setInterval(() => {
    if (galleryTrack && !isDown) {
        galleryTrack.scrollLeft += 1;
        
        // Reset scroll when reaching the end
        if (galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth) {
            galleryTrack.scrollLeft = 0;
        }
    }
}, 50);

// Pause auto-scroll on hover
if (galleryTrack) {
    galleryTrack.addEventListener('mouseenter', () => {
        clearInterval(galleryAutoScroll);
    });
    
    galleryTrack.addEventListener('mouseleave', () => {
        if (!isDown) {
            galleryAutoScroll = setInterval(() => {
                galleryTrack.scrollLeft += 1;
                if (galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth) {
                    galleryTrack.scrollLeft = 0;
                }
            }, 50);
        }
    });
}

// Add click tracking for analytics (placeholder)
function trackEvent(eventName, elementType) {
    // This is where you would send data to your analytics platform
    console.log(`Event: ${eventName}, Element: ${elementType}`);
}

// Track CTA button clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('cta_click', 'hero_button');
    });
});

// Track phone number clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('phone_click', 'phone_link');
    });
});

// Track form submissions
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('form_submit', 'contact_form');
    });
}

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #2D9CDB, #008C8C);
    z-index: 9999;
    transition: width 0.25s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add initial fade-in to hero content
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200);
        });
    }, 500);
    
    // Initialize first testimonial
    showTestimonial(0);
});

// Add error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.log('Image failed to load:', this.src);
    });
});

// Optimize for performance
let ticking = false;

function updateScrollElements() {
    // Batch scroll-based updates here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
});