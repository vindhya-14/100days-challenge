const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength');

passwordInput.addEventListener('input', () => {
  const val = passwordInput.value.trim();
  let strength = 0;

  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[a-z]/.test(val)) strength++;
  if (/\d/.test(val)) strength++;
  if (/[\W_]/.test(val)) strength++;

  if (strength <= 2) {
    strengthText.textContent = "Weak";
    strengthText.className = 'strength-text weak';
  } else if (strength === 3 || strength === 4) {
    strengthText.textContent = "Medium";
    strengthText.className = 'strength-text medium';
  } else if (strength === 5) {
    strengthText.textContent = "Strong";
    strengthText.className = 'strength-text strong';
  } else {
    strengthText.textContent = "";
    strengthText.className = 'strength-text';
  }
});
