// ====================================
// 🧪 AUTHLESSX ACTIVITY TRACKING TEST
// ====================================
// Copy and paste this entire file into the browser console 
// while on the Core Skills page (core-skills.html)

console.log('%c🔧 AuthLessX Activity Tracker Test', 'font-size: 20px; color: #ef6c00; font-weight: bold;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #666;');

// Test 1: Add Sample Activity Data
function test_addActivity() {
    console.log('%c📅 Test 1: Adding sample activity data...', 'color: #4caf50; font-weight: bold;');
    
    const activity = {};
    const today = new Date();
    
    // Add activity for last 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Vary problem counts: 1-7 problems
        const problemCount = Math.floor(Math.random() * 6) + 1;
        activity[dateStr] = {
            problemsSolved: problemCount,
            timestamp: date.getTime(),
            lastSolved: date.getTime()
        };
        
        console.log(`  ✓ ${dateStr}: ${problemCount} problems`);
    }
    
    localStorage.setItem('authlessx_daily_activity', JSON.stringify(activity));
    console.log('%c✅ Activity data saved!', 'color: #4caf50;');
    console.log('');
}

// Test 2: Add Sample Time Data
function test_addTimes() {
    console.log('%c⏱️ Test 2: Adding sample time data...', 'color: #2196f3; font-weight: bold;');
    
    const times = {
        "Design Dynamic Array": [
            { time: 245000, date: new Date().toISOString() }, // 4m 5s
            { time: 180000, date: new Date(Date.now() - 86400000).toISOString() }  // 3m (yesterday)
        ],
        "Design Singly Linked List": [
            { time: 420000, date: new Date().toISOString() }, // 7m
            { time: 300000, date: new Date().toISOString() }  // 5m
        ],
        "Design Doubly Linked List": [
            { time: 540000, date: new Date().toISOString() }  // 9m
        ],
        "Design Stack": [
            { time: 120000, date: new Date().toISOString() }  // 2m (fastest)
        ]
    };
    
    localStorage.setItem('authlessx_problem_time', JSON.stringify(times));
    
    Object.entries(times).forEach(([problem, attempts]) => {
        const avgTime = attempts.reduce((sum, a) => sum + a.time, 0) / attempts.length;
        const minutes = Math.floor(avgTime / 60000);
        const seconds = Math.floor((avgTime % 60000) / 1000);
        console.log(`  ✓ ${problem}: ${attempts.length} attempt(s), avg ${minutes}m ${seconds}s`);
    });
    
    console.log('%c✅ Time data saved!', 'color: #4caf50;');
    console.log('');
}

// Test 3: View Current Data
function test_viewData() {
    console.log('%c👀 Test 3: Current localStorage data...', 'color: #ff9800; font-weight: bold;');
    
    const activity = localStorage.getItem('authlessx_daily_activity');
    const times = localStorage.getItem('authlessx_problem_time');
    const progress = localStorage.getItem('authlessx_core_skills_progress');
    
    console.log('📊 Activity Data:', activity ? JSON.parse(activity) : 'No data');
    console.log('⏱️ Time Data:', times ? JSON.parse(times) : 'No data');
    console.log('✅ Progress Data:', progress ? JSON.parse(progress) : 'No data');
    console.log('');
}

// Test 4: Check if update functions exist
function test_checkFunctions() {
    console.log('%c🔍 Test 4: Checking if functions are loaded...', 'color: #9c27b0; font-weight: bold;');
    
    const functions = [
        'updateCalendar',
        'updateStreaks',
        'updateTimeStats',
        'updateWeeklyStats',
        'markTodayActive',
        'startProblemTimer',
        'endProblemTimer'
    ];
    
    functions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log(`  ✅ ${func} - FOUND`);
        } else {
            console.log(`  ❌ ${func} - NOT FOUND`);
        }
    });
    console.log('');
}

// Test 5: Refresh Display
function test_refreshDisplay() {
    console.log('%c🔄 Test 5: Refreshing display...', 'color: #00bcd4; font-weight: bold;');
    
    try {
        if (typeof updateCalendar === 'function') updateCalendar();
        if (typeof updateStreaks === 'function') updateStreaks();
        if (typeof updateTimeStats === 'function') updateTimeStats();
        if (typeof updateWeeklyStats === 'function') updateWeeklyStats();
        
        console.log('%c✅ Display refreshed! Check the page.', 'color: #4caf50;');
    } catch (error) {
        console.error('❌ Error refreshing:', error);
    }
    console.log('');
}

// Test 6: Calculate and Show Expected Results
function test_calculateExpected() {
    console.log('%c📈 Test 6: Expected results...', 'color: #e91e63; font-weight: bold;');
    
    const activity = JSON.parse(localStorage.getItem('authlessx_daily_activity') || '{}');
    const times = JSON.parse(localStorage.getItem('authlessx_problem_time') || '{}');
    
    // Calculate streaks
    const dates = Object.keys(activity).sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
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
    
    // Calculate time stats
    let totalTime = 0;
    let problemCount = 0;
    let fastestTime = Infinity;
    
    Object.values(times).forEach(attempts => {
        attempts.forEach(attempt => {
            totalTime += attempt.time;
            problemCount++;
            fastestTime = Math.min(fastestTime, attempt.time);
        });
    });
    
    const avgTime = problemCount > 0 ? totalTime / problemCount : 0;
    
    console.log(`  📅 Total active days: ${dates.length}`);
    console.log(`  🔥 Current streak: ${currentStreak} days`);
    console.log(`  ⏱️ Average time: ${Math.floor(avgTime / 60000)}m ${Math.floor((avgTime % 60000) / 1000)}s`);
    console.log(`  ⚡ Fastest solve: ${Math.floor(fastestTime / 60000)}m ${Math.floor((fastestTime % 60000) / 1000)}s`);
    console.log(`  ✅ Timed problems: ${problemCount}`);
    console.log('');
}

// Test 7: Clear All Data
function test_clearData() {
    console.log('%c🗑️ Test 7: Clearing all tracking data...', 'color: #f44336; font-weight: bold;');
    
    localStorage.removeItem('authlessx_daily_activity');
    localStorage.removeItem('authlessx_problem_time');
    
    console.log('%c✅ All tracking data cleared!', 'color: #4caf50;');
    console.log('');
}

// ====================================
// 🎮 QUICK COMMANDS
// ====================================
console.log('%c🎮 Available Commands:', 'font-size: 16px; color: #ef6c00; font-weight: bold;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #666;');
console.log('1. %ctest_addActivity()%c     - Add sample activity for last 7 days', 'color: #4caf50; font-weight: bold;', 'color: inherit;');
console.log('2. %ctest_addTimes()%c        - Add sample problem solve times', 'color: #2196f3; font-weight: bold;', 'color: inherit;');
console.log('3. %ctest_viewData()%c        - View current localStorage data', 'color: #ff9800; font-weight: bold;', 'color: inherit;');
console.log('4. %ctest_checkFunctions()%c  - Check if tracking functions exist', 'color: #9c27b0; font-weight: bold;', 'color: inherit;');
console.log('5. %ctest_refreshDisplay()%c  - Refresh calendar/stats display', 'color: #00bcd4; font-weight: bold;', 'color: inherit;');
console.log('6. %ctest_calculateExpected()%c - Show expected values', 'color: #e91e63; font-weight: bold;', 'color: inherit;');
console.log('7. %ctest_clearData()%c       - Clear all tracking data', 'color: #f44336; font-weight: bold;', 'color: inherit;');
console.log('');
console.log('%c💡 Quick Test: Run these in order', 'color: #ffc107; font-weight: bold;');
console.log('   test_addActivity(); test_addTimes(); test_refreshDisplay();');
console.log('');

// Auto-run check
console.log('%c🤖 Auto-running basic checks...', 'color: #666;');
test_checkFunctions();
test_viewData();

console.log('%c✨ Ready! Try the commands above.', 'color: #4caf50; font-size: 14px; font-weight: bold;');
