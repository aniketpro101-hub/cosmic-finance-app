/**
 * Security Middleware Configuration
 * Headers, rate-limiters, and protective barriers.
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const CONSTANTS = require('../config/constants');

// Rate limiter for general public requests (skips localhost and static assets)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 3000 : 50000,
  message: { error: 'Too many requests from this IP address. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Never rate-limit localhost or loopback development requests
    const ip = req.ip || req.connection?.remoteAddress || '';
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || req.hostname === 'localhost') {
      return true;
    }
    // Skip static assets
    const p = req.path || '';
    if (p.startsWith('/images') || p.startsWith('/css') || p.startsWith('/js') || p.startsWith('/fonts') || p === '/favicon.ico') {
      return true;
    }
    return false;
  }
});

// Stricter rate limiter for sensitive form submissions (Kundli, Article submission, Leads)
const formSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 50 : 2000,
  message: { error: 'Submission rate limit reached for this IP. Please wait before submitting again.' },
  skip: (req) => {
    const ip = req.ip || req.connection?.remoteAddress || '';
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || req.hostname === 'localhost';
  }
});

// Very strict rate limiter for admin login to prevent brute force
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 200,
  message: 'Too many failed admin authentication attempts. Security lockout engaged for 15 minutes.'
});

// Configure Helmet with tuned Content Security Policy
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

module.exports = {
  generalLimiter,
  formSubmissionLimiter,
  adminLoginLimiter,
  helmetConfig
};
