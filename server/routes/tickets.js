import express from 'express';
import { getDB, saveDB, logAudit } from '../db.js';
import { authenticateToken } from './auth.js';
import { sanitizeString } from '../middleware/sanitize.js';

const router = express.Router();

// Get Current User Tickets
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const tickets = db.support_tickets.filter((t) => t.user_id === req.user.id);
  res.json({ tickets });
});

// Create New Ticket
router.post('/create', authenticateToken, (req, res) => {
  try {
    const { department, priority = 'medium', subject, message } = req.body;

    if (!department || !subject || !message) {
      return res.status(400).json({ error: 'Department, subject, and message are required' });
    }

    const cleanSubject = sanitizeString(subject, 120);
    const cleanMessage = sanitizeString(message, 5000);
    const cleanDept = sanitizeString(department, 50);
    const cleanPriority = ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium';

    if (!cleanSubject || !cleanMessage) {
      return res.status(400).json({ error: 'Subject and message cannot be empty or invalid' });
    }

    const db = getDB();
    const ticketId = 'tkt-' + Date.now();
    const ticketNumber = 'TKT-' + Math.floor(1000 + Math.random() * 9000);

    const newTicket = {
      id: ticketId,
      ticket_number: ticketNumber,
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      department: cleanDept,
      priority: cleanPriority,
      subject: cleanSubject,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const firstMessage = {
      id: 'msg-' + Date.now(),
      ticket_id: ticketId,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: 'customer',
      message: cleanMessage,
      is_internal: false,
      created_at: new Date().toISOString()
    };

    db.support_tickets.unshift(newTicket);
    db.ticket_messages.push(firstMessage);
    saveDB(db);

    logAudit(req.user.name, req.user.role, 'CREATE_TICKET', ticketNumber, `Opened ticket: ${subject}`);

    res.status(201).json({
      message: 'Support ticket submitted successfully',
      ticket: newTicket,
      firstMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Ticket Thread
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const ticket = db.support_tickets.find((t) => t.id === id && t.user_id === req.user.id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Filter out internal staff notes
  const messages = db.ticket_messages.filter(
    (m) => m.ticket_id === id && (!m.is_internal || ['admin', 'super_admin', 'support'].includes(req.user.role))
  );

  res.json({ ticket, messages });
});

// Reply to Ticket
router.post('/:id/reply', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const cleanReply = sanitizeString(message, 5000);
    if (!cleanReply) {
      return res.status(400).json({ error: 'Message cannot be empty or invalid' });
    }

    const db = getDB();
    const ticket = db.support_tickets.find((t) => t.id === id && t.user_id === req.user.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      ticket_id: id,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: 'customer',
      message: cleanReply,
      is_internal: false,
      created_at: new Date().toISOString()
    };

    ticket.status = 'open'; // Re-open or mark waiting for staff
    ticket.updated_at = new Date().toISOString();

    db.ticket_messages.push(newMessage);
    saveDB(db);

    res.status(201).json({ message: 'Reply posted', newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

