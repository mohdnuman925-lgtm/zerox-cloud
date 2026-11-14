process.env.IS_SERVERLESS = 'true';
import app from '../server/index.js';

export default function handler(req, res) {
  // Ensure req.url matches Express route prefixes under /api
  const matchedPath = req.headers && req.headers['x-matched-path'];
  if (matchedPath && matchedPath.startsWith('/api')) {
    const queryIdx = req.url.indexOf('?');
    const search = queryIdx !== -1 ? req.url.slice(queryIdx) : '';
    req.url = matchedPath + search;
  } else if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}
