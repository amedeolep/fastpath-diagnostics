/**
 * FastPath Diagnostics - Main JavaScript
 * Professional food safety diagnostics website
 */

(function() {
  'use strict';

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ========================================
  // HEADER & NAVIGATION
  // ========================================

  const initHeader = () => {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMain = document.querySelector('.nav-main');

    // Scroll behavior
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll (optional)
      // if (currentScrollY > lastScrollY && currentScrollY > 200) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Mobile menu toggle
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMain.classList.toggle('mobile-open');
        document.body.classList.toggle('menu-open');
      });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          mobileToggle?.classList.remove('active');
          navMain?.classList.remove('mobile-open');
          document.body.classList.remove('menu-open');
        }
      });
    });
  };

  // ========================================
  // SEARCH OVERLAY
  // ========================================

  const initSearch = () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay-close');
    const searchInput = document.querySelector('.search-overlay-input');

    if (!searchBtn || !searchOverlay) return;

    const openSearch = () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 300);
    };

    const closeSearch = () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    searchBtn.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    });
  };

  // ========================================
  // TESTIMONIALS CAROUSEL
  // ========================================

  const initTestimonialsCarousel = () => {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonials-track');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = carousel.querySelector('.testimonials-nav-btn.prev');
    const nextBtn = carousel.querySelector('.testimonials-nav-btn.next');
    const dotsContainer = carousel.querySelector('.testimonials-dots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let cardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const totalSlides = Math.ceil(cards.length / cardsPerView);

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `testimonials-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    const updateCarousel = () => {
      const cardWidth = cards[0].offsetWidth + 24; // Including gap
      track.style.transform = `translateX(-${currentIndex * cardWidth * cardsPerView}px)`;

      // Update dots
      document.querySelectorAll('.testimonials-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Update buttons
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - 1;
    };

    const goToSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      updateCarousel();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    });

    // Handle resize
    window.addEventListener('resize', debounce(() => {
      cardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
      updateCarousel();
    }, 250));

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  };

  // ========================================
  // LOGO TICKER
  // ========================================

  const initLogoTicker = () => {
    const ticker = document.querySelector('.logo-ticker-track');
    if (!ticker) return;

    // Clone items for infinite scroll
    const items = ticker.innerHTML;
    ticker.innerHTML = items + items;
  };

  // ========================================
  // STATS COUNTER ANIMATION
  // ========================================

  const initStatsCounter = () => {
    const stats = document.querySelectorAll('[data-count]');
    if (stats.length === 0) return;

    const animateValue = (element, start, end, duration) => {
      const startTime = performance.now();
      const suffix = element.dataset.suffix || '';
      const prefix = element.dataset.prefix || '';

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const endValue = parseInt(element.dataset.count, 10);
          animateValue(element, 0, endValue, 2000);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  };

  // ========================================
  // STICKY CTA
  // ========================================

  const initStickyCTA = () => {
    const stickyCTA = document.querySelector('.sticky-cta');
    if (!stickyCTA) return;

    const showAfter = 500; // Show after scrolling 500px

    const handleScroll = () => {
      if (window.scrollY > showAfter) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', throttle(handleScroll, 100));
  };

  // ========================================
  // EXIT INTENT POPUP
  // ========================================

  const initExitIntent = () => {
    const popup = document.querySelector('.exit-popup');
    const backdrop = document.querySelector('.modal-backdrop');
    const closeBtn = document.querySelector('.exit-popup .modal-close');

    if (!popup || !backdrop) return;

    let shown = sessionStorage.getItem('exitPopupShown');

    const showPopup = () => {
      if (shown) return;
      popup.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      shown = true;
      sessionStorage.setItem('exitPopupShown', 'true');
    };

    const hidePopup = () => {
      popup.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Exit intent detection
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 10 && !shown) {
        showPopup();
      }
    });

    closeBtn?.addEventListener('click', hidePopup);
    backdrop.addEventListener('click', hidePopup);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('active')) {
        hidePopup();
      }
    });
  };

  // ========================================
  // FORMS
  // ========================================

  const initForms = () => {
    // Form validation
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
          const error = field.parentElement.querySelector('.form-error');

          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            if (error) error.style.display = 'block';
          } else {
            field.classList.remove('error');
            if (error) error.style.display = 'none';
          }

          // Email validation
          if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
              isValid = false;
              field.classList.add('error');
              if (error) {
                error.textContent = 'Please enter a valid email address';
                error.style.display = 'block';
              }
            }
          }
        });

        if (isValid) {
          // Track form submission
          trackEvent('form_submit', {
            form_id: form.id || 'unknown',
            form_name: form.dataset.formName || 'unknown'
          });

          // Show success message or submit
          const successMessage = form.querySelector('.form-success');
          if (successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
          } else {
            // Could submit via AJAX here
            form.submit();
          }
        }
      });

      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => {
          if (field.required && !field.value.trim()) {
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });

        field.addEventListener('input', () => {
          field.classList.remove('error');
        });
      });
    });

    // Multi-step form
    const multiStepForms = document.querySelectorAll('[data-multistep]');

    multiStepForms.forEach(form => {
      const steps = form.querySelectorAll('.form-step-content');
      const stepIndicators = form.querySelectorAll('.form-step');
      const nextBtns = form.querySelectorAll('[data-next]');
      const prevBtns = form.querySelectorAll('[data-prev]');
      let currentStep = 0;

      const showStep = (index) => {
        steps.forEach((step, i) => {
          step.classList.toggle('active', i === index);
        });

        stepIndicators.forEach((indicator, i) => {
          indicator.classList.remove('active', 'completed');
          if (i < index) indicator.classList.add('completed');
          if (i === index) indicator.classList.add('active');
        });

        currentStep = index;
      };

      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Validate current step
          const currentStepEl = steps[currentStep];
          const requiredFields = currentStepEl.querySelectorAll('[required]');
          let isValid = true;

          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              isValid = false;
              field.classList.add('error');
            }
          });

          if (isValid && currentStep < steps.length - 1) {
            showStep(currentStep + 1);
          }
        });
      });

      prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentStep > 0) {
            showStep(currentStep - 1);
          }
        });
      });
    });
  };

  // ========================================
  // TABS & FILTERS
  // ========================================

  const initTabs = () => {
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const panels = container.querySelectorAll('.tab-panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;

          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          document.getElementById(target)?.classList.add('active');
        });
      });
    });

    // Filter toggles
    const filterToggles = document.querySelectorAll('.filter-toggle');

    filterToggles.forEach(toggle => {
      const buttons = toggle.querySelectorAll('.filter-toggle-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Filter content
          const items = document.querySelectorAll('[data-category]');
          items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });
  };

  // ========================================
  // PRODUCT GALLERY
  // ========================================

  const initProductGallery = () => {
    const gallery = document.querySelector('.product-gallery');
    if (!gallery) return;

    const mainImage = gallery.querySelector('.product-gallery-main img');
    const thumbs = gallery.querySelectorAll('.product-gallery-thumb');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.dataset.image || thumb.querySelector('img')?.src;
        if (newSrc && mainImage) {
          mainImage.src = newSrc;
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
    });
  };

  // ========================================
  // ROI CALCULATOR
  // ========================================

  const initROICalculator = () => {
    const calculator = document.querySelector('.roi-calculator');
    if (!calculator) return;

    const inputs = calculator.querySelectorAll('input, select');
    const results = {
      timeSaved: calculator.querySelector('[data-result="time-saved"]'),
      laborSaved: calculator.querySelector('[data-result="labor-saved"]'),
      accuracyImprovement: calculator.querySelector('[data-result="accuracy"]'),
      annualSavings: calculator.querySelector('[data-result="annual-savings"]')
    };

    const calculate = () => {
      const testsPerDay = parseInt(calculator.querySelector('[name="tests-per-day"]')?.value) || 0;
      const currentTimePerTest = parseFloat(calculator.querySelector('[name="current-time"]')?.value) || 0;
      const laborCost = parseFloat(calculator.querySelector('[name="labor-cost"]')?.value) || 0;

      // FastPath reduces time to 4 hours from typical 24-48 hours
      const fastPathTimePerTest = 4;
      const timeSavedPerTest = Math.max(0, currentTimePerTest - fastPathTimePerTest);
      const dailyTimeSaved = timeSavedPerTest * testsPerDay;
      const annualTimeSaved = dailyTimeSaved * 250; // Working days

      const hourlyLaborCost = laborCost / 2080; // Annual to hourly
      const annualLaborSaved = annualTimeSaved * hourlyLaborCost;

      // Additional savings from accuracy (reduced recalls, etc.)
      const accuracySavings = testsPerDay * 250 * 15; // $15 per test in reduced risk
      const totalAnnualSavings = annualLaborSaved + accuracySavings;

      // Update display
      if (results.timeSaved) results.timeSaved.textContent = Math.round(annualTimeSaved).toLocaleString() + ' hrs';
      if (results.laborSaved) results.laborSaved.textContent = '$' + Math.round(annualLaborSaved).toLocaleString();
      if (results.accuracyImprovement) results.accuracyImprovement.textContent = '99.9%';
      if (results.annualSavings) results.annualSavings.textContent = '$' + Math.round(totalAnnualSavings).toLocaleString();
    };

    inputs.forEach(input => {
      input.addEventListener('input', debounce(calculate, 300));
      input.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();
  };

  // ========================================
  // PRODUCT CONFIGURATOR
  // ========================================

  const initConfigurator = () => {
    const configurator = document.querySelector('.configurator');
    if (!configurator) return;

    const steps = configurator.querySelectorAll('.configurator-step');
    const options = configurator.querySelectorAll('.configurator-option');
    const nextBtn = configurator.querySelector('[data-next]');
    const prevBtn = configurator.querySelector('[data-prev]');
    const resultEl = configurator.querySelector('.configurator-result');

    let currentStep = 0;
    const selections = {};

    const showStep = (index) => {
      steps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
      });
      currentStep = index;

      // Update buttons
      if (prevBtn) prevBtn.style.display = index === 0 ? 'none' : '';
      if (nextBtn) nextBtn.textContent = index === steps.length - 1 ? 'See Recommendation' : 'Next';
    };

    options.forEach(option => {
      option.addEventListener('click', () => {
        const step = option.closest('.configurator-step');
        const stepOptions = step.querySelectorAll('.configurator-option');

        stepOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        selections[step.dataset.step] = option.dataset.value;
      });
    });

    nextBtn?.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      } else {
        // Show recommendation
        showRecommendation();
      }
    });

    prevBtn?.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });

    const showRecommendation = () => {
      // Based on selections, recommend products
      let recommendation = 'FastPath Apex® System';
      let reason = 'Based on your selections, we recommend our flagship detection system.';

      if (selections.volume === 'high') {
        recommendation = 'FastPath Apex® System + FastPath Enviro® Monitor';
        reason = 'For high-volume testing, combining our detection system with environmental monitoring provides comprehensive coverage.';
      } else if (selections.focus === 'environmental') {
        recommendation = 'FastPath Enviro® Monitor';
        reason = 'Our environmental monitoring solution is perfect for Listeria tracking and zone management.';
      }

      if (resultEl) {
        resultEl.innerHTML = `
          <h3>Our Recommendation</h3>
          <p class="recommendation-product">${recommendation}</p>
          <p class="recommendation-reason">${reason}</p>
          <a href="/products/" class="btn btn-primary">View Products</a>
          <a href="/contact.html" class="btn btn-secondary">Talk to Sales</a>
        `;
        resultEl.style.display = 'block';
        steps.forEach(step => step.classList.remove('active'));
      }
    };
  };

  // ========================================
  // COMPARISON TABLE
  // ========================================

  const initComparisonTable = () => {
    const table = document.querySelector('.comparison-table');
    if (!table) return;

    // Highlight column on hover
    const cells = table.querySelectorAll('td, th');

    cells.forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const index = cell.cellIndex;
        table.querySelectorAll(`td:nth-child(${index + 1}), th:nth-child(${index + 1})`).forEach(c => {
          c.classList.add('highlight');
        });
      });

      cell.addEventListener('mouseleave', () => {
        table.querySelectorAll('.highlight').forEach(c => {
          c.classList.remove('highlight');
        });
      });
    });
  };

  // ========================================
  // SMOOTH SCROLL
  // ========================================

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ========================================
  // LAZY LOADING
  // ========================================

  const initLazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  };

  // ========================================
  // ANIMATION ON SCROLL
  // ========================================

  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const animation = el.dataset.animate || 'fade-in-up';
            const delay = el.dataset.animateDelay || 0;

            setTimeout(() => {
              el.classList.add(`animate-${animation}`);
              el.style.opacity = '1';
            }, delay);

            animationObserver.unobserve(el);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        animationObserver.observe(el);
      });
    }
  };

  // ========================================
  // ANALYTICS TRACKING
  // ========================================

  const trackEvent = (eventName, params = {}) => {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // LinkedIn Insight
    if (typeof lintrk === 'function') {
      lintrk('track', { conversion_id: params.conversion_id });
    }

    // Console log in development
    if (window.location.hostname === 'localhost') {
      console.log('Track Event:', eventName, params);
    }
  };

  const initAnalytics = () => {
    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
      btn.addEventListener('click', () => {
        trackEvent('cta_click', {
          button_text: btn.textContent.trim(),
          button_location: btn.closest('section')?.className || 'unknown'
        });
      });
    });

    // Track demo requests
    document.querySelectorAll('a[href*="demo"], button[data-action="demo"]').forEach(el => {
      el.addEventListener('click', () => {
        trackEvent('demo_request_click', {
          source: el.closest('section')?.className || 'unknown'
        });
      });
    });

    // Track resource downloads
    document.querySelectorAll('a[href*=".pdf"], a[data-download]').forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('resource_download', {
          file_name: link.href.split('/').pop(),
          resource_type: 'pdf'
        });
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 100];

    window.addEventListener('scroll', throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && maxScroll < milestone) {
          trackEvent('scroll_depth', { percent: milestone });
          maxScroll = milestone;
        }
      });
    }, 500));

    // Track video plays
    document.querySelectorAll('video').forEach(video => {
      video.addEventListener('play', () => {
        trackEvent('video_play', {
          video_title: video.dataset.title || 'unknown'
        });
      });
    });
  };

  // ========================================
  // REGION SELECTOR
  // ========================================

  const initRegionSelector = () => {
    const regionSelector = document.querySelector('.region-selector');
    if (!regionSelector) return;

    const options = regionSelector.querySelectorAll('.region-option');

    options.forEach(option => {
      option.addEventListener('click', () => {
        const region = option.dataset.region;

        // Update active state
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Update button text
        const btn = regionSelector.querySelector('.region-btn span');
        if (btn) btn.textContent = option.textContent.trim();

        // Store preference
        localStorage.setItem('preferredRegion', region);

        // Could redirect to region-specific content
        // window.location.href = `/${region}/`;
      });
    });

    // Load saved preference
    const savedRegion = localStorage.getItem('preferredRegion');
    if (savedRegion) {
      const savedOption = regionSelector.querySelector(`[data-region="${savedRegion}"]`);
      if (savedOption) {
        options.forEach(opt => opt.classList.remove('active'));
        savedOption.classList.add('active');
        const btn = regionSelector.querySelector('.region-btn span');
        if (btn) btn.textContent = savedOption.textContent.trim();
      }
    }
  };

  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  const initMobileNav = () => {
    // Create mobile nav if it doesn't exist
    if (window.innerWidth > 1024) return;

    const nav = document.querySelector('.nav-main');
    if (!nav) return;

    // Add mobile styles
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 1024px) {
        .nav-main {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fff;
          flex-direction: column;
          padding: var(--space-6);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
          z-index: 100;
        }

        .nav-main.mobile-open {
          transform: translateX(0);
        }

        .nav-item {
          width: 100%;
        }

        .nav-link {
          width: 100%;
          padding: var(--space-4);
          font-size: 1.125rem;
        }

        .mega-menu {
          position: static;
          transform: none;
          box-shadow: none;
          padding: var(--space-4);
          background: var(--neutral-100);
          border-radius: var(--radius-md);
          margin-top: var(--space-2);
          opacity: 1;
          visibility: visible;
          display: none;
        }

        .nav-item.open .mega-menu {
          display: block;
        }

        body.menu-open {
          overflow: hidden;
        }
      }
    `;
    document.head.appendChild(style);

    // Toggle submenus on mobile
    const navItems = nav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const megaMenu = item.querySelector('.mega-menu');

      if (megaMenu && link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            item.classList.toggle('open');
          }
        });
      }
    });
  };

  // ========================================
  // CHAT WIDGET (Placeholder)
  // ========================================

  const initChatWidget = () => {
    const chatBtn = document.querySelector('.chat-widget-btn');
    if (!chatBtn) return;

    chatBtn.addEventListener('click', () => {
      // Placeholder - would integrate with actual chat service
      alert('Live chat would open here. For immediate assistance, please contact us at info@fastpathdiag.com or call (415) 555-0100.');

      trackEvent('chat_widget_click');
    });
  };

  // ========================================
  // INITIALIZE
  // ========================================

  const init = () => {
    initHeader();
    initSearch();
    initTestimonialsCarousel();
    initLogoTicker();
    initStatsCounter();
    initStickyCTA();
    initExitIntent();
    initForms();
    initTabs();
    initProductGallery();
    initROICalculator();
    initConfigurator();
    initComparisonTable();
    initSmoothScroll();
    initLazyLoad();
    initScrollAnimations();
    initAnalytics();
    initRegionSelector();
    initMobileNav();
    initChatWidget();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
