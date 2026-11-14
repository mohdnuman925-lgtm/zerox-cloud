import express from 'express';
import { getDB, saveDB, logAudit } from '../db.js';
import { authenticateToken } from './auth.js';
import { PterodactylAdapter } from '../providers/pterodactylAdapter.js';

const router = express.Router();

// Get Current User's Active Services
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const userServices = db.services.filter((s) => s.user_id === req.user.id);
  res.json({ services: userServices });
});

// Power Actions (start, stop, restart, kill)
router.post('/:id/power', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { signal } = req.body;

    if (!['start', 'stop', 'restart', 'kill'].includes(signal)) {
      return res.status(400).json({ error: 'Invalid power signal' });
    }

    const db = getDB();
    const serviceIndex = db.services.findIndex((s) => s.id === id && s.user_id === req.user.id);

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found or unauthorized' });
    }

    const service = db.services[serviceIndex];

    const result = await PterodactylAdapter.sendPowerAction(service.provider_identifier, signal);

    if (signal === 'stop' || signal === 'kill') {
      service.status = 'suspended';
      service.cpu_usage = 0.0;
      service.ram_usage = 0.0;
    } else {
      service.status = 'active';
      service.cpu_usage = Math.floor(10 + Math.random() * 25);
      service.ram_usage = Number((1.2 + Math.random() * 0.8).toFixed(1));
    }

    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      'SERVER_POWER_ACTION',
      service.service_id,
      `Sent ${signal.toUpperCase()} to ${service.name} (${service.ip_address}:${service.port})`
    );

    res.json({
      message: `Server ${signal} signal sent successfully`,
      service,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Interactive Console Log Stream
router.get('/:id/console', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const service = db.services.find((s) => s.id === id && s.user_id === req.user.id);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const logs = [
    `[${new Date(Date.now() - 40000).toLocaleTimeString()}] [Server thread/INFO]: Starting minecraft server version 1.20.4`,
    `[${new Date(Date.now() - 35000).toLocaleTimeString()}] [Server thread/INFO]: Loading properties`,
    `[${new Date(Date.now() - 30000).toLocaleTimeString()}] [Server thread/INFO]: Default game type: SURVIVAL`,
    `[${new Date(Date.now() - 25000).toLocaleTimeString()}] [Server thread/INFO]: Generating keypair`,
    `[${new Date(Date.now() - 20000).toLocaleTimeString()}] [Server thread/INFO]: Starting Minecraft server on ${service.ip_address}:${service.port}`,
    `[${new Date(Date.now() - 15000).toLocaleTimeString()}] [Server thread/INFO]: Using epoll channel type`,
    `[${new Date(Date.now() - 10000).toLocaleTimeString()}] [Server thread/INFO]: Preparing level "world"`,
    `[${new Date(Date.now() - 5000).toLocaleTimeString()}] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld`,
    `[${new Date().toLocaleTimeString()}] [Server thread/INFO]: Done! Server live at ${service.ip_address}:${service.port}`
  ];

  res.json({ logs });
});

export default router;

