/**
 * Mental Awareness Hub - Vanilla JavaScript
 * World-class, accessible, and performant
 */

// ===================================
// Daily Affirmations Database
// ===================================

const AFFIRMATIONS = [
    "I am worthy of love and compassion.",
    "My mental health matters and deserves care.",
    "I choose to be kind to myself today.",
    "I am capable of overcoming challenges.",
    "My feelings are valid and important.",
    "I deserve peace and happiness.",
    "I am growing and learning every day.",
    "I choose to focus on what I can control.",
    "My strength comes from my willingness to heal.",
    "I am enough, exactly as I am.",
    "I give myself permission to rest.",
    "I am building a life that feels good.",
    "My journey is unique and valuable.",
    "I choose progress over perfection.",
    "I am deserving of my own compassion.",
    "I am creating positive change in my life.",
    "My struggles have made me stronger.",
    "I choose to believe in my potential.",
    "I am grateful for this moment.",
    "I am worthy of good things in life."
];

// ===================================
// Breathing Exercise Configuration
// ===================================

const BREATHING_CONFIG = {
    phases: [
        { name: 'Breathe In', duration: 4000 },
        { name: 'Hold', duration: 4000 },
        { name: 'Breathe Out', duration: 4000 },
        { name: 'Hold', duration: 4000 }
    ],
    cycleLength: 16000
};

// ===================================
// DOM Elements
// ===================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const crisisButton = document.querySelector('.crisis-button');
const crisisModal = document.getElementById('crisisModal');
const modalClose = document.querySelector('.modal-close');
const breatheCircle = document.getElementById('breatheCircle');
const toggleBreathe = document.getElementById('toggleBreathe');
const breatheText = document.getElementById('breatheText');
const affirmationText = document.getElementById('affirmationText');
const newAffirmationBtn = document.getElementById('newAffirmation');
const moodOptions = document.querySelectorAll('.mood-option');
const moodFeedback = document.getElementById('moodFeedback');

// ===================================
// State Management
// ===================================

let isBreathing = false;
let breathingIntervalId = null;
let currentAffirmationIndex = 0;
let currentMood = null;

// ===================================
// Mood Tracker
// ===================================

function initializeMoodTracker() {
    moodOptions.forEach(option => {
        option.addEventListener('click', handleMoodSelection);
    });
}

function handleMoodSelection(event) {
    const selectedOption = event.currentTarget;
    const moodValue = selectedOption.dataset.mood;
    const moodLabels = ['', 'Very Sad', 'Sad', 'Neutral', 'Good', 'Very Happy'];
    
    // Remove active class from all options
    moodOptions.forEach(option => {
        option.querySelector('input').checked = false;
    });
    
    // Set selected option
    selectedOption.querySelector('input').checked = true;
    currentMood = moodValue;
    
    // Show feedback
    displayMoodFeedback(moodLabels[moodValue]);
    
    // Store in localStorage for persistence
    localStorage.setItem('lastMood', JSON.stringify({
        mood: moodValue,
        timestamp: new Date().toISOString()
    }));
}

function displayMoodFeedback(moodLabel) {
    const feedbackMessages = {
        1: 'I see you\'re having a tough time. That\'s okay. Consider taking a moment to breathe.',
        2: 'It\'s alright to feel down sometimes. You\'re doing your best.',
        3: 'You\'re present and aware. That\'s a good first step.',
        4: 'I\'m glad you\'re feeling good. Cherish this moment.',
        5: 'I\'m happy for you! Share this joy with others.'
    };
    
    moodFeedback.textContent = feedbackMessages[currentMood];
    moodFeedback.style.animation = 'none';
    setTimeout(() => {
        moodFeedback.style.animation = 'fadeIn 0.5s ease-in-out';
    }, 10);
}

// ===================================
// Breathing Exercise
// ===================================

function initializeBreathing() {
    toggleBreathe.addEventListener('click', toggleBreathingExercise);
}

function toggleBreathingExercise() {
    if (isBreathing) {
        stopBreathing();
    } else {
        startBreathing();
    }
}

function startBreathing() {
    isBreathing = true;
    toggleBreathe.textContent = 'Stop Breathing';
    toggleBreathe.setAttribute('aria-pressed', 'true');
    breatheCircle.classList.add('active');
    
    let phaseIndex = 0;
    
    function updatePhase() {
        const phase = BREATHING_CONFIG.phases[phaseIndex];
        breatheText.textContent = phase.name;
        
        // Update aria-label for accessibility
        const currentSecond = (phase.duration / 1000).toFixed(0);
        breatheCircle.setAttribute('aria-label', `${phase.name} - ${currentSecond} seconds`);
        
        phaseIndex = (phaseIndex + 1) % BREATHING_CONFIG.phases.length;
    }
    
    updatePhase();
    breathingIntervalId = setInterval(updatePhase, BREATHING_CONFIG.cycleLength / BREATHING_CONFIG.phases.length);
}

function stopBreathing() {
    isBreathing = false;
    toggleBreathe.textContent = 'Start Breathing';
    toggleBreathe.setAttribute('aria-pressed', 'false');
    breatheCircle.classList.remove('active');
    clearInterval(breathingIntervalId);
    
    breatheText.textContent = 'Breathe In';
    breatheCircle.setAttribute('aria-label', 'Breathing animation circle');
}

// ===================================
// Daily Affirmations
// ===================================

function initializeAffirmations() {
    newAffirmationBtn.addEventListener('click', generateNewAffirmation);
    
    // Load random affirmation on page load
    generateNewAffirmation();
}

function generateNewAffirmation() {
    // Get a random affirmation different from the current one
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    } while (randomIndex === currentAffirmationIndex && AFFIRMATIONS.length > 1);
    
    currentAffirmationIndex = randomIndex;
    const affirmation = AFFIRMATIONS[randomIndex];
    
    // Fade out, change text, fade in
    affirmationText.style.opacity = '0';
    
    setTimeout(() => {
        affirmationText.textContent = `"${affirmation}"`;
        affirmationText.setAttribute('aria-live', 'polite');
        affirmationText.style.opacity = '1';
    }, 150);
    
    // Store in localStorage
    localStorage.setItem('currentAffirmation', affirmation);
}

// ===================================
// Crisis Modal
// ===================================

function initializeCrisisModal() {
    crisisButton.addEventListener('click', openCrisisModal);
    modalClose.addEventListener('click', closeCrisisModal);
    
    // Close modal when clicking outside
    crisisModal.addEventListener('click', (e) => {
        if (e.target === crisisModal) {
            closeCrisisModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && crisisModal.open) {
            closeCrisisModal();
        }
    });
}

function openCrisisModal() {
    crisisModal.showModal();
    crisisButton.setAttribute('aria-pressed', 'true');
}

function closeCrisisModal() {
    crisisModal.close();
    crisisButton.setAttribute('aria-pressed', 'false');
    crisisButton.focus();
}

// ===================================
// Mobile Navigation
// ===================================

function initializeMobileNavigation() {
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

function toggleMenu() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
}

function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
}

// ===================================
// Smooth Scroll
// ===================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Local Storage - Restore State
// ===================================

function restoreUserState() {
    // Restore last mood
    const lastMood = localStorage.getItem('lastMood');
    if (lastMood) {
        try {
            const moodData = JSON.parse(lastMood);
            const moodOption = document.querySelector(`[data-mood="${moodData.mood}"]`);
            if (moodOption) {
                moodOption.click();
            }
        } catch (e) {
            console.error('Error restoring mood:', e);
        }
    }
    
    // Restore last affirmation
    const lastAffirmation = localStorage.getItem('currentAffirmation');
    if (lastAffirmation) {
        affirmationText.textContent = `"${lastAffirmation}"`;
    }
}

// ===================================
// Accessibility - Focus Management
// ===================================

function initializeAccessibility() {
    // Add focus indicators to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-sage)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// ===================================
// Performance - Intersection Observer
// ===================================

function initializeIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
            }
        });
    }, options);
    
    sections.forEach(section => observer.observe(section));
}

// ===================================
// Fade In Animation
// ===================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Initialization
// ===================================

function initializeApp() {
    // Initialize all components
    initializeMoodTracker();
    initializeBreathing();
    initializeAffirmations();
    initializeCrisisModal();
    initializeMobileNavigation();
    initializeSmoothScroll();
    initializeAccessibility();
    initializeIntersectionObserver();
    
    // Restore user state
    restoreUserState();
    
    // Log successful initialization
    console.log('Mental Awareness Hub initialized successfully');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===================================
// Service Worker Registration (Optional)
// ===================================

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, app still works
        });
    });
}
