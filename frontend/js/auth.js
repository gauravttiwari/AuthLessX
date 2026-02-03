/**
 * Authentication logic for signup and login
 */

// Tab switching
function showTab(tab) {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => btn.classList.remove('active'));

    if (tab === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        tabButtons[0].classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
        tabButtons[1].classList.add('active');
    }

    // Clear status messages
    document.getElementById('signup-status').style.display = 'none';
    document.getElementById('login-status').style.display = 'none';
}

/**
 * Handle user signup
 */
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const statusDiv = document.getElementById('signup-status');

    try {
        statusDiv.textContent = '⏳ Generating cryptographic keys...';
        statusDiv.className = 'status-message';
        statusDiv.style.display = 'block';

        // Generate key pair
        const { publicKey } = await generateKeyPair();

        statusDiv.textContent = '⏳ Registering user...';

        // Send signup request
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                publicKey
            })
        });

        const data = await response.json();

        if (data.success) {
            statusDiv.className = 'status-message success';
            statusDiv.textContent = '✅ ' + data.message + ' Your private key is securely stored on this device!';
            
            // Clear form
            document.getElementById('signup-name').value = '';
            document.getElementById('signup-email').value = '';

            // Switch to login tab after 2 seconds
            setTimeout(() => {
                showTab('login');
                document.getElementById('login-email').value = email;
            }, 2000);
        } else {
            statusDiv.className = 'status-message error';
            statusDiv.textContent = '❌ ' + data.message;
        }
    } catch (error) {
        console.error('Signup error:', error);
        statusDiv.className = 'status-message error';
        statusDiv.textContent = '❌ Signup failed: ' + error.message;
    }
}

/**
 * Handle user login
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const statusDiv = document.getElementById('login-status');

    try {
        statusDiv.textContent = '⏳ Retrieving your private key...';
        statusDiv.className = 'status-message';
        statusDiv.style.display = 'block';

        // Get private key from IndexedDB
        const privateKey = await getPrivateKey();

        statusDiv.textContent = '⏳ Requesting challenge from server...';

        // Request challenge
        const challengeResponse = await fetch(`${API_BASE_URL}/auth/login/challenge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const challengeData = await challengeResponse.json();

        if (!challengeData.success) {
            throw new Error(challengeData.message);
        }

        statusDiv.textContent = '⏳ Signing challenge...';

        // Sign the challenge
        const signature = await signChallenge(challengeData.data.challenge, privateKey);

        statusDiv.textContent = '⏳ Verifying signature...';

        // Verify signature
        const verifyResponse = await fetch(`${API_BASE_URL}/auth/login/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                signature
            })
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
            // Store token and user info
            localStorage.setItem('authToken', verifyData.data.token);
            localStorage.setItem('userName', verifyData.data.user.name);
            localStorage.setItem('userEmail', verifyData.data.user.email);

            statusDiv.className = 'status-message success';
            statusDiv.textContent = '✅ Login successful! Redirecting...';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            statusDiv.className = 'status-message error';
            statusDiv.textContent = '❌ ' + verifyData.message;
        }
    } catch (error) {
        console.error('Login error:', error);
        statusDiv.className = 'status-message error';
        
        if (error.message.includes('not found')) {
            statusDiv.textContent = '❌ Private key not found. Please sign up first or use the same device you registered with.';
        } else {
            statusDiv.textContent = '❌ Login failed: ' + error.message;
        }
    }
}

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token && window.location.pathname.includes('index.html')) {
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});
