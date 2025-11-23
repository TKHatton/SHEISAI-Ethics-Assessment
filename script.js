// Accessibility-focused interactions

// FAQ accordion
function setupAccordion() {
  const buttons = document.querySelectorAll('.accordion-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Close all others for single-open behavior (optional)
      document.querySelectorAll('.accordion-button[aria-expanded="true"]').forEach((openBtn) => {
        if (openBtn !== btn) {
          openBtn.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(openBtn.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });

    // Keyboard: Enter/Space activates; Up/Down to navigate between headers
    btn.addEventListener('keydown', (e) => {
      const key = e.key;
      const items = Array.from(document.querySelectorAll('.accordion-button'));
      const i = items.indexOf(btn);
      if (key === 'ArrowDown') {
        e.preventDefault();
        items[(i + 1) % items.length].focus();
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length].focus();
      }
    });
  });
}

// Improve focus styles on keyboard nav only
function setupFocusVisible() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }
  function handleMouseDownOnce() {
    document.documentElement.classList.remove('user-tabbing');
    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
  }
  window.addEventListener('keydown', handleFirstTab);
}

// Defer heavy background images until after first paint (progressive enhancement)
function setupHeroImageFallback() {
  const hero = document.querySelector('.hero__media');
  if (!hero) return;
  const test = new Image();
  test.src = 'assets/hero.jpg';
  test.onload = () => { /* background already set via CSS */ };
  test.onerror = () => {
    // Fallback to gradient-only if image missing
    hero.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)';
  };
}

// Timezone conversion for schedule
function setupTimezoneConversion() {
  const sessionTimes = document.querySelectorAll('.session-time');

  sessionTimes.forEach((element) => {
    const datetime = element.getAttribute('data-datetime');
    const duration = parseInt(element.getAttribute('data-duration'), 10);

    if (!datetime) return;

    try {
      // Parse the ISO datetime string
      const date = new Date(datetime);

      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Format start time in user's local timezone
      const localTimeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTimezone
      });

      // Calculate end time
      const endDate = new Date(date.getTime() + duration * 60 * 60 * 1000);

      // Format end time
      const endTimeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTimezone
      });

      // Format original EST time for reference
      const estTimeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });

      const localStart = localTimeFormatter.format(date);
      const localEnd = endTimeFormatter.format(endDate);
      const estTime = estTimeFormatter.format(date);

      // Get timezone abbreviation
      const tzName = new Intl.DateTimeFormat('en-US', {
        timeZoneName: 'short',
        timeZone: userTimezone
      }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';

      // Update the element
      element.textContent = `${localStart} – ${localEnd} ${tzName}`;

      // Add reference to original EST time if different
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (localTz !== 'America/New_York') {
        const reference = document.createElement('span');
        reference.className = 'time-reference';
        reference.textContent = ` (originally ${estTime} EST)`;
        element.appendChild(reference);
      }
    } catch (error) {
      console.error('Error converting timezone:', error);
      element.textContent = 'Time conversion error';
    }
  });
}

// Registration System
let supabaseClient = null;

// Initialize Supabase (you'll need to set these environment variables or add them directly)
function initializeSupabase() {
  // TODO: Replace with actual Supabase URL and Anon Key
  // These should be set in your deployment environment or added here
  const SUPABASE_URL = window.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized');
  } else {
    console.warn('Supabase credentials not configured. Registration will show a message to contact admin.');
  }
}

// Modal Control
function setupRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const overlay = document.querySelector('.modal-overlay');

  // Open modal
  openButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const classId = button.getAttribute('data-class');
      openModal(classId);
    });
  });

  // Close modal
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

function openModal(classId = null) {
  const modal = document.getElementById('registration-modal');
  const form = document.getElementById('registration-form');
  const classSelect = document.getElementById('reg-class');

  // Reset form
  form.reset();
  clearErrors();
  hideMessages();

  // Pre-select class if specified
  if (classId && classSelect) {
    classSelect.value = classId;
    handleClassSelection();
  }

  // Show modal
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Focus first input
  setTimeout(() => {
    document.getElementById('reg-name').focus();
  }, 100);
}

function closeModal() {
  const modal = document.getElementById('registration-modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Form Validation
function setupFormValidation() {
  const form = document.getElementById('registration-form');
  const classSelect = document.getElementById('reg-class');

  // Handle class selection changes
  if (classSelect) {
    classSelect.addEventListener('change', handleClassSelection);
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function handleClassSelection() {
  const classSelect = document.getElementById('reg-class');
  const selected = classSelect.options[classSelect.selectedIndex];
  const classType = selected.getAttribute('data-type');
  const datetime = selected.getAttribute('data-datetime');
  const duration = selected.getAttribute('data-duration');

  const acknowledgment = document.getElementById('part-acknowledgment');
  const timeDisplay = document.getElementById('class-time-display');

  // Show/hide acknowledgment checkbox for Part 1 and Part 2
  if (classType === 'part1' || classType === 'part2') {
    acknowledgment.style.display = 'block';
    document.getElementById('reg-acknowledge').required = true;
  } else {
    acknowledgment.style.display = 'none';
    document.getElementById('reg-acknowledge').required = false;
    document.getElementById('reg-acknowledge').checked = false;
  }

  // Display time in user's timezone
  if (datetime && duration) {
    const localTime = formatTimeInUserTimezone(datetime, parseInt(duration));
    timeDisplay.innerHTML = `<strong>Your local time:</strong> ${localTime}`;
    timeDisplay.style.display = 'block';
  } else {
    timeDisplay.style.display = 'none';
  }

  clearErrors();
}

function formatTimeInUserTimezone(datetime, duration) {
  try {
    const date = new Date(datetime);
    const endDate = new Date(date.getTime() + duration * 60 * 60 * 1000);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: userTimezone
    });

    const tzName = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: userTimezone
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';

    return `${dateFormatter.format(date)} at ${timeFormatter.format(date)} – ${timeFormatter.format(endDate)} ${tzName}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Time conversion error';
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  // Clear previous errors
  clearErrors();

  // Get form data
  const formData = {
    fullName: document.getElementById('reg-name').value.trim(),
    email: document.getElementById('reg-email').value.trim(),
    organization: document.getElementById('reg-org').value.trim(),
    classSelection: document.getElementById('reg-class').value
  };

  const classSelect = document.getElementById('reg-class');
  const selected = classSelect.options[classSelect.selectedIndex];
  const classType = selected.getAttribute('data-type');
  const datetime = selected.getAttribute('data-datetime');
  const duration = selected.getAttribute('data-duration');
  const acknowledge = document.getElementById('reg-acknowledge');

  // Validation
  let hasError = false;

  if (!formData.fullName) {
    showError('name-error', 'Please enter your full name');
    hasError = true;
  }

  if (!formData.email) {
    showError('email-error', 'Please enter your email address');
    hasError = true;
  } else if (!isValidEmail(formData.email)) {
    showError('email-error', 'Please enter a valid email address');
    hasError = true;
  }

  if (!formData.classSelection) {
    showError('class-error', 'Please select a class');
    hasError = true;
  }

  if ((classType === 'part1' || classType === 'part2') && !acknowledge.checked) {
    showError('acknowledge-error', 'You must acknowledge that both Part 1 and Part 2 are required');
    hasError = true;
  }

  if (hasError) {
    return;
  }

  // Calculate session times
  const sessionStart = new Date(datetime);
  const sessionEnd = new Date(sessionStart.getTime() + parseInt(duration) * 60 * 60 * 1000);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Prepare registration data
  const registrationData = {
    email: formData.email,
    full_name: formData.fullName,
    organization: formData.organization || null,
    role: null,
    session_id: formData.classSelection,
    session_start_utc: sessionStart.toISOString(),
    session_end_utc: sessionEnd.toISOString(),
    tz: tz,
    user_agent: navigator.userAgent
  };

  // Submit to Supabase
  await submitRegistration(registrationData, classType);
}

async function submitRegistration(data, classType) {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    if (!supabaseClient) {
      // Fallback if Supabase not configured
      showManualRegistrationMessage(data, classType);
      return;
    }

    const { error } = await supabaseClient
      .from('registrations')
      .insert(data);

    if (error) {
      throw error;
    }

    // Success
    showSuccessMessage(data, classType);

    // TODO: Trigger email confirmation (requires backend endpoint or email service)
    // For now, this would need to be set up separately with Supabase Edge Functions
    // or a third-party email service like Resend or Postmark

  } catch (error) {
    console.error('Registration error:', error);
    showErrorMessage(error.message || 'An error occurred during registration. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Complete Registration';
  }
}

function showSuccessMessage(data, classType) {
  const form = document.getElementById('registration-form');
  const successMessage = document.getElementById('success-message');
  const successDetails = document.getElementById('success-details');

  let message = `<strong>Thank you, ${data.full_name}!</strong><br><br>`;
  message += `You have successfully registered for the class on <strong>${new Date(data.session_start_utc).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.<br><br>`;
  message += `A confirmation email will be sent to <strong>${data.email}</strong> with all the details.`;

  if (classType === 'part1') {
    message += `<br><br><div style="background: #FFF3CD; padding: 16px; border-radius: 8px; border-left: 4px solid #FFA500; margin-top: 16px;">`;
    message += `<strong>⚠️ IMPORTANT REMINDER:</strong><br>`;
    message += `This is <strong>Part 1</strong> of the training. You MUST also register for a <strong>Part 2</strong> session to complete the full training and receive your certification.`;
    message += `</div>`;
  } else if (classType === 'part2') {
    message += `<br><br><div style="background: #D1ECF1; padding: 16px; border-radius: 8px; border-left: 4px solid #0C5460; margin-top: 16px;">`;
    message += `<strong>✓ Great!</strong><br>`;
    message += `If you've also registered for Part 1, you're all set to complete the full training.`;
    message += `</div>`;
  } else {
    message += `<br><br><div style="background: #D4EDDA; padding: 16px; border-radius: 8px; border-left: 4px solid #28A745; margin-top: 16px;">`;
    message += `<strong>✓ You're all set!</strong><br>`;
    message += `This complete 4-hour training session covers everything you need for certification.`;
    message += `</div>`;
  }

  successDetails.innerHTML = message;
  form.style.display = 'none';
  successMessage.style.display = 'block';
}

function showManualRegistrationMessage(data, classType) {
  const form = document.getElementById('registration-form');
  const successMessage = document.getElementById('success-message');
  const successDetails = document.getElementById('success-details');

  let message = `<strong>Thank you for your interest, ${data.full_name}!</strong><br><br>`;
  message += `To complete your registration, please contact us at <strong>info@sheisai.ai</strong> with the following information:<br><br>`;
  message += `• Your name: ${data.full_name}<br>`;
  message += `• Your email: ${data.email}<br>`;
  message += `• Selected class: ${data.session_id}<br>`;
  if (data.organization) {
    message += `• Organization: ${data.organization}<br>`;
  }
  message += `<br>We'll confirm your registration and send you all the details shortly.`;

  successDetails.innerHTML = message;
  form.style.display = 'none';
  successMessage.style.display = 'block';
}

function showErrorMessage(message) {
  const form = document.getElementById('registration-form');
  const errorMessage = document.getElementById('error-message');
  const errorDetails = document.getElementById('error-details');

  errorDetails.textContent = message || 'An unexpected error occurred. Please try again or contact us at info@sheisai.ai for assistance.';
  form.style.display = 'none';
  errorMessage.style.display = 'block';
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Also add error class to input
    const inputId = elementId.replace('-error', '');
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    }
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.form-error');
  errorElements.forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });

  const inputs = document.querySelectorAll('.form-input, .form-select');
  inputs.forEach(input => {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
  });
}

function hideMessages() {
  document.getElementById('success-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
  document.getElementById('registration-form').style.display = 'block';
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
  setupAccordion();
  setupFocusVisible();
  setupHeroImageFallback();
  setupTimezoneConversion();
  initializeSupabase();
  setupRegistrationModal();
  setupFormValidation();
});
