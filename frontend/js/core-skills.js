// Core Skills Page - Tab Switching, Progress Tracking, Calendar Activity, Time Tracking

const STORAGE_KEY = 'authlessx_core_skills_progress';
const ACTIVITY_KEY = 'authlessx_daily_activity';
const TIME_KEY = 'authlessx_problem_time';

// Calendar state
let currentCalendarDate = new Date();

// Load saved progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Activity tracking functions
function loadActivity() {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveActivity(activity) {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
}

function markTodayActive() {
    const activity = loadActivity();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!activity[today]) {
        activity[today] = {
            problemsSolved: 0,
            timestamp: Date.now()
        };
    }
    activity[today].problemsSolved++;
    activity[today].lastSolved = Date.now();
    
    saveActivity(activity);
    updateCalendar();
    updateStreaks();
    updateWeeklyStats();
}

// Time tracking functions
function loadProblemTimes() {
    const saved = localStorage.getItem(TIME_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveProblemTime(problemTitle, timeSpent) {
    const times = loadProblemTimes();
    if (!times[problemTitle]) {
        times[problemTitle] = [];
    }
    times[problemTitle].push({
        time: timeSpent,
        date: new Date().toISOString()
    });
    localStorage.setItem(TIME_KEY, JSON.stringify(times));
}

// Timer for tracking problem solve time
let problemStartTimes = {};

function startProblemTimer(problemTitle) {
    problemStartTimes[problemTitle] = Date.now();
}

function endProblemTimer(problemTitle) {
    if (problemStartTimes[problemTitle]) {
        const timeSpent = Date.now() - problemStartTimes[problemTitle];
        saveProblemTime(problemTitle, timeSpent);
        delete problemStartTimes[problemTitle];
        return timeSpent;
    }
    return 0;
}

// Update circular progress indicator
function updateCircularProgress(solved, total) {
    const percentage = (solved / total) * 100;
    const circumference = 2 * Math.PI * 52; // radius = 52
    const offset = circumference - (percentage / 100) * circumference;
    
    const circle = document.getElementById('progressCircle');
    const solvedCount = document.getElementById('solvedCount');
    
    if (circle) {
        circle.style.strokeDashoffset = offset;
        
        // Update stroke color based on progress
        if (percentage === 0) {
            circle.style.stroke = '#fbbf24'; // yellow for 0%
        } else if (percentage < 50) {
            circle.style.stroke = '#fbbf24'; // yellow
        } else if (percentage < 100) {
            circle.style.stroke = '#22c55e'; // green
        } else {
            circle.style.stroke = '#22c55e'; // green
        }
    }
    
    if (solvedCount) {
        solvedCount.textContent = solved;
    }
}

// Initialize checkboxes from saved state
function initializeCheckboxes() {
    const progress = loadProgress();
    const checkboxes = document.querySelectorAll('.problem-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        const problemTitle = checkbox.parentElement.nextElementSibling.textContent.trim();
        const key = `problem_${index}_${problemTitle}`;
        
        if (progress[key]) {
            checkbox.checked = true;
            checkbox.parentElement.parentElement.classList.add('solved');
        }
        
        // Add event listener for checkbox changes
        checkbox.addEventListener('change', function() {
            const row = this.parentElement.parentElement;
            
            if (this.checked) {
                // Problem solved - mark activity and stop timer
                row.classList.add('solved');
                progress[key] = true;
                
                // End timer and get time spent
                const timeSpent = endProblemTimer(problemTitle);
                
                // Mark today as active
                markTodayActive();
                
                // Show time spent notification (if timer was running)
                if (timeSpent > 0) {
                    showTimeNotification(problemTitle, timeSpent);
                }
                
                // Update time stats display
                updateTimeStats();
            } else {
                // Problem unchecked
                row.classList.remove('solved');
                delete progress[key];
                
                // Stop timer if running
                delete problemStartTimes[problemTitle];
            }
            
            saveProgress(progress);
            updateProgressStats();
        });
        
        // Add click listener on problem title to start timer
        const titleElement = checkbox.parentElement.nextElementSibling;
        titleElement.addEventListener('click', function() {
            if (!checkbox.checked) {
                startProblemTimer(problemTitle);
                titleElement.style.color = 'var(--primary)';
                titleElement.setAttribute('title', 'Timer started! Solve and check the box.');
            }
        });
    });
    
    updateProgressStats();
    updateCalendar();
    updateStreaks();
}

// Show time notification
function showTimeNotification(problemTitle, timeSpent) {
    const minutes = Math.floor(timeSpent / 60000);
    const seconds = Math.floor((timeSpent % 60000) / 1000);
    
    const notification = document.createElement('div');
    notification.className = 'time-notification';
    notification.innerHTML = `
        ✅ Solved in ${minutes}m ${seconds}s
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render calendar for specific month/year
function renderCalendar(date = currentCalendarDate) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const calendarHeader = document.querySelector('.calendar-header h3');
    if (calendarHeader) {
        calendarHeader.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Update day number (current day of month for today's date)
    const dayNumberEl = document.querySelector('.day-number');
    if (dayNumberEl) {
        const currentDay = today.getDate();
        dayNumberEl.textContent = currentDay;
    }
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get calendar grid container
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing days (except headers)
    const existingDays = calendarGrid.querySelectorAll('.calendar-day');
    existingDays.forEach(day => day.remove());
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const activity = loadActivity();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Check if this is today
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (dateStr === todayStr) {
            dayEl.classList.add('today');
        }
        
        // Check for activity
        if (activity[dateStr]) {
            const problemCount = activity[dateStr].problemsSolved;
            dayEl.classList.add('has-activity');
            
            if (problemCount >= 3) {
                dayEl.classList.add('high-activity');
            }
            
            dayEl.setAttribute('title', `${problemCount} problem${problemCount > 1 ? 's' : ''} solved`);
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

// Update calendar with activity (backward compatibility)
function updateCalendar() {
    renderCalendar(currentCalendarDate);
}

// Initialize calendar navigation
function initializeCalendarNavigation() {
    const navBtns = document.querySelectorAll('.calendar-header .nav-btn');
    
    if (navBtns.length >= 2) {
        // Previous month button
        navBtns[0].addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar(currentCalendarDate);
        });
        
        // Next month button
        navBtns[1].addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar(currentCalendarDate);
        });
    }
}

// Update real-time clock
function updateClock() {
    const now = new Date();
    
    // Get current time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Format time in 12-hour or 24-hour format
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timeRemainingEl = document.querySelector('.time-remaining');
    if (timeRemainingEl) {
        timeRemainingEl.textContent = timeStr;
    }
}

// Start real-time clock updates
function startClock() {
    updateClock(); // Initial update
    setInterval(updateClock, 1000); // Update every second
}

// Calculate and update streaks
function updateStreaks() {
    const activity = loadActivity();
    const dates = Object.keys(activity).sort();
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate current streak (working backwards from today)
    let checkDate = new Date(today);
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activity[dateStr]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    // Calculate best streak
    if (dates.length > 0) {
        tempStreak = 1;
        bestStreak = 1;
        
        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }
    }
    
    // Update UI
    const streakElements = document.querySelectorAll('.streak-value');
    if (streakElements.length >= 2) {
        streakElements[0].innerHTML = `${currentStreak} <span class="streak-label">days</span>`;
        streakElements[1].innerHTML = `${bestStreak} <span class="streak-label">days</span>`;
    }
    
    // Update streak icons based on streak count
    const streakIcons = document.querySelectorAll('.streak-icon');
    if (streakIcons.length >= 2) {
        // Current streak icon
        if (currentStreak === 0) {
            streakIcons[0].textContent = '⚪';
        } else if (currentStreak < 7) {
            streakIcons[0].textContent = '🔥';
        } else if (currentStreak < 30) {
            streakIcons[0].textContent = '🔥🔥';
        } else {
            streakIcons[0].textContent = '🔥🔥🔥';
        }
        
        // Best streak icon
        if (bestStreak < 7) {
            streakIcons[1].textContent = '🏆';
        } else if (bestStreak < 30) {
            streakIcons[1].textContent = '🏆✨';
        } else {
            streakIcons[1].textContent = '🏆✨💎';
        }
    }
}

// Get time statistics
function getTimeStats() {
    const times = loadProblemTimes();
    const stats = {
        totalTime: 0,
        problemCount: 0,
        averageTime: 0,
        fastestTime: Infinity,
        slowestTime: 0
    };
    
    Object.values(times).forEach(problemTimes => {
        problemTimes.forEach(entry => {
            stats.totalTime += entry.time;
            stats.problemCount++;
            stats.fastestTime = Math.min(stats.fastestTime, entry.time);
            stats.slowestTime = Math.max(stats.slowestTime, entry.time);
        });
    });
    
    if (stats.problemCount > 0) {
        stats.averageTime = stats.totalTime / stats.problemCount;
    }
    
    if (stats.fastestTime === Infinity) {
        stats.fastestTime = 0;
    }
    
    return stats;
}

// Format time for display
function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

// Update time stats display
function updateTimeStats() {
    const stats = getTimeStats();
    
    const avgTimeEl = document.getElementById('avgTime');
    const fastestTimeEl = document.getElementById('fastestTime');
    const totalProblemsEl = document.getElementById('totalProblems');
    
    if (avgTimeEl) {
        avgTimeEl.textContent = stats.problemCount > 0 ? formatTime(stats.averageTime) : '--';
    }
    
    if (fastestTimeEl) {
        fastestTimeEl.textContent = stats.fastestTime > 0 ? formatTime(stats.fastestTime) : '--';
    }
    
    if (totalProblemsEl) {
        totalProblemsEl.textContent = stats.problemCount;
    }
}

// Update weekly progress
function updateWeeklyStats() {
    const activity = loadActivity();
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate problems solved each day this week
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    let maxProblems = 1; // For scaling bars
    
    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(startOfWeek);
        checkDate.setDate(startOfWeek.getDate() + i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (activity[dateStr]) {
            const count = activity[dateStr].problemsSolved;
            weekData[i] = count;
            maxProblems = Math.max(maxProblems, count);
        }
    }
    
    // Update UI
    const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    dayIds.forEach((dayId, index) => {
        const countEl = document.getElementById(`${dayId}-count`);
        const barEl = document.querySelector(`.weekly-bar[data-day="${index === 6 ? 0 : index + 1}"]`);
        
        if (countEl && barEl) {
            const count = weekData[index];
            countEl.textContent = count;
            
            if (count > 0) {
                const height = (count / maxProblems) * 60; // Max 60px height
                barEl.style.height = `${height}px`;
                barEl.classList.add('has-data');
            } else {
                barEl.style.height = '4px';
                barEl.classList.remove('has-data');
            }
            
            // Highlight today
            const checkDate = new Date(startOfWeek);
            checkDate.setDate(startOfWeek.getDate() + index);
            if (checkDate.toDateString() === today.toDateString()) {
                barEl.classList.add('today-bar');
            }
        }
    });
    
    // Update message
    const weeklyMessage = document.getElementById('weeklyMessage');
    if (weeklyMessage) {
        const totalProblems = weekData.reduce((a, b) => a + b, 0);
        const activeDays = weekData.filter(x => x > 0).length;
        
        if (totalProblems === 0) {
            weeklyMessage.textContent = 'Start your week strong! 💪';
        } else if (activeDays === 7) {
            weeklyMessage.textContent = '🔥 Perfect week! 7/7 days!';
        } else if (totalProblems >= 10) {
            weeklyMessage.textContent = `🎯 ${totalProblems} problems this week!`;
        } else {
            weeklyMessage.textContent = `${activeDays}/7 days active this week`;
        }
    }
}
function updateProgressStats() {
    const allRows = document.querySelectorAll('.problems-table tbody tr');
    let easyTotal = 0, easySolved = 0;
    let medTotal = 0, medSolved = 0;
    let hardTotal = 0, hardSolved = 0;
    
    allRows.forEach(row => {
        const difficulty = row.getAttribute('data-difficulty');
        const checkbox = row.querySelector('.problem-checkbox');
        const isSolved = checkbox.checked;
        
        if (difficulty === 'easy') {
            easyTotal++;
            if (isSolved) easySolved++;
        } else if (difficulty === 'medium') {
            medTotal++;
            if (isSolved) medSolved++;
        } else if (difficulty === 'hard') {
            hardTotal++;
            if (isSolved) hardSolved++;
        }
    });
    
    const totalSolved = easySolved + medSolved + hardSolved;
    const totalProblems = easyTotal + medTotal + hardTotal;
    
    // Update DOM
    const easyProgress = document.getElementById('easyProgress');
    const medProgress = document.getElementById('medProgress');
    const hardProgress = document.getElementById('hardProgress');
    const totalCount = document.getElementById('totalCount');
    
    if (easyProgress) easyProgress.textContent = `${easySolved}/${easyTotal}`;
    if (medProgress) medProgress.textContent = `${medSolved}/${medTotal}`;
    if (hardProgress) hardProgress.textContent = `${hardSolved}/${hardTotal}`;
    if (totalCount) totalCount.textContent = `/${totalProblems}`;
    
    // Update circular progress
    updateCircularProgress(totalSolved, totalProblems);
}

// Category filtering functionality
function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const problemSections = document.querySelectorAll('.problem-section');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide sections based on category
            if (category === 'all') {
                problemSections.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                problemSections.forEach(section => {
                    const sectionCategory = section.getAttribute('data-category');
                    if (sectionCategory === category) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('problemSearch');
    const problemRows = document.querySelectorAll('.problems-table tbody tr');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            problemRows.forEach(row => {
                const problemTitle = row.querySelector('.problem-title').textContent.toLowerCase();
                if (problemTitle.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Auth check for Sign In/Sign Up buttons
async function checkAuth() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const navRight = document.querySelector('.nav-right');
            navRight.innerHTML = `
                <span class="user-email">${data.email}</span>
                <button class="btn-signout" onclick="signOut()">Sign Out</button>
            `;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

// Sign out function
function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('publicKey');
    localStorage.removeItem('privateKey');
    window.location.href = 'home.html';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckboxes();
    initializeCategoryFilters();
    initializeSearch();
    initializeCalendarNavigation();
    renderCalendar();
    updateStreaks();
    updateTimeStats();
    updateWeeklyStats();
    startClock();
    checkAuth();
    initializeClickableProblems();
});

// Initialize clickable problems - navigate to coding interface
function initializeClickableProblems() {
    const clickableProblems = document.querySelectorAll('.clickable-problem');
    
    clickableProblems.forEach(row => {
        // Make the problem title clickable
        const titleCell = row.querySelector('.problem-title');
        if (titleCell) {
            titleCell.style.cursor = 'pointer';
            titleCell.style.textDecoration = 'none';
            
            titleCell.addEventListener('mouseenter', function() {
                this.style.textDecoration = 'underline';
            });
            
            titleCell.addEventListener('mouseleave', function() {
                this.style.textDecoration = 'none';
            });
            
            titleCell.addEventListener('click', function(e) {
                const category = row.getAttribute('data-category') || 'DSA';
                const problemId = row.getAttribute('data-problem-id');
                const problemTitle = titleCell.textContent.trim();
                
                // Navigate to coding question page with category, problem ID, and title
                window.location.href = `coding-question.html?category=${category}&problemId=${problemId}&title=${encodeURIComponent(problemTitle)}`;
            });
        }
    });
}
