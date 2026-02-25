// Problems listing page functionality

const API_BASE = 'http://localhost:5000/api';
let allProblems = [];
let filteredProblems = [];

// Check authentication
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const navAuth = document.querySelector('.nav-auth');
    
    if (token && userName && navAuth) {
        // Fetch coin balance
        let coinBalance = 0;
        try {
            const response = await fetch(`${API_BASE}/coins/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                coinBalance = data.coins || 0;
            }
        } catch (error) {
            console.error('Error loading coins:', error);
        }

        // User is logged in - show coins, username and logout button
        navAuth.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div onclick="window.location.href='contribute.html'" style="cursor: pointer; background: linear-gradient(135deg, #ef6c00 0%, #ff7f00 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(239, 108, 0, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <span style="font-size: 1.2rem;">🪙</span>
                    <span>${coinBalance}</span>
                </div>
                <span style="color: #1a73e8; font-weight: 600;">👋 ${userName}</span>
                <button onclick="logout()" class="btn-secondary">Logout</button>
            </div>
        `;
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Load problems
async function loadProblems() {
    try {
        const response = await fetch(`${API_BASE}/problems`);
        const data = await response.json();
        
        if (data.success) {
            allProblems = data.data.problems;
            filteredProblems = [...allProblems];
            displayProblems();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading problems:', error);
        document.getElementById('problems-tbody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #ea4335;">
                    Failed to load problems. Please try again.
                </td>
            </tr>
        `;
    }
}

// Display problems in table
function displayProblems() {
    const tbody = document.getElementById('problems-tbody');
    
    if (filteredProblems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #5f6368;">
                    No problems found matching your filters.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredProblems.map(problem => `
        <tr onclick="openProblem('${problem.questionId}', ${problem.isPremium})" style="${problem.isPremium ? 'cursor: pointer; opacity: 0.8;' : 'cursor: pointer;'}">
            <td>
                <span class="status-icon">${problem.isSolved ? '✓' : '○'}</span>
            </td>
            <td>
                <strong>${problem.title}</strong>
                ${problem.isPremium ? ' <span style="color: #ef6c00;">🔒</span>' : ''}
            </td>
            <td>${problem.topic}</td>
            <td>
                <span class="difficulty-badge ${problem.difficulty}">${problem.difficulty}</span>
            </td>
            <td>${problem.acceptanceRate ? problem.acceptanceRate.toFixed(1) + '%' : 'N/A'}</td>
            <td>
                ${problem.videoUrl ? '🎥 Video' : '—'}
            </td>
        </tr>
    `).join('');
}

// Open problem detail page
function openProblem(questionId, isPremium) {
    // Check if premium question and user doesn't have premium access
    if (isPremium) {
        const userPremium = localStorage.getItem('isPremium') === 'true';
        
        if (!userPremium) {
            // Show premium modal/alert
            if (confirm('🔒 This is a premium question!\n\nUpgrade to AuthLessX 150 or AuthLessX All to unlock this question and many more.\n\nClick OK to view subscription plans.')) {
                window.location.href = 'home.html#pricing';
            }
            return;
        }
    }
    
    // Since questionId in database now matches questions-bank ID
    // Check if questionsBank exists and has this question
    if (typeof questionsBank !== 'undefined' && questionsBank[questionId]) {
        // Open in coding-question.html if found in questions bank
        const problem = questionsBank[questionId];
        window.location.href = `coding-question.html?category=DSA&problemId=${questionId}&title=${encodeURIComponent(problem.title)}`;
    } else {
        // Otherwise open in problem-detail.html
        window.location.href = `problem-detail.html?id=${questionId}`;
    }
}

// Find question ID in questions bank by title matching
function findQuestionBankId(title) {
    // Check if questionsBank exists (from questions-bank.js)
    if (typeof questionsBank === 'undefined') {
        return null;
    }
    
    // Search through questions bank for matching title
    for (const [id, question] of Object.entries(questionsBank)) {
        if (question.title === title) {
            return id;
        }
    }
    
    return null;
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedList = document.querySelector('input[name="list"]:checked').value;
    const selectedDifficulties = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"][value]:checked'))
        .map(cb => cb.value);
    const selectedTopics = Array.from(document.querySelectorAll('.topics-list input:checked'))
        .map(cb => cb.value);
    
    filteredProblems = allProblems.filter(problem => {
        // Search filter
        if (searchTerm && !problem.title.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // List filter
        if (selectedList !== 'all') {
            if (selectedList === 'blind75' && !problem.neetCodeLists?.blind75) return false;
            if ((selectedList === 'authlessx150' || selectedList === 'neetcode150') && !problem.neetCodeLists?.neetCode150) return false;
            if ((selectedList === 'authlessx250' || selectedList === 'neetcode250') && !problem.neetCodeLists?.neetCode250) return false;
        }
        
        // Difficulty filter
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(problem.difficulty)) {
            return false;
        }
        
        // Topic filter
        if (selectedTopics.length > 0 && !selectedTopics.includes(problem.topic)) {
            return false;
        }
        
        return true;
    });
    
    displayProblems();
    updateStats();
}

// Update statistics
function updateStats() {
    const total = filteredProblems.length;
    const solved = filteredProblems.filter(p => p.isSolved).length;
    
    document.getElementById('problems-count').textContent = `${total} problems`;
    document.getElementById('solved-count').textContent = solved > 0 ? `${solved} solved` : '';
}

// Reset all filters
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.querySelector('input[name="list"][value="all"]').checked = true;
    
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });
    
    applyFilters();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProblems();
});
