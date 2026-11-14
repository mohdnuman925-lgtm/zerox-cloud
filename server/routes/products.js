import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();

// Get Public Website Settings
router.get('/settings', (req, res) => {
  const db = getDB();
  res.json({ settings: db.website_settings });
});

// Get Categories
router.get('/categories', (req, res) => {
  const db = getDB();
  const categories = db.product_categories.filter((c) => c.enabled);
  res.json({ categories });
});

// Get Games
router.get('/games', (req, res) => {
  const db = getDB();
  res.json({ games: db.games });
});

// Get Plans (with dynamic query filters)
router.get('/plans', (req, res) => {
  const db = getDB();
  const { category, game, processor } = req.query;

  let plans = db.plans.filter((p) => p.enabled);

  if (category) {
    plans = plans.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (game && category === 'games') {
    plans = plans.filter((p) => !p.game_slug || p.game_slug.toLowerCase() === game.toLowerCase());
  }

  if (processor && processor !== 'all' && category === 'games') {
    plans = plans.filter((p) => !p.processor || p.processor.toLowerCase() === processor.toLowerCase());
  }

  res.json({ plans });
});

// Validate Coupon
router.post('/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  const db = getDB();
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.enabled
  );

  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }

  if (coupon.current_uses >= coupon.max_uses) {
    return res.status(400).json({ error: 'Coupon usage limit has been reached' });
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount_percent: coupon.discount_percent,
    description: coupon.description
  });
});

export default router;

