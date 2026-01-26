// Form Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const loginBtn = document.querySelector('.login-btn');
const successMessage = document.getElementById('successMessage');

// Test Credentials
const TEST_EMAIL = 'student@school.edu';
const TEST_PASSWORD = 'password123';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRememberedEmail();
    addEventListeners();
});

// Add Event Listeners
function addEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', clearError.bind(null, 'email'));

    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', clearError.bind(null, 'password'));

    // Toggle password visibility
    togglePassword.addEventListener('click', togglePasswordVisibility);

    // Enter key in password field
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// Validate Email
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        setError('email', 'Email is required');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('email', 'Please enter a valid email address');
        return false;
    }

    clearError('email');
    return true;
}

// Validate Password
function validatePassword() {
    const password = passwordInput.value;

    if (!password) {
        setError('password', 'Password is required');
        return false;
    }

    if (password.length < 6) {
        setError('password', 'Password must be at least 6 characters');
        return false;
    }

    clearError('password');
    return true;
}

// Set Error Message
function setError(field, message) {
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

// Clear Error Message
function clearError(field) {
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';

    if (isPassword) {
        passwordInput.type = 'text';
        togglePassword.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        togglePassword.textContent = '👁';
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    // Clear previous errors
    clearError('email');
    clearError('password');

    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    // Disable button and show loading state
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    // Simulate API call
    setTimeout(() => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Check credentials
        if (email === TEST_EMAIL && password === TEST_PASSWORD) {
            loginSuccess();
        } else {
            loginError(email, password);
        }

        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }, 1000);
}

// Login Success
function loginSuccess() {
    // Show success message
    successMessage.classList.remove('hidden');

    // Save email if "Remember me" is checked
    if (rememberMe.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    // Reset form
    loginForm.style.display = 'none';

    // Simulate redirect
    setTimeout(() => {
        alert('Login successful!\n\nEmail: ' + emailInput.value + '\n\nYou would be redirected to the dashboard.');
        resetForm();
    }, 1500);
}

// Login Error
function loginError(email, password) {
    if (email !== TEST_EMAIL) {
        setError('email', 'Email not found');
    } else if (password !== TEST_PASSWORD) {
        setError('password', 'Incorrect password');
    } else {
        setError('email', 'Invalid credentials');
    }
}

// Load Remembered Email
function loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMe.checked = true;
    }
}

// Reset Form
function resetForm() {
    loginForm.style.display = 'block';
    successMessage.classList.add('hidden');
    loginForm.reset();
    rememberMe.checked = false;
    emailInput.focus();
    
    // Reload remembered email if exists
    loadRememberedEmail();
}

// Bonus: Add password strength indicator (optional)
passwordInput.addEventListener('input', updatePasswordStrength);

function updatePasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    // You can use this strength indicator to add visual feedback
    // This is optional and can be extended in the HTML
}
