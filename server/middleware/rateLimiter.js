// Memory-based rate limiter middleware for DDoS & brute-force protection

const createRateLimiter = ({ windowMs = 60000, max = 100, message = 'Too many requests, please try again later.' }) => {
  const hits = new Map();

  // Periodically clean up expired entries (unref so timer does not block process exit)
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now - record.startTime > windowMs) {
        hits.delete(key);
      }
    }
  }, Math.min(windowMs, 60000));
  if (timer && timer.unref) {
    timer.unref();
  }

  return (req, res, next) => {
    // Extract real client IP
    const clientIp = (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    ).trim();

    const now = Date.now();
    const record = hits.get(clientIp);

    if (!record) {
      hits.set(clientIp, { count: 1, startTime: now });
      return next();
    }

    if (now - record.startTime > windowMs) {
      hits.set(clientIp, { count: 1, startTime: now });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - record.startTime)) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: message,
        retryAfter: `${retryAfterSeconds} seconds`
      });
    }

    next();
  };
};

// General API protection: Max 300 requests per minute
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: 'API rate limit exceeded. Please throttle your requests.'
});

// Sensitive auth protection: Max 15 attempts per 15 minutes per IP
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.'
});
