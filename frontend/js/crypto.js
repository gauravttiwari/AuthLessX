/**
 * Cryptographic functions for passwordless authentication
 * Using Web Crypto API for RSA key generation and signing
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generate RSA key pair for user
 * @returns {Promise<{publicKey: string, privateKey: CryptoKey}>}
 */
async function generateKeyPair() {
    try {
        // Generate RSA key pair
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true, // extractable
            ["sign", "verify"]
        );

        // Export public key to PEM format
        const publicKeyExported = await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        );
        const publicKeyPem = arrayBufferToPem(publicKeyExported, 'PUBLIC KEY');

        // Store private key in IndexedDB for persistence
        await storePrivateKey(keyPair.privateKey);

        return {
            publicKey: publicKeyPem,
            privateKey: keyPair.privateKey
        };
    } catch (error) {
        console.error('Key generation error:', error);
        throw new Error('Failed to generate cryptographic keys');
    }
}

/**
 * Convert ArrayBuffer to PEM format
 */
function arrayBufferToPem(buffer, label) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const formatted = base64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}

/**
 * Sign challenge with private key
 * @param {string} challenge - Challenge from server
 * @param {CryptoKey} privateKey - User's private key
 * @returns {Promise<string>} - Base64 encoded signature
 */
async function signChallenge(challenge, privateKey) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(challenge);

        const signature = await window.crypto.subtle.sign(
            "RSASSA-PKCS1-v1_5",
            privateKey,
            data
        );

        // Convert signature to base64
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
        console.error('Signing error:', error);
        throw new Error('Failed to sign challenge');
    }
}

/**
 * Store private key in IndexedDB
 */
async function storePrivateKey(privateKey) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AuthLessXDB', 1);

        request.onerror = () => reject(request.error);
        
        request.onsuccess = async () => {
            const db = request.result;
            const transaction = db.transaction(['keys'], 'readwrite');
            const store = transaction.objectStore('keys');

            // Export and store the key
            const exported = await window.crypto.subtle.exportKey('jwk', privateKey);
            store.put({ id: 'privateKey', key: exported });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('keys')) {
                db.createObjectStore('keys', { keyPath: 'id' });
            }
        };
    });
}

/**
 * Retrieve private key from IndexedDB
 */
async function getPrivateKey() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AuthLessXDB', 1);

        request.onerror = () => reject(request.error);
        
        request.onsuccess = async () => {
            const db = request.result;
            
            if (!db.objectStoreNames.contains('keys')) {
                reject(new Error('No stored keys found'));
                return;
            }

            const transaction = db.transaction(['keys'], 'readonly');
            const store = transaction.objectStore('keys');
            const getRequest = store.get('privateKey');

            getRequest.onsuccess = async () => {
                if (!getRequest.result) {
                    reject(new Error('Private key not found'));
                    return;
                }

                try {
                    // Import the stored key
                    const privateKey = await window.crypto.subtle.importKey(
                        'jwk',
                        getRequest.result.key,
                        {
                            name: "RSASSA-PKCS1-v1_5",
                            hash: "SHA-256"
                        },
                        true,
                        ['sign']
                    );
                    resolve(privateKey);
                } catch (error) {
                    reject(error);
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('keys')) {
                db.createObjectStore('keys', { keyPath: 'id' });
            }
        };
    });
}

/**
 * Clear stored private key (for logout)
 */
async function clearPrivateKey() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AuthLessXDB', 1);

        request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('keys')) {
                resolve();
                return;
            }

            const transaction = db.transaction(['keys'], 'readwrite');
            const store = transaction.objectStore('keys');
            store.delete('privateKey');

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
    });
}
