/**
 * Enterprise Dashboard - Navigation & Menu Controller
 * WCAG 2.1 Compliant Navigation & Landmark Focus Management
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    highlightCurrentPage();
  });

  /**
   * Initializes mobile sidebar drawer behavior with full keyboard & ARIA support
   */
  function initMobileNavigation() {
    const toggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.app-sidebar');

    if (!toggleBtn || !sidebar) return;

    // Set initial ARIA state
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
        setMenuState(false);
        toggleBtn.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
      if (
        sidebar.classList.contains('is-open') &&
        !sidebar.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    function setMenuState(open) {
      toggleBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        sidebar.classList.add('is-open');
        announceToScreenReader('Navigation menu expanded');
      } else {
        sidebar.classList.remove('is-open');
        announceToScreenReader('Navigation menu collapsed');
      }
    }
  }

  /**
   * Ensures aria-current="page" is correctly assigned based on current URL
   */
  function highlightCurrentPage() {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Extract filename from href and current path
      const linkFile = href.split('/').pop().split('?')[0] || 'index.html';
      const currentFile = currentPath.split('/').pop() || 'index.html';

      if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Helper to announce live messages to screen readers
   * @param {string} message 
   */
  function announceToScreenReader(message) {
    let announcer = document.getElementById('global-live-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'global-live-announcer';
      announcer.className = 'visually-hidden-announcer sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }

  // Export for global access if needed
  window.DashboardNavigation = {
    announceToScreenReader
  };
})();
