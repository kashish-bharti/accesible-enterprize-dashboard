/**
 * Enterprise Dashboard - Accessible Form Validation
 * WCAG 2.1 Compliant Constraint Validation & Screen Reader Live Announcements
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
  });

  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate="true"]');

    forms.forEach((form) => {
      // Disable default browser bubble validation in favor of custom accessible inline messaging
      form.setAttribute('novalidate', 'true');

      let hasSubmittedOnce = false;

      // Real-time re-validation on input/change once user has attempted to submit
      form.addEventListener('input', (event) => {
        if (hasSubmittedOnce && isFormField(event.target)) {
          validateField(event.target);
          updateSummaryIfVisible(form);
        }
      });

      form.addEventListener('change', (event) => {
        if (hasSubmittedOnce && isFormField(event.target)) {
          validateField(event.target);
          updateSummaryIfVisible(form);
        }
      });

      // Submit handling
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        hasSubmittedOnce = true;

        const isValid = validateEntireForm(form);

        if (!isValid) {
          // Focus error summary or first invalid field
          const errorSummary = form.querySelector('.error-summary');
          if (errorSummary) {
            errorSummary.focus();
          } else {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
          }
        } else {
          handleSuccessfulSubmission(form);
        }
      });

      // Reset handling
      form.addEventListener('reset', () => {
        hasSubmittedOnce = false;
        clearFormErrors(form);

        if (window.DashboardNavigation && window.DashboardNavigation.announceToScreenReader) {
          window.DashboardNavigation.announceToScreenReader('Form has been reset to default values.');
        }
      });
    });
  }

  function isFormField(element) {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    );
  }

  /**
   * Validates a single field using Constraint Validation API
   * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field 
   * @returns {boolean}
   */
  function validateField(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    const isCustomValid = field.checkValidity();

    if (!isCustomValid) {
      field.setAttribute('aria-invalid', 'true');
      const errorMessage = getCustomErrorMessage(field);

      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('is-visible');
      }
      return false;
    } else {
      field.removeAttribute('aria-invalid');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('is-visible');
      }
      return true;
    }
  }

  /**
   * Produces descriptive, human-friendly error messages
   * @param {HTMLElement} field 
   * @returns {string}
   */
  function getCustomErrorMessage(field) {
    const validity = field.validity;
    const label = document.querySelector(`label[for="${field.id}"]`);
    const labelText = label ? label.textContent.replace('*', '').trim() : 'This field';

    if (validity.valueMissing) {
      return `${labelText} is required and cannot be left blank.`;
    }
    if (validity.typeMismatch) {
      if (field.type === 'email') {
        return `Please enter a valid email address (e.g. alex@enterprise.com).`;
      }
      if (field.type === 'url') {
        return `Please enter a valid web URL starting with https://.`;
      }
      return `Please enter a valid format for ${labelText}.`;
    }
    if (validity.patternMismatch) {
      if (field.type === 'tel') {
        return `Phone number must match standard format: (e.g. 555-019-2834 or +1-555-019-2834).`;
      }
      return `The input format for ${labelText} is not valid.`;
    }
    if (validity.tooShort) {
      return `${labelText} must be at least ${field.minLength} characters long.`;
    }
    return field.validationMessage || `${labelText} is invalid.`;
  }

  /**
   * Validates all fields within the form and builds the error summary
   * @param {HTMLFormElement} form 
   * @returns {boolean}
   */
  function validateEntireForm(form) {
    const fields = form.querySelectorAll('input:not([type="submit"]):not([type="reset"]):not([type="button"]), select, textarea');
    const errors = [];

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        const label = form.querySelector(`label[for="${field.id}"]`);
        const labelText = label ? label.textContent.replace('*', '').trim() : field.name;
        const msg = getCustomErrorMessage(field);
        errors.push({ fieldId: field.id, labelText, msg });
      }
    });

    const errorSummary = form.querySelector('.error-summary');
    const errorList = form.querySelector('.error-summary-list');

    if (errors.length > 0) {
      if (errorSummary && errorList) {
        errorList.innerHTML = '';
        errors.forEach((err) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.fieldId}`;
          a.textContent = `${err.labelText}: ${err.msg}`;
          // Clicking jump link shifts focus to the field
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const targetField = document.getElementById(err.fieldId);
            if (targetField) targetField.focus();
          });
          li.appendChild(a);
          errorList.appendChild(li);
        });
        errorSummary.classList.add('is-visible');
      }

      if (window.DashboardNavigation && window.DashboardNavigation.announceToScreenReader) {
        window.DashboardNavigation.announceToScreenReader(
          `Form submission failed with ${errors.length} error${errors.length > 1 ? 's' : ''}. Please correct them below.`
        );
      }
      return false;
    } else {
      if (errorSummary) {
        errorSummary.classList.remove('is-visible');
      }
      return true;
    }
  }

  function updateSummaryIfVisible(form) {
    const errorSummary = form.querySelector('.error-summary');
    if (errorSummary && errorSummary.classList.contains('is-visible')) {
      validateEntireForm(form);
    }
  }

  function clearFormErrors(form) {
    const fields = form.querySelectorAll('[aria-invalid="true"]');
    fields.forEach((f) => f.removeAttribute('aria-invalid'));

    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach((el) => {
      el.textContent = '';
      el.classList.remove('is-visible');
    });

    const errorSummary = form.querySelector('.error-summary');
    if (errorSummary) errorSummary.classList.remove('is-visible');

    const successBanner = form.querySelector('.success-banner');
    if (successBanner) successBanner.classList.remove('is-visible');
  }

  function handleSuccessfulSubmission(form) {
    clearFormErrors(form);

    const successBanner = form.querySelector('.success-banner');
    if (successBanner) {
      successBanner.classList.add('is-visible');
      successBanner.focus();
    }

    if (window.DashboardNavigation && window.DashboardNavigation.announceToScreenReader) {
      window.DashboardNavigation.announceToScreenReader(
        'Form submitted successfully! Your settings and user preferences have been updated.'
      );
    }
  }

  window.DashboardValidation = {
    validateEntireForm,
    clearFormErrors
  };
})();
