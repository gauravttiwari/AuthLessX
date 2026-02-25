// Mock interview functionality

const API_BASE = 'http://localhost:5000/api';
let currentInterview = null;
let currentQuestionIndex = 0;
let answers = [];
let startTime = null;
let timerInterval = null;

// Check authentication
function checkAuth() {
    const publicKey = localStorage.getItem('publicKey');
    const userName = localStorage.getItem('userName');
    
    if (!publicKey || !userName) {
        alert('Please sign in to start a mock interview');
        window.location.href = 'login.html?mode=signin';
        return;
    }
    
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameDisplay = document.getElementById('user-name-display');
    
    userNameDisplay.textContent = userName;
    userNameDisplay.style.display = 'inline';
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
}

function handleAuthButton() {
    logout();
}

function logout() {
    localStorage.clear();
    window.location.href = 'home.html';
}

// Start interview
function startInterview() {
    const interviewType = document.querySelector('input[name="interview-type"]:checked').value;
    const problemType = document.querySelector('input[name="problem-type"]:checked')?.value || 'DSA';
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const language = document.getElementById('language-select').value;
    const questionsCount = parseInt(document.getElementById('questions-count').value);
    
    // Get selected topics
    const topics = Array.from(document.querySelectorAll('.topics-multiselect input:checked'))
        .map(cb => cb.value);
    
    currentInterview = {
        type: interviewType,
        problemType,
        difficulty,
        language,
        questionsCount,
        topics,
        questions: [],
        startTime: new Date()
    };
    
    // Hide setup, show interview
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('interview-screen').style.display = 'block';
    
    // Load questions
    loadInterviewQuestions();
    
    // Start timer
    startTimer();
}

// Load questions
async function loadInterviewQuestions() {
    try {
        // Fetch questions based on interview settings
        const response = await fetch(`${API_BASE}/coding/questions/${currentInterview.problemType}?difficulty=${currentInterview.difficulty}`);
        const data = await response.json();
        
        if (data.success) {
            // For now, mock multiple questions
            currentInterview.questions = Array(currentInterview.questionsCount).fill(data.data);
            
            document.getElementById('total-questions').textContent = currentInterview.questionsCount;
            
            showQuestion(0);
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions');
    }
}

// Show question
function showQuestion(index) {
    currentQuestionIndex = index;
    
    const question = currentInterview.questions[index];
    
    // Update progress
    document.getElementById('current-question').textContent = `Question ${index + 1}`;
    document.getElementById('progress-fill').style.width = 
        `${((index + 1) / currentInterview.questionsCount) * 100}%`;
    
    // Show question content based on type
    if (currentInterview.type === 'coding') {
        showCodingQuestion(question);
    } else {
        showMCQQuestion(question);
    }
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = index === 0;
}

// Show coding question
function showCodingQuestion(question) {
    document.getElementById('interview-content').innerHTML = `
        <div class="coding-question">
            <h2>${question.title}</h2>
            <div class="question-description">
                ${question.description}
            </div>
            <div class="code-editor-container">
                <div id="interview-code-editor"></div>
            </div>
        </div>
    `;
    
    // Initialize Monaco editor
    // (Implementation similar to problem-detail.js)
}

// Show MCQ question
function showMCQQuestion(question) {
    // Mock MCQ for non-coding rounds
    document.getElementById('interview-content').innerHTML = `
        <div class="mcq-question">
            <h2>Question ${currentQuestionIndex + 1}</h2>
            <p>What is the time complexity of binary search?</p>
            <div class="mcq-options">
                <label><input type="radio" name="answer" value="A"> O(n)</label>
                <label><input type="radio" name="answer" value="B"> O(log n)</label>
                <label><input type="radio" name="answer" value="C"> O(n²)</label>
                <label><input type="radio" name="answer" value="D"> O(1)</label>
            </div>
        </div>
    `;
}

// Navigation
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

function skipQuestion() {
    answers[currentQuestionIndex] = null;
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < currentInterview.questionsCount - 1) {
        showQuestion(currentQuestionIndex + 1);
    } else {
        finishInterview();
    }
}

// Timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('interview-timer-display').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// End interview
function confirmEndInterview() {
    if (confirm('Are you sure you want to end the interview?')) {
        finishInterview();
    }
}

function finishInterview() {
    clearInterval(timerInterval);
    
    // Calculate results
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const correct = Math.floor(Math.random() * currentInterview.questionsCount); // Mock
    const incorrect = Math.floor(Math.random() * (currentInterview.questionsCount - correct));
    const skipped = currentInterview.questionsCount - correct - incorrect;
    const percentage = Math.round((correct / currentInterview.questionsCount) * 100);
    
    // Show results
    document.getElementById('interview-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    document.getElementById('overall-percentage').textContent = `${percentage}%`;
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('incorrect-count').textContent = incorrect;
    document.getElementById('skipped-count').textContent = skipped;
    
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    document.getElementById('time-taken').textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    
    // Show recommendations
    showRecommendations(percentage);
}

// Show recommendations
function showRecommendations(score) {
    const weakAreas = document.getElementById('weak-areas-list');
    const recommendations = document.getElementById('recommendations-list');
    
    if (score < 60) {
        weakAreas.innerHTML = `
            <p>• Arrays & Hashing - Practice more basic problems</p>
            <p>• Two Pointers - Review the pattern</p>
        `;
        recommendations.innerHTML = `
            <p>• Start with easy problems on AuthLessX 150</p>
            <p>• Watch video explanations for better understanding</p>
            <p>• Focus on time complexity analysis</p>
        `;
    } else if (score < 80) {
        weakAreas.innerHTML = `
            <p>• Dynamic Programming - More practice needed</p>
        `;
        recommendations.innerHTML = `
            <p>• Move to medium difficulty problems</p>
            <p>• Practice mock interviews regularly</p>
        `;
    } else {
        weakAreas.innerHTML = `<p>Great job! Keep practicing consistently.</p>`;
        recommendations.innerHTML = `
            <p>• Try hard problems to challenge yourself</p>
            <p>• Focus on optimizing solutions</p>
            <p>• Help others in the community</p>
        `;
    }
}

function reviewAnswers() {
    alert('Review answers functionality - show all questions with user answers');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Toggle coding-specific options
    document.querySelectorAll('input[name="interview-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isCoding = e.target.value === 'coding';
            document.getElementById('coding-options').style.display = isCoding ? 'block' : 'none';
            document.getElementById('language-selection').style.display = isCoding ? 'block' : 'none';
        });
    });
});
