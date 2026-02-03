/**
 * FastPath Diagnostics - Shared JavaScript
 * Reusable components for email capture and analytics tracking
 */

// ===== Analytics Helper =====
// Safe wrapper for gtag - calls window.gtag if present, else no-op
function track(eventName, props = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, props);
    }
}

// ===== Email Capture Component =====
const EMAIL_STORAGE_KEY = 'fastpath_pilot_email';

// Save email to localStorage and navigate to form
function submitEmailCapture(email, formPagePath = 'pilot-program.html') {
    if (!email || !email.includes('@')) {
        return false;
    }

    // Save to localStorage
    localStorage.setItem(EMAIL_STORAGE_KEY, email);

    // Track the event
    track('email_capture_submit', {
        email_domain: email.split('@')[1],
        capture_location: window.location.pathname
    });

    // Navigate to form page with email param
    const url = new URL(formPagePath, window.location.href);
    url.searchParams.set('email', email);
    window.location.href = url.toString();

    return true;
}

// Get saved email from localStorage or URL param
function getSavedEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const emailFromStorage = localStorage.getItem(EMAIL_STORAGE_KEY);

    return emailFromUrl || emailFromStorage || '';
}

// Initialize email capture forms
function initEmailCapture() {
    // Hero email capture
    const heroForm = document.getElementById('hero-email-form');
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput) {
                submitEmailCapture(emailInput.value);
            }
        });
    }

    // Top bar email capture
    const barForm = document.getElementById('topbar-email-form');
    if (barForm) {
        barForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput) {
                submitEmailCapture(emailInput.value);
            }
        });
    }

    // Prefill email on form page
    const pilotEmailField = document.getElementById('email');
    if (pilotEmailField && pilotEmailField.closest('form[name="pilot-request-usa"]')) {
        const savedEmail = getSavedEmail();
        if (savedEmail) {
            pilotEmailField.value = savedEmail;
        }
    }
}

// ===== Industry Selection Tracking =====
function initIndustryTracking() {
    // Track clicks on industry tiles
    const industryTiles = document.querySelectorAll('[data-industry]');
    industryTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const industry = this.getAttribute('data-industry');
            track('choose_industry_click', {
                industry: industry,
                page: window.location.pathname
            });
        });
    });

    // Track when "Choose your industry" section is first viewed
    const industrySection = document.getElementById('industries');
    if (industrySection && 'IntersectionObserver' in window) {
        let hasTracked = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasTracked) {
                    hasTracked = true;
                    track('choose_industry_view', {
                        page: window.location.pathname
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(industrySection);
    }
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.mobile-menu-toggle, .mobile-menu-btn');
    if (nav) {
        nav.classList.toggle('active');
    }
    if (btn) {
        btn.classList.toggle('active');
    }
}

// Initialize mobile menu dropdowns
function initMobileMenu() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 900 && this.querySelector('.mega-menu')) {
                if (!e.target.closest('.mega-menu')) {
                    e.preventDefault();
                    this.classList.toggle('mobile-open');
                }
            }
        });
    });
}

// ===== Initialize All =====
document.addEventListener('DOMContentLoaded', function() {
    initEmailCapture();
    initIndustryTracking();
    initMobileMenu();
});
