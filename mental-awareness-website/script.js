// ============================
// Navigation & Mobile Menu
// ============================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
    });
});

// ============================
// Mood Tracker
// ============================
let selectedMood = null;
const moodButtons = document.querySelectorAll('.mood-btn');
const saveMoodBtn = document.getElementById('saveMoodBtn');
const moodNotes = document.getElementById('moodNotes');
const moodEntries = document.getElementById('moodEntries');

// Load mood entries from localStorage
let moods = JSON.parse(localStorage.getItem('moodEntries')) || [];

// Display initial mood entries
displayMoodEntries();

// Mood button event listeners
moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMood = btn.dataset.mood;
    });
});

// Save mood entry
saveMoodBtn.addEventListener('click', () => {
    if (!selectedMood) {
        alert('Please select a mood first!');
        return;
    }

    const moodEntry = {
        mood: selectedMood,
        notes: moodNotes.value,
        timestamp: new Date().toLocaleString()
    };

    moods.unshift(moodEntry);
    localStorage.setItem('moodEntries', JSON.stringify(moods));

    // Reset form
    moodButtons.forEach(b => b.classList.remove('active'));
    moodNotes.value = '';
    selectedMood = null;

    // Display updated entries
    displayMoodEntries();

    // Show success message
    showNotification('Mood entry saved successfully!', 'success');
});

// Display mood entries
function displayMoodEntries() {
    moodEntries.innerHTML = '';

    if (moods.length === 0) {
        moodEntries.innerHTML = '<p style="text-align: center; color: #999;">No mood entries yet. Start tracking your mood!</p>';
        return;
    }

    moods.forEach((entry, index) => {
        const moodEmoji = getMoodEmoji(entry.mood);
        const entryDiv = document.createElement('div');
        entryDiv.className = 'mood-entry';
        entryDiv.innerHTML = `
            <div class="mood-entry-info">
                <div class="mood-entry-mood">${moodEmoji} ${capitalizeFirst(entry.mood)}</div>
                <div class="mood-entry-time">${entry.timestamp}</div>
                ${entry.notes ? `<div style="margin-top: 8px; color: #666;">${entry.notes}</div>` : ''}
            </div>
            <button class="mood-entry-delete" onclick="deleteMoodEntry(${index})">Delete</button>
        `;
        moodEntries.appendChild(entryDiv);
    });
}

// Delete mood entry
function deleteMoodEntry(index) {
    moods.splice(index, 1);
    localStorage.setItem('moodEntries', JSON.stringify(moods));
    displayMoodEntries();
    showNotification('Mood entry deleted', 'success');
}

// Get mood emoji
function getMoodEmoji(mood) {
    const emojis = {
        terrible: '😭',
        bad: '😞',
        okay: '😐',
        good: '😊',
        excellent: '😄'
    };
    return emojis[mood] || '😐';
}

// ============================
// Meditation Timer
// ============================
let meditationTimer;
let meditationSeconds;
let meditationPaused = false;

function startMeditation(type, duration) {
    const modal = document.getElementById('meditationModal');
    const meditationType = document.getElementById('meditationType');
    const meditationInstruction = document.getElementById('meditationInstruction');

    // Set up meditation type
    const types = {
        calm: { title: '5-Minute Calm Breathing', instruction: 'Breathe in for 4 counts, hold for 4, exhale for 4...' },
        focus: { title: '10-Minute Focus', instruction: 'Focus on your breath and let thoughts pass without judgment...' },
        sleep: { title: '15-Minute Sleep', instruction: 'Relax your body from head to toe and prepare for restful sleep...' },
        gratitude: { title: '7-Minute Gratitude', instruction: 'Think of things you\'re grateful for and feel appreciation...' },
        reset: { title: '3-Minute Quick Reset', instruction: 'Take deep breaths and reset your nervous system...' },
        deep: { title: '20-Minute Deep Relaxation', instruction: 'Progressive relaxation from head to toe for complete peace...' }
    };

    meditationType.textContent = types[type].title;
    meditationInstruction.textContent = types[type].instruction;

    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Set timer
    meditationSeconds = duration * 60;
    meditationPaused = false;
    document.getElementById('pausePlayBtn').textContent = 'Pause';

    updateMeditationTimer();
    meditationTimer = setInterval(updateMeditationTimer, 1000);
}

function updateMeditationTimer() {
    if (meditationPaused) return;

    const minutes = Math.floor(meditationSeconds / 60);
    const seconds = meditationSeconds % 60;

    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');

    if (meditationSeconds <= 0) {
        clearInterval(meditationTimer);
        completeMeditation();
        return;
    }

    meditationSeconds--;
}

function toggleMeditationTimer() {
    meditationPaused = !meditationPaused;
    const btn = document.getElementById('pausePlayBtn');
    btn.textContent = meditationPaused ? 'Resume' : 'Pause';
}

function closeMeditation() {
    clearInterval(meditationTimer);
    const modal = document.getElementById('meditationModal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    meditationPaused = false;
}

function completeMeditation() {
    const meditationInstruction = document.getElementById('meditationInstruction');
    meditationInstruction.textContent = '✓ Meditation complete! You did great!';
    setTimeout(() => {
        closeMeditation();
        showNotification('Great job! Keep up with daily meditation!', 'success');
    }, 2000);
}

// ============================
// FAQ Interaction
// ============================
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all open FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked FAQ if it wasn't open
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ============================
// Contact Form
// ============================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
        // In a real scenario, this would send data to a server
        localStorage.setItem('lastContactMessage', JSON.stringify({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toLocaleString()
        }));

        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }, 1500);
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');

    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// ============================
// Notification System
// ============================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================
// Utility Functions
// ============================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================
// Scroll Animations
// ============================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInLeft 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.about-card, .resource-card, .tip-card').forEach(el => {
    observer.observe(el);
});

// ============================
// Dark Mode Toggle (Optional Feature)
// ============================
function initializeDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 999;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(darkModeToggle);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }
}

function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').innerHTML = '☀️';
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.getElementById('darkModeToggle').innerHTML = '🌙';
    localStorage.setItem('darkMode', 'disabled');
}

// Initialize dark mode button
initializeDarkMode();

// ============================
// Smooth Scroll for Navigation Links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================
// Page Load Animation
// ============================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-out';
setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// ============================
// Add CSS for Animations
// ============================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    /* Dark Mode Styles */
    body.dark-mode {
        background-color: #1a1a2e;
        color: #e0e0e0;
    }

    body.dark-mode section {
        background-color: #16213e !important;
    }

    body.dark-mode .about-card,
    body.dark-mode .resource-card,
    body.dark-mode .meditation-card,
    body.dark-mode .tip-card,
    body.dark-mode .crisis-card {
        background-color: #0f3460 !important;
        color: #e0e0e0;
    }

    body.dark-mode .navbar {
        background-color: #0f3460 !important;
    }

    body.dark-mode .footer {
        background-color: #0a1929 !important;
    }

    body.dark-mode .modal-content {
        background-color: #0f3460 !important;
        color: #e0e0e0;
    }

    body.dark-mode .mood-selection,
    body.dark-mode .mood-details,
    body.dark-mode .mood-history {
        background-color: #0f3460 !important;
    }

    body.dark-mode .mood-btn {
        background-color: #16213e !important;
        color: #e0e0e0;
    }

    body.dark-mode .mood-entry {
        background-color: #16213e !important;
        color: #e0e0e0;
    }
`;
document.head.appendChild(style);

// ============================
// Responsive Mobile Navigation
// ============================
const mobileMenuHandler = () => {
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
    }
};

window.addEventListener('resize', mobileMenuHandler);
