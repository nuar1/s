/**
 * SlideFixPros - High Performance Landing Page JavaScript
 * Mobile-first, performance-optimized, accessible interactions
 */

(function() {
    'use strict';

    // ============================================
    // PERFORMANCE & LOADING OPTIMIZATIONS
    // ============================================

    // Critical performance metrics tracking
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'cumulative-layout-shift') {
                console.log('CLS:', entry.value);
            }
        }
    });

    // Start observing performance metrics
    if ('PerformanceObserver' in window) {
        try {
            performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        } catch (e) {
            console.log('Performance Observer not supported');
        }
    }

    // ============================================
    // LAZY LOADING OPTIMIZATIONS
    // ============================================

    // Enhanced lazy loading with Intersection Observer
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create a new image to preload
                const newImg = new Image();
                newImg.onload = function() {
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                };
                newImg.src = img.dataset.src || img.src;
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Initialize lazy loading when DOM is ready
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }

    // ============================================
    // FAQ FUNCTIONALITY
    // ============================================

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    
                    // Smooth scroll to FAQ item if it's not fully visible
                    setTimeout(() => {
                        const rect = item.getBoundingClientRect();
                        if (rect.top < 100) {
                            item.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }
                    }, 300);
                }
                
                // Track FAQ interaction
                trackEvent('faq_interaction', {
                    question: question.textContent.trim(),
                    action: isActive ? 'close' : 'open'
                });
            });

            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ============================================
    // ANALYTICS & TRACKING
    // ============================================

    // Initialize dataLayer for GTM
    window.dataLayer = window.dataLayer || [];

    // Enhanced call tracking with additional context
    window.trackCall = function(source = 'unknown') {
        const callData = {
            event: 'click_to_call',
            event_category: 'engagement',
            event_label: 'phone_call',
            call_source: source,
            page_section: getCurrentSection(),
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        };
        
        // Push to dataLayer for GTM
        window.dataLayer.push(callData);
        
        // Also track with console for debugging
        console.log('Call tracked:', callData);
        
        // Store in localStorage for conversion attribution
        try {
            const callHistory = JSON.parse(localStorage.getItem('slidefixpros_calls') || '[]');
            callHistory.push(callData);
            // Keep only last 10 calls
            if (callHistory.length > 10) {
                callHistory.splice(0, callHistory.length - 10);
            }
            localStorage.setItem('slidefixpros_calls', JSON.stringify(callHistory));
        } catch (e) {
            console.log('Could not store call data in localStorage');
        }
    };

    // Generic event tracking function
    window.trackEvent = function(eventName, eventData = {}) {
        const enrichedData = {
            event: eventName,
            page_url: window.location.href,
            page_title: document.title,
            timestamp: new Date().toISOString(),
            ...eventData
        };
        
        window.dataLayer.push(enrichedData);
        console.log('Event tracked:', enrichedData);
    };

    // Get current section based on scroll position
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        for (let section of sections) {
            const offsetTop = section.offsetTop;
            const offsetBottom = offsetTop + section.offsetHeight;
            
            if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                return section.id;
            }
        }
        return 'unknown';
    }

    // ============================================
    // SCROLL FUNCTIONALITY
    // ============================================

    // Smooth scroll to top
    window.scrollToTop = function() {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        
        trackEvent('scroll_to_top', {
            previous_position: window.scrollY
        });
    };

    // Header visibility on scroll
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ============================================
    // FORM ENHANCEMENTS
    // ============================================

    // Add dynamic number insertion placeholder
    function initDynamicNumberInsertion() {
        // This would integrate with your call tracking service
        // Placeholder for DNI (Dynamic Number Insertion) integration
        const phoneElements = document.querySelectorAll('a[href^="tel:"]');
        
        phoneElements.forEach(el => {
            // Add click tracking to all phone links
            el.addEventListener('click', (e) => {
                const source = el.closest('section')?.id || 'unknown';
                trackCall(source);
            });
        });
        
        // Example DNI integration (replace with your service)
        // fetch('/api/get-tracking-number')
        //     .then(response => response.json())
        //     .then(data => {
        //         phoneElements.forEach(el => {
        //             el.href = `tel:${data.trackingNumber}`;
        //             el.textContent = el.textContent.replace(/\+1 \(888\) 504-4553/g, data.displayNumber);
        //         });
        //     });
    }

    // ============================================
    // INTERSECTION OBSERVER ANIMATIONS
    // ============================================

    function initScrollAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Track section views
                    const sectionId = entry.target.id || entry.target.closest('section')?.id;
                    if (sectionId) {
                        trackEvent('section_view', {
                            section: sectionId,
                            intersection_ratio: entry.intersectionRatio
                        });
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections for animations
        const sections = document.querySelectorAll('.section, .hero, .trust-bar, .cta-section');
        sections.forEach(section => animationObserver.observe(section));
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================

    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            z-index: 1001;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.setAttribute('id', 'main-content');
            heroSection.setAttribute('role', 'main');
        }

        // Enhance focus management
        document.addEventListener('keydown', (e) => {
            // Escape key closes FAQ items
            if (e.key === 'Escape') {
                const activeFAQ = document.querySelector('.faq-item.active');
                if (activeFAQ) {
                    activeFAQ.classList.remove('active');
                    const question = activeFAQ.querySelector('.faq-question');
                    question.setAttribute('aria-expanded', 'false');
                    question.focus();
                }
            }
        });

        // Announce dynamic content changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        
        window.announceToScreenReader = function(message) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        };
    }

    // ============================================
    // ERROR HANDLING & FALLBACKS
    // ============================================

    function initErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            trackEvent('promise_rejection', {
                reason: e.reason?.toString() || 'Unknown'
            });
        });

        // Fallback for browsers without Intersection Observer
        if (!('IntersectionObserver' in window)) {
            // Simple fallback: show all images immediately
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }
    }

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================

    function initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    trackEvent('core_web_vital', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime,
                        rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                               entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor'
                    });
                }
            }).observe({ type: 'first-input', buffered: true });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            }).observe({ type: 'layout-shift', buffered: true });

            // Report CLS on page visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    trackEvent('core_web_vital', {
                        metric: 'CLS',
                        value: clsValue,
                        rating: clsValue < 0.1 ? 'good' : 
                               clsValue < 0.25 ? 'needs-improvement' : 'poor'
                    });
                }
            });
        }

        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    trackEvent('page_performance', {
                        load_time: perfData.loadEventEnd - perfData.loadEventStart,
                        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
                        tcp_handshake: perfData.connectEnd - perfData.connectStart,
                        response_time: perfData.responseEnd - perfData.responseStart
                    });
                }
            }, 0);
        });
    }

    // ============================================
    // GALLERY ENHANCEMENTS
    // ============================================

    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const images = item.querySelectorAll('img');
            
            // Add hover effects and click tracking
            item.addEventListener('click', () => {
                trackEvent('gallery_interaction', {
                    gallery_item: index,
                    gallery_location: item.querySelector('.gallery-caption h3')?.textContent || 'unknown'
                });
            });

            // Preload images on hover for better UX
            item.addEventListener('mouseenter', () => {
                images.forEach(img => {
                    if (img.dataset.src && !img.src.includes(img.dataset.src)) {
                        const preloadImg = new Image();
                        preloadImg.src = img.dataset.src;
                    }
                });
            }, { once: true });
        });
    }

    // ============================================
    // TRUST BAR INTERACTIONS
    // ============================================

    function initTrustBar() {
        const trustItems = document.querySelectorAll('.trust-item');
        
        trustItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    trackEvent('trust_indicator_click', {
                        indicator_type: item.textContent.includes('Google') ? 'google_reviews' : 'yelp_reviews',
                        indicator_text: item.textContent.trim()
                    });
                });
            }
        });

        // Add swipe hint for mobile trust bar
        const trustBar = document.querySelector('.trust-bar');
        const trustItems_container = document.querySelector('.trust-items');
        
        if (trustBar && trustItems_container) {
            let isScrolling = false;
            
            trustItems_container.addEventListener('scroll', () => {
                if (!isScrolling) {
                    trackEvent('trust_bar_scroll', {
                        scroll_position: trustItems_container.scrollLeft
                    });
                    isScrolling = true;
                    setTimeout(() => {
                        isScrolling = false;
                    }, 1000);
                }
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    // DOM Ready function
    function domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Initialize all functionality
    domReady(() => {
        console.log('SlideFixPros landing page initialized');
        
        // Initialize core functionality
        initFAQ();
        initLazyLoading();
        initAccessibility();
        initErrorHandling();
        initDynamicNumberInsertion();
        initScrollAnimations();
        initHeaderScroll();
        initGallery();
        initTrustBar();
        initPerformanceMonitoring();

        // Track page view
        trackEvent('page_view', {
            page_type: 'landing_page',
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            referrer: document.referrer || 'direct'
        });

        // Set up viewport change tracking
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                trackEvent('viewport_change', {
                    new_width: window.innerWidth,
                    new_height: window.innerHeight
                });
            }, 250);
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    trackEvent('scroll_depth', {
                        depth_percentage: maxScrollDepth
                    });
                }
            }
        }, { passive: true });

        // Page unload tracking
        window.addEventListener('beforeunload', () => {
            trackEvent('page_unload', {
                time_on_page: Date.now() - performance.timing.navigationStart,
                max_scroll_depth: maxScrollDepth
            });
        });
    });

    // Export global functions
    window.SlideFixPros = {
        trackCall: window.trackCall,
        trackEvent: window.trackEvent,
        scrollToTop: window.scrollToTop,
        announceToScreenReader: window.announceToScreenReader
    };

})();