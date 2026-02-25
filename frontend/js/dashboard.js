/**
 * Dashboard functionality for Mock Interview System
 */

// API_BASE_URL is defined in crypto.js
let currentCategory = '';
let questions = [];
let userAnswers = [];
let startTime = null;
let timerInterval = null;

// Check authentication on page load
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');

    if (!token) {
        window.location.href = 'login.html?mode=signin';
        return;
    }

    // Display user name
    document.getElementById('user-name').textContent = userName || 'User';

    // Load statistics and history
    await loadStatistics();
    await loadHistory();
});

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'home.html';
}

/**
 * Load user statistics
 */
async function loadStatistics() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/interview/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const stats = data.data;
            document.getElementById('total-interviews').textContent = stats.totalInterviews;
            document.getElementById('avg-score').textContent = stats.averageScore + '%';
            document.getElementById('technical-score').textContent = stats.byCategory.technical.avgScore + '%';
            document.getElementById('hr-score').textContent = stats.byCategory.hr.avgScore + '%';
            document.getElementById('aptitude-score').textContent = stats.byCategory.aptitude.avgScore + '%';
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

/**
 * Load interview history
 */
async function loadHistory() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/interview/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const historyContainer = document.getElementById('history-container');
            
            if (data.data.length === 0) {
                historyContainer.innerHTML = '<p style="text-align: center; color: #666;">No interview history yet. Start your first interview!</p>';
                return;
            }

            historyContainer.innerHTML = data.data.map(interview => `
                <div class="history-item">
                    <div class="history-info">
                        <h4>${getCategoryIcon(interview.category)} ${interview.category.toUpperCase()} Interview</h4>
                        <p>Completed: ${new Date(interview.completedAt).toLocaleDateString()} at ${new Date(interview.completedAt).toLocaleTimeString()}</p>
                        <p>Time: ${interview.timeTaken}s | Correct: ${interview.correctAnswers}/${interview.totalQuestions}</p>
                    </div>
                    <div class="history-score">${interview.score}%</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

/**
 * Get category icon
 */
function getCategoryIcon(category) {
    const icons = {
        technical: '💻',
        hr: '👔',
        aptitude: '🧮'
    };
    return icons[category] || '📝';
}

/**
 * Start interview
 */
async function startInterview(category) {
    try {
        currentCategory = category;
        const token = localStorage.getItem('authToken');

        // Fetch questions
        const response = await fetch(`${API_BASE_URL}/interview/questions/${category}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            questions = data.data.questions;
            userAnswers = new Array(questions.length).fill(null);

            // Hide categories, show interview section
            document.querySelector('.categories-section').style.display = 'none';
            document.querySelector('.history-section').style.display = 'none';
            document.getElementById('interview-section').style.display = 'block';

            // Set title
            document.getElementById('interview-title').textContent = 
                `${getCategoryIcon(category)} ${category.toUpperCase()} Interview`;

            // Render questions
            renderQuestions();

            // Start timer
            startTime = Date.now();
            startTimer();
        }
    } catch (error) {
        console.error('Failed to start interview:', error);
        alert('Failed to start interview. Please try again.');
    }
}

/**
 * Render questions
 */
function renderQuestions() {
    const container = document.getElementById('questions-container');
    
    container.innerHTML = questions.map((q, index) => `
        <div class="question-card">
            <h4>Question ${index + 1}: ${q.question}</h4>
            <div class="options">
                ${q.options.map((option, optIndex) => `
                    <div class="option ${userAnswers[index] === optIndex ? 'selected' : ''}" 
                         onclick="selectAnswer(${index}, ${optIndex})">
                        ${String.fromCharCode(65 + optIndex)}. ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

/**
 * Select answer
 */
function selectAnswer(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;
    renderQuestions();
}

/**
 * Start timer
 */
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

/**
 * Submit interview
 */
async function submitInterview() {
    // Check if all questions are answered
    if (userAnswers.includes(null)) {
        if (!confirm('You have unanswered questions. Do you want to submit anyway?')) {
            return;
        }
    }

    clearInterval(timerInterval);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/interview/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: currentCategory,
                answers: userAnswers,
                timeTaken
            })
        });

        const data = await response.json();

        if (data.success) {
            showResults(data.data);
        }
    } catch (error) {
        console.error('Failed to submit interview:', error);
        alert('Failed to submit interview. Please try again.');
    }
}

/**
 * Show results
 */
function showResults(results) {
    document.getElementById('interview-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';

    document.getElementById('result-score').textContent = results.score + '%';
    document.getElementById('result-correct').textContent = results.correctAnswers;
    document.getElementById('result-total').textContent = results.totalQuestions;
    document.getElementById('result-time').textContent = results.timeTaken;
    document.getElementById('result-feedback').textContent = results.feedback;

    // Change score color based on performance
    const scoreCircle = document.querySelector('.score-circle');
    if (results.score >= 80) {
        scoreCircle.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    } else if (results.score >= 60) {
        scoreCircle.style.background = 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
    } else if (results.score >= 40) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    }
}

/**
 * Cancel interview
 */
function cancelInterview() {
    if (confirm('Are you sure you want to cancel this interview? Your progress will be lost.')) {
        clearInterval(timerInterval);
        backToDashboard();
    }
}

/**
 * Back to dashboard
 */
async function backToDashboard() {
    document.getElementById('interview-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.querySelector('.categories-section').style.display = 'block';
    document.querySelector('.history-section').style.display = 'block';

    // Reload statistics and history
    await loadStatistics();
    await loadHistory();

    // Reset
    currentCategory = '';
    questions = [];
    userAnswers = [];
    startTime = null;
}
