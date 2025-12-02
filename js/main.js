/**
 * UNHOLY STEEZE - MAIN JAVASCRIPT
 * Common functionality for all pages
 */

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll for all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Get navbar height for offset
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        // Calculate position
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          20;

        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    // Check if link matches current page
    if (
      linkHref &&
      (linkHref.includes(currentPage) ||
        (currentPage === "" && linkHref.includes("index.html")))
    ) {
      link.classList.add("active");
    }
  });

  // ============================================
  // NAVBAR SCROLL EFFECT - SHRINK ON SCROLL
  // ============================================
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });
  }

  // ============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el) => observer.observe(el));

  // ============================================
  // MOBILE MENU AUTO-CLOSE
  // ============================================
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    // Close menu when clicking on a link
    const mobileNavLinks = navbarCollapse.querySelectorAll(".nav-link");

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.getComputedStyle(navbarToggler).display !== "none") {
          navbarToggler.click();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      const isClickInsideNav =
        navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
      const isNavOpen = navbarCollapse.classList.contains("show");

      if (!isClickInsideNav && isNavOpen) {
        navbarToggler.click();
      }
    });
  }

  // ============================================
  // PERFORMANCE: LAZY LOAD IMAGES
  // ============================================
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  // ============================================
  // UTILITY: DEBOUNCE FUNCTION
  // ============================================
  window.debounce = function (func, wait) {
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

  // ============================================
  // CONSOLE EASTER EGG
  // ============================================
  console.log(
    "%c🔥 Unholy Steeze",
    "font-size: 24px; font-weight: bold; color: #8B00FF; text-shadow: 0 0 10px rgba(139, 0, 255, 0.8);"
  );
  console.log(
    "%cWelcome to our Discord community!",
    "font-size: 14px; color: #FF00FF;"
  );
  console.log(
    "%chttps://discord.gg/mehHRpqC2z",
    "font-size: 12px; color: #7289da;"
  );
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener("load", function () {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});
