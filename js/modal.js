/**
 * Enterprise Dashboard - Modal Dialog Controller
 * WCAG 2.1 Compliant Native <dialog> Focus Management & Keyboard Handling
 */

(function () {
  'use strict';

  let lastActiveElement = null;

  document.addEventListener('DOMContentLoaded', () => {
    initModalTriggers();
    initModalLightDismiss();
  });

  /**
   * Initializes data-attribute driven modal open and close triggers
   */
  function initModalTriggers() {
    // Open triggers
    document.addEventListener('click', (event) => {
      const openBtn = event.target.closest('[data-modal-target]');
      if (!openBtn) return;

      const targetSelector = openBtn.getAttribute('data-modal-target');
      const modal = document.querySelector(targetSelector);
      if (modal && typeof modal.showModal === 'function') {
        openModal(modal, openBtn);
      }
    });

    // Close triggers
    document.addEventListener('click', (event) => {
      const closeBtn = event.target.closest('[data-modal-close]');
      if (!closeBtn) return;

      const modal = closeBtn.closest('dialog');
      if (modal) {
        closeModal(modal);
      }
    });

    // Handle native cancel event (triggered by Escape key)
    document.addEventListener('cancel', (event) => {
      if (event.target.tagName === 'DIALOG') {
        // Restore focus on close
        setTimeout(() => {
          if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
            lastActiveElement.focus();
          }
        }, 10);
      }
    });
  }

  /**
   * Opens the dialog in modal mode, saves previous focus, and places focus inside
   * @param {HTMLDialogElement} modal 
   * @param {HTMLElement} [trigger] 
   */
  function openModal(modal, trigger) {
    if (!modal) return;

    lastActiveElement = trigger || document.activeElement;

    // Open natively
    modal.showModal();

    // Focus the first interactive element or close button inside
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    if (window.DashboardNavigation && window.DashboardNavigation.announceToScreenReader) {
      const title = modal.querySelector('.modal-title');
      const titleText = title ? title.textContent : 'Confirmation';
      window.DashboardNavigation.announceToScreenReader(`Modal dialog opened: ${titleText}`);
    }
  }

  /**
   * Closes the dialog and restores focus to the opener element
   * @param {HTMLDialogElement} modal 
   */
  function closeModal(modal) {
    if (!modal || !modal.open) return;

    modal.close();

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }

    if (window.DashboardNavigation && window.DashboardNavigation.announceToScreenReader) {
      window.DashboardNavigation.announceToScreenReader('Modal dialog closed');
    }
  }

  /**
   * Enables light-dismiss: clicking on the backdrop closes the modal
   */
  function initModalLightDismiss() {
    const dialogs = document.querySelectorAll('dialog.modal-dialog');
    dialogs.forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        // If clicking directly on the dialog background (not its children)
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isInDialog) {
          closeModal(dialog);
        }
      });
    });
  }

  // Export functions to window namespace
  window.DashboardModal = {
    open: openModal,
    close: closeModal
  };
})();
