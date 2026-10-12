/**
 * Cryptographic Utility for Confidential Birth & Phone Data
 * Uses AES-256-GCM authenticated encryption.
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM

// Ensure 32-byte key
function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  if (Buffer.from(secret, 'hex').length === 32) {
    return Buffer.from(secret, 'hex');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(cipherText) {
  if (!cipherText) return null;
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) return null;
    const [ivHex, authTagHex, encryptedHex] = parts;
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    return '[Encrypted Record]';
  }
}

// Compute deterministic hash for search/indexing without exposing plain text
function hashIdentifier(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).trim()).digest('hex');
}

module.exports = {
  encrypt,
  decrypt,
  hashIdentifier
};
