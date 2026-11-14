import express from 'express';
import { getDB, saveDB, logAudit } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Middleware: Strictly enforce Admin or Super Admin role
export const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied: Super Admin authorization required' });
  }
  next();
};

router.use(authenticateToken);
router.use(requireAdmin);

// 1. Admin Metrics Overview
router.get('/metrics', (req, res) => {
  const db = getDB();

  const totalCustomers = db.profiles.filter((u) => u.role === 'customer').length;
  const activeCustomers = db.profiles.filter((u) => u.role === 'customer' && u.status === 'active').length;
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === 'pending').length;
  const activeServices = db.services.filter((s) => s.status === 'active').length;
  const failedJobs = db.provisioning_jobs.filter((j) => j.status === 'failed').length;
  const openTickets = db.support_tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  const totalRevenueINR = db.orders
    .filter((o) => o.status === 'paid' && o.currency === 'INR')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const totalRevenueUSD = db.orders
    .filter((o) => o.status === 'paid' && o.currency === 'USD')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  res.json({
    metrics: {
      totalCustomers,
      activeCustomers,
      totalOrders,
      pendingOrders,
      activeServices,
      failedJobs,
      openTickets,
      revenue: {
        INR: totalRevenueINR,
        USD: totalRevenueUSD
      }
    }
  });
});

// 2. Customer Management
router.get('/customers', (req, res) => {
  const db = getDB();
  const customers = db.profiles.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    status: p.status,
    panel_password: p.panel_password,
    created_at: p.created_at,
    services_count: db.services.filter((s) => s.user_id === p.id).length,
    orders_count: db.orders.filter((o) => o.user_id === p.id).length
  }));
  res.json({ customers });
});

router.post('/customers/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = getDB();
  const customer = db.profiles.find((p) => p.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  if (customer.role === 'super_admin') {
    return res.status(403).json({ error: 'Super Admin status cannot be altered' });
  }

  customer.status = status;
  saveDB(db);

  logAudit(
    req.user.name,
    req.user.role,
    `CUSTOMER_${status.toUpperCase()}`,
    customer.email,
    reason || `Status updated to ${status}`
  );

  res.json({ message: `Customer account ${status} successfully`, customer });
});

// 3. Plan & Pricing Management
router.get('/plans', (req, res) => {
  const db = getDB();
  res.json({ plans: db.plans });
});

router.post('/plans', (req, res) => {
  try {
    const planData = req.body;
    if (!planData.name || !planData.category || !planData.price_inr) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }

    const db = getDB();
    const newPlan = {
      id: 'plan-' + Date.now(),
      product_id: 'prod-' + Date.now(),
      category: planData.category,
      game_slug: planData.game_slug || null,
      processor: planData.processor || null,
      name: planData.name.trim().toUpperCase(),
      tag: planData.tag || planData.category.toUpperCase(),
      badge: planData.badge || '',
      price_inr: parseFloat(planData.price_inr) || 0.0,
      price_usd: parseFloat(planData.price_usd) || 0.0,
      ram: planData.ram || '4 GB',
      cpu: planData.cpu || '100% CPU',
      storage: planData.storage || '30 GB NVMe',
      bandwidth: planData.bandwidth || 'Unlimited',
      location: planData.location || 'India (Noida & Mumbai)',
      features: Array.isArray(planData.features) ? planData.features : ['Instant deployment', 'DDoS protection'],
      sort_order: db.plans.length + 1,
      enabled: planData.enabled ?? true,
      stock_status: planData.stock_status || 'in_stock'
    };

    db.plans.push(newPlan);
    saveDB(db);

    logAudit(req.user.name, req.user.role, 'CREATE_PLAN', newPlan.name, `Added plan with price ₹${newPlan.price_inr}`);

    res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/plans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const db = getDB();
    const index = db.plans.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    db.plans[index] = {
      ...db.plans[index],
      ...updates,
      price_inr: updates.price_inr !== undefined ? parseFloat(updates.price_inr) : db.plans[index].price_inr,
      price_usd: updates.price_usd !== undefined ? parseFloat(updates.price_usd) : db.plans[index].price_usd,
      updated_at: new Date().toISOString()
    };

    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      'UPDATE_PLAN',
      db.plans[index].name,
      `Price updated: ₹${db.plans[index].price_inr} / $${db.plans[index].price_usd}`
    );

    res.json({ message: 'Plan updated successfully', plan: db.plans[index] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/plans/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const index = db.plans.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const removedPlan = db.plans.splice(index, 1)[0];
  saveDB(db);

  logAudit(req.user.name, req.user.role, 'DELETE_PLAN', removedPlan.name, `Deleted plan ${removedPlan.id}`);

  res.json({ message: 'Plan deleted successfully' });
});

// 4. Orders Management
router.get('/orders', (req, res) => {
  const db = getDB();
  res.json({ orders: db.orders });
});

// 5. Servers & Infrastructure Management
router.get('/servers', (req, res) => {
  const db = getDB();
  res.json({
    services: db.services,
    provisioning_jobs: db.provisioning_jobs
  });
});

// 6. Support Tickets Desk (Staff View)
router.get('/tickets', (req, res) => {
  const db = getDB();
  res.json({ tickets: db.support_tickets });
});

router.get('/tickets/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const ticket = db.support_tickets.find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const messages = db.ticket_messages.filter((m) => m.ticket_id === id);
  res.json({ ticket, messages });
});

router.post('/tickets/:id/reply', (req, res) => {
  try {
    const { id } = req.params;
    const { message, is_internal = false, status } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const db = getDB();
    const ticket = db.support_tickets.find((t) => t.id === id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      ticket_id: id,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: 'admin',
      message: message.trim(),
      is_internal: Boolean(is_internal),
      created_at: new Date().toISOString()
    };

    if (status && ['open', 'in_progress', 'answered', 'closed'].includes(status)) {
      ticket.status = status;
    } else if (!is_internal) {
      ticket.status = 'answered';
    }

    ticket.updated_at = new Date().toISOString();

    db.ticket_messages.push(newMessage);
    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      is_internal ? 'TICKET_INTERNAL_NOTE' : 'TICKET_STAFF_REPLY',
      ticket.ticket_number,
      `Replied to ticket ${ticket.ticket_number}`
    );

    res.status(201).json({ message: 'Reply posted', newMessage, ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Coupons Management
router.get('/coupons', (req, res) => {
  const db = getDB();
  res.json({ coupons: db.coupons });
});

router.post('/coupons', (req, res) => {
  const { code, discount_percent, description, max_uses } = req.body;
  if (!code || !discount_percent) {
    return res.status(400).json({ error: 'Code and discount percentage are required' });
  }

  const db = getDB();
  const newCoupon = {
    id: 'cpn-' + Date.now(),
    code: code.trim().toUpperCase(),
    discount_percent: parseInt(discount_percent),
    description: description || `${discount_percent}% off discount`,
    max_uses: parseInt(max_uses) || 500,
    current_uses: 0,
    valid_until: '2028-12-31T23:59:59Z',
    enabled: true
  };

  db.coupons.push(newCoupon);
  saveDB(db);

  logAudit(req.user.name, req.user.role, 'CREATE_COUPON', newCoupon.code, `Created coupon ${newCoupon.code}`);

  res.status(201).json({ message: 'Coupon created', coupon: newCoupon });
});

router.delete('/coupons/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.coupons = db.coupons.filter((c) => c.id !== id);
  saveDB(db);
  res.json({ message: 'Coupon deleted' });
});

// 8. Content CMS
router.get('/content', (req, res) => {
  const db = getDB();
  res.json({ settings: db.website_settings });
});

router.put('/content', (req, res) => {
  const updates = req.body;
  const db = getDB();
  db.website_settings = {
    ...db.website_settings,
    ...updates
  };
  saveDB(db);

  logAudit(req.user.name, req.user.role, 'UPDATE_WEBSITE_CONTENT', 'settings', 'Updated public website settings');

  res.json({ message: 'Website content updated', settings: db.website_settings });
});

// 9. Audit Logs
router.get('/audit-logs', (req, res) => {
  const db = getDB();
  res.json({ logs: db.audit_logs });
});

export default router;

