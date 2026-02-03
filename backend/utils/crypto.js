const crypto = require('crypto');

/**
 * Generate a random challenge (nonce) for login authentication
 */
function generateChallenge() {
    return crypto.randomBytes(32).toString('base64');
}

/**
 * Verify the signature using the public key
 * @param {string} challenge - The original challenge sent to user
 * @param {string} signature - The signed challenge from user
 * @param {string} publicKey - User's public key from database
 * @returns {boolean} - True if signature is valid
 */
function verifySignature(challenge, signature, publicKey) {
    try {
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(challenge);
        verifier.end();
        
        return verifier.verify(
            publicKey,
            signature,
            'base64'
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

module.exports = {
    generateChallenge,
    verifySignature
};
