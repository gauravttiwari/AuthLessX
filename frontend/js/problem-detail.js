// Problem detail page functionality

const API_BASE = 'http://localhost:5000/api';
let currentProblem = null;
let editor = null;
let timerSeconds = 0;
let timerInterval = null;

// Get question ID from URL
function getQuestionId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Check authentication
function checkAuth() {
    const publicKey = localStorage.getItem('publicKey');
    const userName = localStorage.getItem('userName');
    
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameDisplay = document.getElementById('user-name-display');
    
    if (publicKey && userName) {
        userNameDisplay.textContent = userName;
        userNameDisplay.style.display = 'inline';
        signinBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        userNameDisplay.style.display = 'none';
        signinBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

function handleAuthButton() {
    const publicKey = localStorage.getItem('publicKey');
    if (publicKey) {
        logout();
    } else {
        window.location.href = 'login.html?mode=signin';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'home.html';
}

// Load problem details
async function loadProblem() {
    const questionId = getQuestionId();
    
    if (!questionId) {
        alert('No problem specified');
        window.location.href = 'problems.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/problems/${questionId}`);
        const data = await response.json();
        
        if (data.success) {
            currentProblem = data.data;
            displayProblem();
            initializeEditor();
        } else {
            alert('Problem not found');
            window.location.href = 'problems.html';
        }
    } catch (error) {
        console.error('Error loading problem:', error);
        alert('Failed to load problem');
    }
}

// Display problem information
function displayProblem() {
    // Title and meta
    document.getElementById('problem-title').textContent = currentProblem.title;
    document.getElementById('problem-title-nav').textContent = currentProblem.title;
    
    const difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.textContent = currentProblem.difficulty;
    difficultyBadge.className = `difficulty-badge ${currentProblem.difficulty}`;
    
    document.getElementById('topic-badge').textContent = currentProblem.topic;
    document.getElementById('acceptance-rate').textContent = 
        currentProblem.acceptanceRate ? `${currentProblem.acceptanceRate.toFixed(1)}%` : 'N/A';
    
    // Description
    document.getElementById('problem-description').innerHTML = `
        <h3>Problem</h3>
        <p>${currentProblem.description}</p>
    `;
    
    // Examples
    if (currentProblem.examples && currentProblem.examples.length > 0) {
        document.getElementById('problem-examples').innerHTML = `
            <h3>Examples</h3>
            ${currentProblem.examples.map((ex, i) => `
                <div class="example-block">
                    <strong>Example ${i + 1}:</strong>
                    <pre><strong>Input:</strong> ${ex.input}</pre>
                    <pre><strong>Output:</strong> ${ex.output}</pre>
                    ${ex.explanation ? `<pre><strong>Explanation:</strong> ${ex.explanation}</pre>` : ''}
                </div>
            `).join('')}
        `;
    }
    
    // Constraints
    if (currentProblem.constraints) {
        document.getElementById('problem-constraints').innerHTML = `
            <h3>Constraints</h3>
            <pre>${currentProblem.constraints}</pre>
        `;
    }
    
    // Hints
    if (currentProblem.hints && currentProblem.hints.length > 0) {
        document.getElementById('problem-hints').innerHTML = `
            <h3>💡 Hints</h3>
            ${currentProblem.hints.map((hint, i) => `
                <details>
                    <summary>Hint ${i + 1}</summary>
                    <p>${hint}</p>
                </details>
            `).join('')}
        `;
    }
    
    // Basic explanation (free)
    if (currentProblem.basicExplanation) {
        document.getElementById('basic-explanation-text').textContent = currentProblem.basicExplanation;
        document.getElementById('time-complexity').textContent = currentProblem.timeComplexity || 'N/A';
        document.getElementById('space-complexity').textContent = currentProblem.spaceComplexity || 'N/A';
    }
    
    // Premium content
    if (currentProblem.hasPremiumAccess && currentProblem.videoUrl) {
        document.getElementById('premium-upsell').style.display = 'none';
        document.getElementById('solution-premium-content').style.display = 'block';
        document.getElementById('solution-premium').style.display = 'none';
        
        // Video
        document.getElementById('video-container').innerHTML = `
            <iframe width="100%" height="400" src="${currentProblem.videoUrl}" 
                    frameborder="0" allowfullscreen></iframe>
        `;
    }
}

// Initialize Monaco Editor
function initializeEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function () {
        const language = document.getElementById('language-select').value;
        const starterCode = currentProblem.starterCode?.[language] || '// Start typing your code here';
        
        editor = monaco.editor.create(document.getElementById('code-editor'), {
            value: starterCode,
            language: language,
            theme: 'vs-light',
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true
        });
    });
}

// Change language
function changeLanguage() {
    if (!editor) return;
    
    const language = document.getElementById('language-select').value;
    const starterCode = currentProblem.starterCode?.[language] || '// Start typing your code here';
    
    monaco.editor.setModelLanguage(editor.getModel(), language);
    editor.setValue(starterCode);
}

// Reset code
function resetCode() {
    if (!editor) return;
    
    const language = document.getElementById('language-select').value;
    const starterCode = currentProblem.starterCode?.[language] || '// Start typing your code here';
    
    editor.setValue(starterCode);
}

// Toggle theme
function toggleTheme() {
    if (!editor) return;
    
    const currentTheme = editor._themeService._theme.themeName;
    const newTheme = currentTheme === 'vs-light' ? 'vs-dark' : 'vs-light';
    
    monaco.editor.setTheme(newTheme);
}

// Timer functionality
function toggleTimer() {
    if (timerInterval) {
        // Stop timer
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('timer-btn').textContent = '▶ Start Timer';
    } else {
        // Start timer
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
        document.getElementById('timer-btn').textContent = '⏸ Pause Timer';
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timer-display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Run code
async function runCode() {
    alert('Running code... (This would execute test cases)');
    // Implement Judge0 integration here
}

// Submit code
async function submitCode() {
    if (!editor) return;
    
    const code = editor.getValue();
    const language = document.getElementById('language-select').value;
    const questionId = getQuestionId();
    
    try {
        const response = await fetch(`${API_BASE}/problems/${questionId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ code, language })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResults(data.data);
        } else {
            alert('Submission failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error submitting code:', error);
        alert('Failed to submit code');
    }
}

// Show results
function showResults(results) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
        <div class="result-${results.accepted ? 'success' : 'error'}">
            <h3>${results.accepted ? '✓ Accepted!' : '✗ Wrong Answer'}</h3>
            <p>${results.message}</p>
            <p>Tests Passed: ${results.testsPassed}/${results.totalTests}</p>
        </div>
    `;
    
    resultsSection.style.display = 'block';
}

function closeResults() {
    document.getElementById('results-section').style.display = 'none';
}

// Show problem tabs
function showProblemTab(tabName) {
    document.querySelectorAll('.problem-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Test cases
function showTestCase(index) {
    if (!currentProblem.sampleTestCases[index]) return;
    
    const testCase = currentProblem.sampleTestCases[index];
    document.getElementById('test-input').value = testCase.input;
    
    // Update active tab
    document.querySelectorAll('.test-case-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
}

function addCustomTestCase() {
    alert('Add custom test case functionality');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProblem();
});
