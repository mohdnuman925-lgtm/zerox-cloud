import express from 'express';
import { getDB } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get Invoices for Current User
router.get('/invoices', authenticateToken, (req, res) => {
  const db = getDB();
  const invoices = db.invoices.filter((inv) => inv.user_id === req.user.id);
  res.json({ invoices });
});

// Get Single Invoice
router.get('/invoices/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const invoice = db.invoices.find((inv) => inv.id === id && inv.user_id === req.user.id);

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  res.json({ invoice });
});

export default router;

