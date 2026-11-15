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

// 5b. Infrastructure Nodes & Wings Management
router.get('/nodes', (req, res) => {
  const db = getDB();
  const nodes = (db.nodes || []).map((node) => {
    const activeServers = (db.services || []).filter(
      (s) => s.node === node.fqdn || s.node === node.name || s.node === node.id || s.ip_address === node.ip_address
    );

    const allocatedMemoryMb = activeServers.reduce((sum, s) => sum + (parseFloat(s.ram_max || 4) * 1024), 0);
    const allocatedDiskMb = activeServers.reduce((sum, s) => sum + (parseFloat(s.disk_max || 30) * 1024), 0);
    const effectiveMaxMemory = (node.memory_limit_mb || 65536) * (1 + (node.memory_overcommit_pct || 0) / 100);
    const effectiveMaxDisk = (node.disk_limit_mb || 1048576) * (1 + (node.disk_overcommit_pct || 0) / 100);

    return {
      ...node,
      allocated_memory_mb: allocatedMemoryMb,
      allocated_disk_mb: allocatedDiskMb,
      allocated_servers_count: activeServers.length,
      memory_usage_pct: Math.min(100, Math.round((allocatedMemoryMb / Math.max(1, effectiveMaxMemory)) * 100)),
      disk_usage_pct: Math.min(100, Math.round((allocatedDiskMb / Math.max(1, effectiveMaxDisk)) * 100)),
      server_usage_pct: Math.min(100, Math.round((activeServers.length / Math.max(1, node.max_servers || 50)) * 100))
    };
  });

  const totalMemoryMb = nodes.reduce((sum, n) => sum + (n.memory_limit_mb || 0), 0);
  const totalAllocatedMemoryMb = nodes.reduce((sum, n) => sum + (n.allocated_memory_mb || 0), 0);
  const totalDiskMb = nodes.reduce((sum, n) => sum + (n.disk_limit_mb || 0), 0);
  const totalAllocatedDiskMb = nodes.reduce((sum, n) => sum + (n.allocated_disk_mb || 0), 0);
  const totalServers = nodes.reduce((sum, n) => sum + (n.allocated_servers_count || 0), 0);

  const summary = {
    total_nodes: nodes.length,
    online_nodes: nodes.filter((n) => n.status === 'online').length,
    maintenance_nodes: nodes.filter((n) => n.status === 'maintenance' || n.maintenance_mode).length,
    total_memory_gb: Math.round(totalMemoryMb / 1024),
    allocated_memory_gb: Math.round(totalAllocatedMemoryMb / 1024),
    total_disk_tb: Number((totalDiskMb / (1024 * 1024)).toFixed(1)),
    allocated_disk_tb: Number((totalAllocatedDiskMb / (1024 * 1024)).toFixed(2)),
    total_active_instances: totalServers
  };

  res.json({ nodes, summary });
});

router.post('/nodes', (req, res) => {
  try {
    const {
      name,
      fqdn,
      ip_address,
      location = 'India (Noida & Mumbai)',
      country_code = 'IN',
      daemon_port = 8080,
      daemon_sftp = 2022,
      scheme = 'https',
      status = 'online',
      maintenance_mode = false,
      memory_limit_mb = 65536,
      memory_overcommit_pct = 0,
      disk_limit_mb = 1048576,
      disk_overcommit_pct = 0,
      cpu_cores = 32,
      port_range_start = 25565,
      port_range_end = 25999,
      max_servers = 50,
      description = ''
    } = req.body;

    if (!name || !fqdn || !ip_address) {
      return res.status(400).json({ error: 'Node name, FQDN/domain, and primary IP address are required' });
    }

    const db = getDB();
    if (!db.nodes) db.nodes = [];

    // Check duplicate FQDN or IP
    const existing = db.nodes.find(
      (n) => n.fqdn.toLowerCase() === fqdn.toLowerCase() || n.ip_address === ip_address
    );
    if (existing) {
      return res.status(400).json({ error: `A node with FQDN "${fqdn}" or IP "${ip_address}" already exists` });
    }

    const newNode = {
      id: 'node-' + Date.now(),
      name: name.trim(),
      fqdn: fqdn.trim().toLowerCase(),
      ip_address: ip_address.trim(),
      location: location.trim(),
      country_code: country_code.trim().toUpperCase(),
      daemon_port: Number(daemon_port) || 8080,
      daemon_sftp: Number(daemon_sftp) || 2022,
      scheme: scheme === 'http' ? 'http' : 'https',
      status: status || 'online',
      maintenance_mode: Boolean(maintenance_mode),
      memory_limit_mb: Number(memory_limit_mb) || 65536,
      memory_overcommit_pct: Number(memory_overcommit_pct) || 0,
      disk_limit_mb: Number(disk_limit_mb) || 1048576,
      disk_overcommit_pct: Number(disk_overcommit_pct) || 0,
      cpu_cores: Number(cpu_cores) || 32,
      port_range_start: Number(port_range_start) || 25565,
      port_range_end: Number(port_range_end) || 25999,
      max_servers: Number(max_servers) || 50,
      description: description ? description.trim() : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.nodes.push(newNode);
    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      'NODE_CREATED',
      newNode.name,
      `Created node ${newNode.name} (${newNode.fqdn} / ${newNode.ip_address}) with ${newNode.memory_limit_mb}MB RAM and ${newNode.disk_limit_mb}MB Disk`
    );

    res.status(201).json({ success: true, node: newNode });
  } catch (err) {
    console.error('Failed to create node:', err);
    res.status(500).json({ error: 'Failed to create node: ' + err.message });
  }
});

router.put('/nodes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    if (!db.nodes) db.nodes = [];

    const node = db.nodes.find((n) => n.id === id);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const {
      name,
      fqdn,
      ip_address,
      location,
      country_code,
      daemon_port,
      daemon_sftp,
      scheme,
      status,
      maintenance_mode,
      memory_limit_mb,
      memory_overcommit_pct,
      disk_limit_mb,
      disk_overcommit_pct,
      cpu_cores,
      port_range_start,
      port_range_end,
      max_servers,
      description
    } = req.body;

    if (name !== undefined) node.name = name.trim();
    if (fqdn !== undefined) node.fqdn = fqdn.trim().toLowerCase();
    if (ip_address !== undefined) node.ip_address = ip_address.trim();
    if (location !== undefined) node.location = location.trim();
    if (country_code !== undefined) node.country_code = country_code.trim().toUpperCase();
    if (daemon_port !== undefined) node.daemon_port = Number(daemon_port);
    if (daemon_sftp !== undefined) node.daemon_sftp = Number(daemon_sftp);
    if (scheme !== undefined) node.scheme = scheme === 'http' ? 'http' : 'https';
    if (status !== undefined) node.status = status;
    if (maintenance_mode !== undefined) node.maintenance_mode = Boolean(maintenance_mode);
    if (memory_limit_mb !== undefined) node.memory_limit_mb = Number(memory_limit_mb);
    if (memory_overcommit_pct !== undefined) node.memory_overcommit_pct = Number(memory_overcommit_pct);
    if (disk_limit_mb !== undefined) node.disk_limit_mb = Number(disk_limit_mb);
    if (disk_overcommit_pct !== undefined) node.disk_overcommit_pct = Number(disk_overcommit_pct);
    if (cpu_cores !== undefined) node.cpu_cores = Number(cpu_cores);
    if (port_range_start !== undefined) node.port_range_start = Number(port_range_start);
    if (port_range_end !== undefined) node.port_range_end = Number(port_range_end);
    if (max_servers !== undefined) node.max_servers = Number(max_servers);
    if (description !== undefined) node.description = description.trim();
    node.updated_at = new Date().toISOString();

    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      'NODE_UPDATED',
      node.name,
      `Updated node ${node.name} (IP: ${node.ip_address}, Limits: ${node.memory_limit_mb}MB RAM / ${node.disk_limit_mb}MB Disk)`
    );

    res.json({ success: true, node });
  } catch (err) {
    console.error('Failed to update node:', err);
    res.status(500).json({ error: 'Failed to update node: ' + err.message });
  }
});

router.post('/nodes/:id/maintenance', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const node = (db.nodes || []).find((n) => n.id === id);
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }

  node.maintenance_mode = !node.maintenance_mode;
  node.status = node.maintenance_mode ? 'maintenance' : 'online';
  node.updated_at = new Date().toISOString();
  saveDB(db);

  logAudit(
    req.user.name,
    req.user.role,
    'NODE_MAINTENANCE_TOGGLED',
    node.name,
    `Maintenance mode ${node.maintenance_mode ? 'ENABLED' : 'DISABLED'} on node ${node.name}`
  );

  res.json({ success: true, node });
});

router.delete('/nodes/:id', (req, res) => {
  const { id } = req.params;
  const force = req.query.force === 'true';
  const db = getDB();
  const nodeIndex = (db.nodes || []).findIndex((n) => n.id === id);

  if (nodeIndex === -1) {
    return res.status(404).json({ error: 'Node not found' });
  }

  const node = db.nodes[nodeIndex];
  const activeServers = (db.services || []).filter(
    (s) => s.node === node.fqdn || s.node === node.name || s.node === node.id || s.ip_address === node.ip_address
  );

  if (activeServers.length > 0 && !force) {
    return res.status(400).json({
      error: `Cannot delete node "${node.name}": There are ${activeServers.length} active customer servers assigned to this node. Migrate or remove them first, or confirm force delete.`
    });
  }

  db.nodes.splice(nodeIndex, 1);
  saveDB(db);

  logAudit(
    req.user.name,
    req.user.role,
    'NODE_DELETED',
    node.name,
    `Deleted infrastructure node ${node.name} (${node.fqdn} / ${node.ip_address})`
  );

  res.json({ success: true, message: `Node "${node.name}" deleted successfully.` });
});

router.get('/nodes/:id/servers', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const node = (db.nodes || []).find((n) => n.id === id);

  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }

  const servers = (db.services || []).filter(
    (s) => s.node === node.fqdn || s.node === node.name || s.node === node.id || s.ip_address === node.ip_address
  );

  res.json({ node, servers });
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

