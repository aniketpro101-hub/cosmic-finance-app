# Security Policy — Cosmic Finance

## Proprietary & Security Standards
Cosmic Finance is a private, proprietary platform handling personal astrological birth coordinates and financial market research. The platform implements rigorous zero-trust security architecture.

## Reporting a Vulnerability
If you discover a security vulnerability or sensitive data leakage within Cosmic Finance, please report it immediately and responsibly to:

- **Security Desk:** `security@cosmicfinance.in` (or via administrator consultation desk)
- **Emergency Priority:** Security reports are reviewed within 24 hours.

Please do NOT disclose any vulnerability publicly before receiving acknowledgment and resolution confirmation.

## Core Protection Architecture
1. **Zero Public Accounts:** No public user accounts, credentials, or session cookies are maintained for public visitors.
2. **Restricted Admin Gateway:** The single administrative control deck operates on a cryptographically randomized hidden route protected by mandatory Time-Based One-Time Password (TOTP) 2FA and brute-force rate-limiting lockouts.
3. **Data Encryption-at-Rest:** All sensitive personal data (such as user contact numbers) are encrypted in-memory using authenticated AES-256-GCM algorithms prior to storage.
4. **Transport Layer Security:** All public and administrative communication occurs over TLS/HTTPS with strict Content Security Policies (CSP) and security headers.
