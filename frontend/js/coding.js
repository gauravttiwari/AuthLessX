// Coding Round JavaScript Functions

const CODING_API_URL = 'http://localhost:5000/api/coding';

// Get authentication token
function getAuthToken() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    return token;
}

// Fetch coding categories
async function getCodingCategories() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${CODING_API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
}

// Fetch question by type
async function getQuestion(type, difficulty = null) {
    const token = getAuthToken();
    if (!token) return null;

    try {
        let url = `${CODING_API_URL}/questions/${type}`;
        if (difficulty) {
            url += `?difficulty=${difficulty}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch question');
        return await response.json();
    } catch (error) {
        console.error('Error fetching question:', error);
        return null;
    }
}

// Submit code solution
async function submitCode(questionId, language, code, timeTaken) {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${CODING_API_URL}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId,
                language,
                code,
                timeTaken
            })
        });

        if (!response.ok) throw new Error('Failed to submit code');
        return await response.json();
    } catch (error) {
        console.error('Error submitting code:', error);
        throw error;
    }
}

// Get coding history
async function getCodingHistory(type = null, limit = 20) {
    const token = getAuthToken();
    if (!token) return null;

    try {
        let url = `${CODING_API_URL}/history?limit=${limit}`;
        if (type) {
            url += `&type=${type}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return null;
    }
}

// Get coding statistics
async function getCodingStats() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${CODING_API_URL}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

// Get supported languages
async function getSupportedLanguages() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${CODING_API_URL}/languages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch languages');
        return await response.json();
    } catch (error) {
        console.error('Error fetching languages:', error);
        return null;
    }
}

// Format time duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'Correct': '#10b981',
        'Wrong Answer': '#ef4444',
        'Runtime Error': '#f59e0b',
        'Time Limit Exceeded': '#f59e0b',
        'Compilation Error': '#dc2626'
    };
    return colors[status] || '#64748b';
}

// Get score color
function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCodingCategories,
        getQuestion,
        submitCode,
        getCodingHistory,
        getCodingStats,
        getSupportedLanguages,
        formatDuration,
        formatDate,
        getStatusColor,
        getScoreColor
    };
}
