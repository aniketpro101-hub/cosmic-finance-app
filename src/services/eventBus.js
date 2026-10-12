/**
 * Cosmic Finance — EventBus
 * In-process publisher/subscriber for real-time telemetry streaming (SSE)
 */

const { EventEmitter } = require('events');

const eventBus = new EventEmitter();
eventBus.setMaxListeners(200);

module.exports = eventBus;
