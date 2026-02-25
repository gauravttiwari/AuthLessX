// Courses page functionality

const API_BASE = 'http://localhost:5000/api';

// Check authentication
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const isPremium = localStorage.getItem('isPremium') === 'true';
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
                <span style="color: #1a73e8; font-weight: 600;">👋 ${userName}${isPremium ? ' (Premium)' : ''}</span>
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

// Show course details
function showCourse(courseId) {
    // For now, show premium requirement
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    if (!isPremium) {
        if (confirm('This course requires a premium membership. Would you like to upgrade?')) {
            upgradeToPremium();
        }
    } else {
        window.location.href = `course-detail.html?id=${courseId}`;
    }
}

// Upgrade to premium
function upgradeToPremium() {
    alert('Premium upgrade flow would be implemented here with payment integration');
    // Redirect to pricing or payment page
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
