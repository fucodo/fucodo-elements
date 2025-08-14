// Preload shim for Vite expecting crypto.hash in Node context
try {
  const nodeCrypto = require('node:crypto');
  if (!globalThis.crypto) {
    globalThis.crypto = {};
  }
  if (typeof globalThis.crypto.hash !== 'function') {
    globalThis.crypto.hash = (data, algorithm = 'sha256') => {
      if (typeof data === 'string') data = Buffer.from(data);
      return nodeCrypto.createHash(algorithm).update(data).digest('hex');
    };
  }
} catch (e) {
  // no-op
}
