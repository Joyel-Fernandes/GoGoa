
(function () {
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(fieldEl, errorEl, message) {
    if (message) {
      fieldEl.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      fieldEl.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  /* ---------- Password visibility toggle ---------- */
  var toggleBtn = document.getElementById('toggle-password');
  var passwordInput = document.getElementById('password');
  toggleBtn.addEventListener('click', function () {
    var revealed = toggleBtn.classList.toggle('revealed');
    passwordInput.type = revealed ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', revealed ? 'Hide password' : 'Show password');
  });

  /* ---------- Sign-in form ---------- */
  var emailInput = document.getElementById('email');
  var emailField = emailInput.closest('.field');
  var emailError = document.getElementById('email-error');
  var passwordField = passwordInput.closest('.field');
  var passwordError = document.getElementById('password-error');
  var signinForm = document.getElementById('signin-form');
  var signinBtn = document.getElementById('signin-btn');
  var signinStatus = document.getElementById('signin-status');

  emailInput.addEventListener('input', function () {
    if (emailField.classList.contains('invalid') && isValidEmail(emailInput.value.trim())) {
      setFieldError(emailField, emailError, '');
    }
  });
  passwordInput.addEventListener('input', function () {
    if (passwordField.classList.contains('invalid') && passwordInput.value.length >= 6) {
      setFieldError(passwordField, passwordError, '');
    }
  });

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailVal = emailInput.value.trim();
    var passVal = passwordInput.value;
    var valid = true;

    if (!emailVal) { setFieldError(emailField, emailError, 'Email is required.'); valid = false; }
    else if (!isValidEmail(emailVal)) { setFieldError(emailField, emailError, 'Enter a valid email address.'); valid = false; }
    else { setFieldError(emailField, emailError, ''); }

    if (!passVal) { setFieldError(passwordField, passwordError, 'Password is required.'); valid = false; }
    else if (passVal.length < 6) { setFieldError(passwordField, passwordError, 'Password must be at least 6 characters.'); valid = false; }
    else { setFieldError(passwordField, passwordError, ''); }

    signinStatus.classList.remove('show');
    signinStatus.textContent = '';
    if (!valid) return;

    signinBtn.classList.add('loading');
    signinBtn.disabled = true;

    setTimeout(function () {
      signinBtn.classList.remove('loading');
      signinBtn.disabled = false;
      signinStatus.classList.add('show');
      signinStatus.textContent = 'Signed in successfully — welcome back!';
    }, 900);
  });

  /* ---------- View switching (sign in <-> reset password) ---------- */
  var viewSignin = document.getElementById('view-signin');
  var viewReset = document.getElementById('view-reset');
  var forgotLink = document.getElementById('forgot-link');
  var backBtn = document.getElementById('back-to-signin');
  var resetEmailInput = document.getElementById('reset-email');
  var resetEmailField = resetEmailInput.closest('.field');
  var resetEmailError = document.getElementById('reset-email-error');
  var resetStatus = document.getElementById('reset-status');

  forgotLink.addEventListener('click', function () {
    resetStatus.classList.remove('show');
    resetStatus.textContent = '';
    setFieldError(resetEmailField, resetEmailError, '');
    resetEmailInput.value = emailInput.value.trim();
    viewSignin.classList.remove('active');
    viewReset.classList.add('active');
    resetEmailInput.focus();
  });

  backBtn.addEventListener('click', function () {
    viewReset.classList.remove('active');
    viewSignin.classList.add('active');
  });

  /* ---------- Reset-password form ---------- */
  var resetForm = document.getElementById('reset-form');

  resetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = resetEmailInput.value.trim();
    resetStatus.classList.remove('show');
    resetStatus.textContent = '';

    if (!val) { setFieldError(resetEmailField, resetEmailError, 'Email is required.'); return; }
    if (!isValidEmail(val)) { setFieldError(resetEmailField, resetEmailError, 'Enter a valid email address.'); return; }
    setFieldError(resetEmailField, resetEmailError, '');

    var resetBtn = resetForm.querySelector('.btn-primary');
    resetBtn.disabled = true;
    resetStatus.textContent = 'Sending reset link…';

    setTimeout(function () {
      resetBtn.disabled = false;
      resetStatus.classList.add('show');
      resetStatus.textContent = 'If an account exists for ' + val + ', a reset link is on its way.';
    }, 700);
  });

  /* ---------- Sign-up link (inert in this prototype) ---------- */
  document.getElementById('signup-link').addEventListener('click', function (e) {
    e.preventDefault();
  });
})();


