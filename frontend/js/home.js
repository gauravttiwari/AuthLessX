// Home page functionality
// API_BASE_URL is defined in crypto.js

// Check if user is logged in and update navigation
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const navAuth = document.querySelector('.nav-auth');
    
    if (token && userName && navAuth) {
        // Fetch coin balance
        let coinBalance = 0;
        try {
            const response = await fetch(`${API_BASE_URL}/coins/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                    <span id="nav-coin-balance">${coinBalance}</span>
                </div>
                <span style="color: #1a73e8; font-weight: 600;">👋 ${userName}</span>
                <button onclick="logout()" class="btn-secondary">Logout</button>
            </div>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', checkAuth);
