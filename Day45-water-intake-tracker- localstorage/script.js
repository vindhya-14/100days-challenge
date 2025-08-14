// Water Tracker JavaScript with localStorage and Cookies
class WaterTracker {
    constructor() {
        this.goal = 8;
        this.storageKey = 'waterTrackerData';
        this.count = this.loadCount();
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.checkDailyReset();
        this.loadSettings();
    }

    initializeElements() {
        this.countElement = document.getElementById('count');
        this.percentageElement = document.getElementById('percentage');
        this.progressBar = document.getElementById('progress-bar');
        this.messageElement = document.getElementById('message');
        this.waterDrops = document.querySelectorAll('.water-drop');
        this.addButton = document.getElementById('add');
        this.removeButton = document.getElementById('remove');
        this.resetButton = document.getElementById('reset');
        this.container = document.querySelector('.container');
    }

    bindEvents() {
        this.addButton.addEventListener('click', () => this.addGlass());
        this.removeButton.addEventListener('click', () => this.removeGlass());
        this.resetButton.addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.addGlass();
            } else if (e.key === '-') {
                e.preventDefault();
                this.removeGlass();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.reset();
            }
        });

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveCount();
            this.saveSettings();
        });

        // Save data periodically
        setInterval(() => {
            this.saveCount();
        }, 30000); // Save every 30 seconds

        // Welcome message on first load
        if (this.count === 0 && !this.getFromStorage('welcomed')) {
            setTimeout(() => {
                this.showMessage('Welcome! Let\'s start your hydration journey! 🌟', 'info');
                this.setInStorage('welcomed', 'true');
            }, 1000);
        }
    }

    // ===== STORAGE METHODS =====
    
    // Check if localStorage is available
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Cookie helper methods
    setCookie(name, value, days = 30) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
        } catch (e) {
            console.warn('Could not set cookie:', e);
        }
    }

    getCookie(name) {
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        } catch (e) {
            console.warn('Could not get cookie:', e);
            return null;
        }
    }

    deleteCookie(name) {
        try {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        } catch (e) {
            console.warn('Could not delete cookie:', e);
        }
    }

    // Unified storage methods with fallback
    setInStorage(key, value) {
        const data = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        
        // Try localStorage first
        if (this.isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, data);
                return true;
            } catch (e) {
                console.warn('LocalStorage failed, trying cookies:', e);
            }
        }
        
        // Fallback to cookies
        this.setCookie(key, data);
        return true;
    }

    getFromStorage(key) {
        // Try localStorage first
        if (this.isLocalStorageAvailable()) {
            try {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }
            } catch (e) {
                console.warn('LocalStorage read failed, trying cookies:', e);
            }
        }
        
        // Fallback to cookies
        const cookieValue = this.getCookie(key);
        if (cookieValue !== null) {
            try {
                return JSON.parse(cookieValue);
            } catch (e) {
                return cookieValue;
            }
        }
        
        return null;
    }

    removeFromStorage(key) {
        // Remove from localStorage
        if (this.isLocalStorageAvailable()) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Could not remove from localStorage:', e);
            }
        }
        
        // Remove from cookies
        this.deleteCookie(key);
    }

    // ===== DATA PERSISTENCE METHODS =====

    loadCount() {
        try {
            const savedData = this.getFromStorage(this.storageKey);
            if (savedData && typeof savedData === 'object') {
                return parseInt(savedData.count || '0');
            }
            return 0;
        } catch (e) {
            console.warn('Could not load count:', e);
            return 0;
        }
    }

    saveCount() {
        try {
            const existingData = this.getFromStorage(this.storageKey) || {};
            const data = {
                ...existingData,
                count: this.count,
                lastUpdate: new Date().toISOString(),
                date: new Date().toDateString(),
                goal: this.goal
            };
            
            this.setInStorage(this.storageKey, data);
            
            // Also save backup with timestamp
            const backupKey = `${this.storageKey}_backup`;
            this.setInStorage(backupKey, data);
            
            return true;
        } catch (e) {
            console.warn('Could not save data:', e);
            return false;
        }
    }

    loadSettings() {
        try {
            const savedData = this.getFromStorage(this.storageKey);
            if (savedData && typeof savedData === 'object') {
                // Load custom goal if set
                if (savedData.goal && savedData.goal > 0) {
                    this.goal = parseInt(savedData.goal);
                    const goalText = document.querySelector('.goal-text');
                    if (goalText) {
                        goalText.textContent = `Daily Goal: ${this.goal} Glasses`;
                    }
                }
                
                // Load theme preference
                if (savedData.theme) {
                    this.applyTheme(savedData.theme);
                }
                
                // Load other settings
                if (savedData.notifications !== undefined) {
                    this.notificationsEnabled = savedData.notifications;
                }
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    saveSettings() {
        try {
            const existingData = this.getFromStorage(this.storageKey) || {};
            const data = {
                ...existingData,
                goal: this.goal,
                theme: document.body.getAttribute('data-theme') || 'light',
                notifications: this.notificationsEnabled || false,
                lastSettingsUpdate: new Date().toISOString()
            };
            
            this.setInStorage(this.storageKey, data);
            return true;
        } catch (e) {
            console.warn('Could not save settings:', e);
            return false;
        }
    }

    // ===== DAILY RESET AND DATA MANAGEMENT =====

    checkDailyReset() {
        try {
            const savedData = this.getFromStorage(this.storageKey);
            if (savedData && savedData.date) {
                const lastDate = new Date(savedData.date).toDateString();
                const today = new Date().toDateString();
                
                if (lastDate !== today) {
                    // Save yesterday's data to history
                    this.saveToHistory(savedData);
                    
                    // Reset count for new day
                    this.count = 0;
                    this.saveCount();
                    this.showMessage('New day, fresh start! Let\'s crush today\'s hydration goals! 🌅', 'info');
                }
            }
        } catch (e) {
            console.warn('Could not check daily reset:', e);
        }
    }

    saveToHistory(dayData) {
        try {
            const historyKey = 'waterTrackerHistory';
            const history = this.getFromStorage(historyKey) || [];
            
            // Add current day to history
            history.push({
                date: dayData.date,
                count: dayData.count,
                goal: dayData.goal || this.goal,
                percentage: Math.round((dayData.count / (dayData.goal || this.goal)) * 100),
                completed: dayData.count >= (dayData.goal || this.goal)
            });
            
            // Keep only last 30 days
            if (history.length > 30) {
                history.splice(0, history.length - 30);
            }
            
            this.setInStorage(historyKey, history);
        } catch (e) {
            console.warn('Could not save to history:', e);
        }
    }

    getHistory() {
        try {
            return this.getFromStorage('waterTrackerHistory') || [];
        } catch (e) {
            console.warn('Could not load history:', e);
            return [];
        }
    }

    // ===== CORE FUNCTIONALITY =====

    addGlass() {
        if (this.count < this.goal) {
            this.count++;
            this.saveCount();
            this.updateDisplay();
            this.animateAdd();
            this.showMessage(this.getEncouragementMessage(), 'info');
            
            if (this.count === this.goal) {
                setTimeout(() => this.celebrate(), 300);
            } else if (this.count === Math.floor(this.goal / 2)) {
                this.showMessage('Halfway there! You\'re doing amazing! 🚀', 'success');
            }
        } else {
            this.count++; // Allow going over goal
            this.saveCount();
            this.updateDisplay();
            this.showMessage('Extra hydration! You\'re going above and beyond! 🌟', 'success');
            this.pulseContainer();
        }
    }

    removeGlass() {
        if (this.count > 0) {
            this.count--;
            this.saveCount();
            this.updateDisplay();
            this.animateRemove();
            
            if (this.count === 0) {
                this.showMessage('Back to the beginning! Let\'s start hydrating! 💪', 'warning');
            } else {
                const remaining = Math.max(0, this.goal - this.count);
                if (remaining > 0) {
                    this.showMessage(`${remaining} glasses to go! Keep it up!`, 'warning');
                } else {
                    this.showMessage('Still above your goal! Great job! 🎯', 'info');
                }
            }
        } else {
            this.showMessage('No glasses to remove! Start adding some water! 💧', 'info');
            this.shakeContainer();
        }
    }

    reset() {
        const oldCount = this.count;
        
        // Confirm reset if count is high
        if (oldCount > 4) {
            if (!confirm(`Are you sure you want to reset? You'll lose your progress of ${oldCount} glasses.`)) {
                return;
            }
        }
        
        this.count = 0;
        this.saveCount();
        this.updateDisplay();
        
        if (oldCount > 0) {
            this.showMessage('Fresh start! Ready to crush your hydration goals! 🎯', 'info');
        } else {
            this.showMessage('Already at zero! Time to start hydrating! 💧', 'info');
        }
        
        this.animateReset();
    }

    // ===== DISPLAY AND UI METHODS =====

    updateDisplay() {
        // Update counter with animation
        this.animateNumber(this.countElement, this.count);
        
        // Update percentage
        const percentage = Math.round((this.count / this.goal) * 100);
        this.animateNumber(this.percentageElement, percentage, '%');
        
        // Update progress bar with smooth animation
        this.progressBar.style.width = `${Math.min(percentage, 100)}%`;
        
        // Update water drops with stagger animation
        this.updateWaterDrops();
        
        // Update progress text
        this.updateProgressText();
        
        // Update button states
        this.updateButtonStates();
    }

    animateNumber(element, value, suffix = '') {
        const current = parseInt(element.textContent) || 0;
        const increment = value > current ? 1 : -1;
        const steps = Math.abs(value - current);
        
        if (steps === 0) return;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const newValue = current + (increment * step);
            element.textContent = newValue + suffix;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = value + suffix;
            }
        }, 50);
    }

    updateWaterDrops() {
        this.waterDrops.forEach((drop, index) => {
            setTimeout(() => {
                if (index < this.count) {
                    drop.classList.add('filled');
                } else {
                    drop.classList.remove('filled');
                }
            }, index * 50);
        });
    }

    updateProgressText() {
        const progressText = document.querySelector('.progress-text');
        let message = '';
        
        if (this.count === 0) {
            message = 'Start your hydration journey! 🌟';
        } else if (this.count === 1) {
            message = 'Great start! First glass down! 💧';
        } else if (this.count < this.goal / 2) {
            message = 'Building momentum! Keep it up! 💪';
        } else if (this.count === Math.floor(this.goal / 2)) {
            message = 'Halfway there! You\'re crushing it! 🚀';
        } else if (this.count < this.goal) {
            message = `Almost there! Just ${this.goal - this.count} more! 🎯`;
        } else if (this.count === this.goal) {
            message = 'Goal achieved! You\'re a hydration hero! 🏆';
        } else {
            message = `Amazing! ${this.count - this.goal} glasses over your goal! 🌟`;
        }
        
        progressText.textContent = message;
    }

    updateButtonStates() {
        // Disable remove button if count is 0
        this.removeButton.disabled = this.count === 0;
        
        // Change add button text based on progress
        if (this.count >= this.goal) {
            this.addButton.textContent = '+ Extra Glass';
        } else {
            this.addButton.textContent = '+ Add Glass';
        }
    }

    getEncouragementMessage() {
        const messages = [
            'Excellent! Your body is loving this! 💧',
            'Way to go! Hydration hero in action! 🦸‍♀️',
            'Perfect! You\'re glowing with health! ✨',
            'Amazing! Ride that hydration wave! 🌊',
            'Fantastic! Your cells are dancing! 💃',
            'Wonderful! You\'re on fire! 🔥',
            'Outstanding! Keep that momentum! 🏁',
            'Incredible! Your skin will thank you! 💖',
            'Superb! You\'re absolutely crushing this! 💪',
            'Brilliant! Keep that flow going! ⚡'
        ];
        
        const index = (this.count - 1) % messages.length;
        return messages[index];
    }

    showMessage(text, type = 'info', duration = 4000) {
        this.messageElement.textContent = text;
        this.messageElement.className = type;
        
        // Clear existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Set new timeout
        this.messageTimeout = setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = '';
        }, duration);
    }

    // ===== ANIMATION METHODS =====

    animateAdd() {
        this.addButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.addButton.style.transform = 'scale(1)';
        }, 100);
    }

    animateRemove() {
        this.removeButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.removeButton.style.transform = 'scale(1)';
        }, 100);
    }

    animateReset() {
        this.resetButton.style.transform = 'rotate(360deg) scale(0.9)';
        setTimeout(() => {
            this.resetButton.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    }

    pulseContainer() {
        this.container.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.container.style.transform = 'scale(1)';
        }, 200);
    }

    shakeContainer() {
        this.container.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.container.style.animation = '';
        }, 500);
    }

    celebrate() {
        // Add celebration class
        this.container.classList.add('celebrating');
        
        // Show celebration message
        this.showMessage('🎉 CONGRATULATIONS! Daily hydration goal achieved! You\'re amazing! 🎉', 'success', 6000);
        
        // Create floating celebration elements
        this.createCelebrationElements();
        
        // Add confetti effect
        this.createConfetti();
        
        // Save achievement
        this.saveAchievement();
        
        // Remove celebration class
        setTimeout(() => {
            this.container.classList.remove('celebrating');
        }, 600);
        
        // Play celebration sound
        this.playCelebrationSound();
    }

    saveAchievement() {
        try {
            const achievementsKey = 'waterTrackerAchievements';
            const achievements = this.getFromStorage(achievementsKey) || [];
            
            achievements.push({
                date: new Date().toDateString(),
                goal: this.goal,
                timestamp: new Date().toISOString()
            });
            
            this.setInStorage(achievementsKey, achievements);
        } catch (e) {
            console.warn('Could not save achievement:', e);
        }
    }

    createCelebrationElements() {
        const celebrationEmojis = ['💧', '🎉', '✨', '🌟', '💙', '🏆', '🎊', '💎'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                emoji.style.cssText = `
                    position: fixed;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: celebrationFloat 3s ease-out forwards;
                `;
                
                document.body.appendChild(emoji);
                
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    createConfetti() {
        const colors = ['#4299e1', '#3182ce', '#2b77cb', '#90cdf4', '#bee3f8'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -10px;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 4000);
            }, i * 50);
        }
    }

    playCelebrationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio celebration not available');
        }
    }

    // ===== UTILITY METHODS =====

    exportData() {
        try {
            const data = {
                current: this.getFromStorage(this.storageKey),
                history: this.getHistory(),
                achievements: this.getFromStorage('waterTrackerAchievements'),
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `water-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showMessage('Data exported successfully! 📊', 'success');
        } catch (e) {
            this.showMessage('Failed to export data. Please try again.', 'warning');
            console.error('Export failed:', e);
        }
    }

    importData(fileContent) {
        try {
            const data = JSON.parse(fileContent);
            
            if (data.current) {
                this.setInStorage(this.storageKey, data.current);
                this.count = data.current.count || 0;
            }
            
            if (data.history) {
                this.setInStorage('waterTrackerHistory', data.history);
            }
            
            if (data.achievements) {
                this.setInStorage('waterTrackerAchievements', data.achievements);
            }
            
            this.updateDisplay();
            this.showMessage('Data imported successfully! 🎉', 'success');
        } catch (e) {
            this.showMessage('Failed to import data. Please check the file format.', 'warning');
            console.error('Import failed:', e);
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.removeFromStorage(this.storageKey);
            this.removeFromStorage('waterTrackerHistory');
            this.removeFromStorage('waterTrackerAchievements');
            this.removeFromStorage('welcomed');
            
            this.count = 0;
            this.updateDisplay();
            this.showMessage('All data cleared. Starting fresh! 🌟', 'info');
        }
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.saveSettings();
    }
}

// Add CSS animations for celebration effects
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrationFloat {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-200px) rotate(360deg) scale(0.5);
        }
    }
    
    @keyframes confettiFall {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the water tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.waterTracker = new WaterTracker();
});

// Add global functions for debugging/testing
window.debugWaterTracker = {
    exportData: () => window.waterTracker.exportData(),
    clearData: () => window.waterTracker.clearAllData(),
    getHistory: () => window.waterTracker.getHistory(),
    setCount: (count) => {
        window.waterTracker.count = count;
        window.waterTracker.saveCount();
        window.waterTracker.updateDisplay();
    }
};