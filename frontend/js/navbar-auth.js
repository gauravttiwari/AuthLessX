/**
 * Common navbar authentication handler
 * Automatically updates navbar auth buttons based on login state
 */

// API_BASE_URL is defined in crypto.js which is loaded first

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'home.html';
}

// Update navbar based on authentication state
async function updateNavbarAuth() {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const navAuth = document.querySelector('.nav-auth');
    
    if (!navAuth) return;

    if (token && userName) {
        // User is logged in - show coins, user name and logout button (coin system placeholder)
        const coinBalance = 0; // Placeholder for future coin system

        // User is logged in - show coins, user name and logout button
        navAuth.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div onclick="window.location.href='contribute.html'" style="cursor: pointer; background: linear-gradient(135deg, #ef6c00 0%, #ff7f00 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(239, 108, 0, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <span style="font-size: 1.2rem;">🪙</span>
                    <span>${coinBalance}</span>
                </div>
                <span style="color: var(--text-primary); font-weight: 600;">👤 ${userName}</span>
                <button onclick="logout()" class="btn-secondary">Logout</button>
            </div>
        `;
    } else {
        // User is not logged in - show sign in and sign up buttons
        navAuth.innerHTML = `
            <button onclick="window.location.href='login.html?mode=signin'" class="btn-secondary">Sign In</button>
            <button onclick="window.location.href='login.html?mode=signup'" class="btn-primary">Sign Up</button>
        `;
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
} else {
    updateNavbarAuth();
}
