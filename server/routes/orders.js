import express from 'express';
import { getDB, saveDB, logAudit } from '../db.js';
import { authenticateToken } from './auth.js';
import { PterodactylAdapter } from '../providers/pterodactylAdapter.js';
import { PaymentAdapter } from '../providers/paymentAdapters.js';

const router = express.Router();

// Get Current User Orders
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const userOrders = db.orders.filter((o) => o.user_id === req.user.id);
  res.json({ orders: userOrders });
});

// Checkout & Create Order
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const { items, coupon_code, currency = 'INR', payment_method = 'Razorpay' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }

    const db = getDB();

    // 1. Re-validate each item and calculate verified total from database plans
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const plan = db.plans.find((p) => p.id === item.plan_id && p.enabled);
      if (!plan) {
        return res.status(400).json({ error: `Selected plan (${item.plan_name || item.plan_id}) is no longer available` });
      }

      const unitPrice = currency === 'USD' ? Number(plan.price_usd) : Number(plan.price_inr);
      calculatedSubtotal += unitPrice * (item.quantity || 1);

      validatedItems.push({
        plan_id: plan.id,
        plan_name: plan.name,
        category: plan.category,
        processor: plan.processor || 'standard',
        location: item.location || plan.location,
        game: item.game || plan.game_slug || 'Minecraft',
        software: item.software || item.instance_type || 'Paper',
        price: unitPrice,
        quantity: item.quantity || 1
      });
    }

    // 2. Validate Coupon Discount & 18% GST Calculation
    let discountAmount = 0;
    let appliedCoupon = null;
    if (coupon_code) {
      appliedCoupon = db.coupons.find(
        (c) => c.code.toUpperCase() === coupon_code.trim().toUpperCase() && c.enabled
      );
      if (appliedCoupon) {
        discountAmount = (calculatedSubtotal * appliedCoupon.discount_percent) / 100;
        appliedCoupon.current_uses += 1;
      }
    }

    const GST_RATE = 0.18; // 18% standard GST
    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const gstAmount = Number((taxableAmount * GST_RATE).toFixed(2));
    const totalAmount = Number((taxableAmount + gstAmount).toFixed(2));

    // 3. Create Order Record
    const orderNumber = 'ZX-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ord-' + Date.now();

    let cashfreeData = null;
    if (payment_method && payment_method.toLowerCase().includes('cashfree')) {
      cashfreeData = await PaymentAdapter.createCashfreeOrder({
        orderId: orderNumber,
        amount: totalAmount,
        currency,
        user: req.user,
        returnUrl: `${req.headers.origin || 'https://zeroxcloud.site'}/checkout?order_id=${orderNumber}`
      });
    }

    const newOrder = {
      id: orderId,
      order_number: orderNumber,
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      subtotal: Number(calculatedSubtotal.toFixed(2)),
      discount_amount: Number(discountAmount.toFixed(2)),
      taxable_amount: Number(taxableAmount.toFixed(2)),
      gst_rate: 18,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      currency,
      status: 'paid', // Instant demo verification or live gateway callback
      payment_method,
      payment_id: cashfreeData?.cf_order_id || 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      payment_session_id: cashfreeData?.payment_session_id || null,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      gstin: req.body.gstin ? req.body.gstin.trim().toUpperCase() : null,
      items: validatedItems,
      created_at: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // 4. Create Invoice with 18% GST Breakdown (CGST 9% + SGST 9% / IGST 18%)
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newInvoice = {
      id: 'inv-' + Date.now(),
      invoice_number: invoiceNumber,
      order_id: orderId,
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      amount: Number(calculatedSubtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      taxable_amount: Number(taxableAmount.toFixed(2)),
      tax: gstAmount,
      gst_rate: 18,
      cgst: Number((gstAmount / 2).toFixed(2)),
      sgst: Number((gstAmount / 2).toFixed(2)),
      total: totalAmount,
      currency,
      status: 'paid',
      gstin: req.body.gstin ? req.body.gstin.trim().toUpperCase() : null,
      items: validatedItems.map((vi) => ({
        description: `${vi.plan_name} (${vi.game || vi.category}) - 1 Month`,
        amount: vi.price * vi.quantity
      })),
      created_at: new Date().toISOString()
    };
    db.invoices.unshift(newInvoice);

    // 5. Automated Server Provisioning
    const createdServices = [];
    for (const item of validatedItems) {
      const plan = db.plans.find((p) => p.id === item.plan_id);
      const serviceId = 'ZX-SRV-' + Math.floor(1000 + Math.random() * 9000);

      // Provision via Pterodactyl Adapter
      const provResult = await PterodactylAdapter.provisionServer({
        plan,
        user: req.user,
        location: item.location,
        game: item.game,
        software: item.software
      });

      const renewal = new Date();
      renewal.setDate(renewal.getDate() + 30);

      const serviceRecord = {
        id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        service_id: serviceId,
        order_id: orderId,
        user_id: req.user.id,
        user_email: req.user.email,
        plan_id: item.plan_id,
        name: `${req.user.name.split(' ')[0]}'s ${item.game || item.plan_name}`,
        category: item.category,
        game: `${item.game} (${item.software})`,
        node: provResult.node || 'delhi-node-01.zeroxcloud.site',
        ip_address: provResult.ip_address || '103.174.102.45',
        port: provResult.port || 25565,
        status: provResult.status || 'active',
        cpu_usage: 0.0,
        ram_usage: 0.1,
        ram_max: parseFloat(plan.ram) || 4.0,
        disk_usage: 0.5,
        disk_max: parseFloat(plan.storage) || 30.0,
        provider: 'pterodactyl',
        provider_identifier: provResult.provider_identifier,
        renewal_date: renewal.toISOString(),
        created_at: new Date().toISOString()
      };

      db.services.unshift(serviceRecord);
      createdServices.push(serviceRecord);

      // Create Provisioning Job Log
      db.provisioning_jobs.unshift({
        id: 'job-' + Date.now(),
        service_id: serviceRecord.id,
        user_id: req.user.id,
        status: 'completed',
        attempts: 1,
        logs: `Allocated IP ${serviceRecord.ip_address}:${serviceRecord.port}. Node: ${serviceRecord.node}. Adapter mode: ${provResult.mode}`,
        created_at: new Date().toISOString()
      });
    }

    saveDB(db);

    logAudit(
      req.user.name,
      req.user.role,
      'CREATE_ORDER_AND_PROVISION',
      orderId,
      `Order ${orderNumber} created. Total: ${currency} ${totalAmount}. Services: ${createdServices.length}`
    );

    res.status(201).json({
      message: 'Order placed and servers provisioned successfully',
      order: newOrder,
      invoice: newInvoice,
      services: createdServices,
      cashfree: cashfreeData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Cashfree Payment Status
router.post('/cashfree/verify', authenticateToken, async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const verification = await PaymentAdapter.verifyCashfreeOrder(order_id);
    const db = getDB();
    const order = db.orders.find((o) => (o.order_number === order_id || o.id === order_id) && o.user_id === req.user.id);

    if (order && verification.verified) {
      order.status = 'paid';
      saveDB(db);
      logAudit(req.user.name, req.user.role, 'CASHFREE_PAYMENT_VERIFIED', order.id, `Cashfree payment verified for order ${order_id}`);
    }

    res.json({
      verified: verification.verified,
      status: verification.status || (verification.verified ? 'PAID' : 'PENDING'),
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cashfree Server-to-Server Webhook
router.post('/cashfree/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = JSON.stringify(req.body);

    const isValid = PaymentAdapter.verifyCashfreeWebhook({ rawBody, timestamp, signature });

    if (!isValid.verified) {
      return res.status(400).json({ error: 'Invalid Cashfree webhook signature' });
    }

    const event = req.body;
    const orderId = event.data?.order?.order_id;

    if (orderId) {
      const db = getDB();
      const order = db.orders.find((o) => o.order_number === orderId);
      if (order) {
        order.status = 'paid';
        saveDB(db);
        logAudit('Cashfree Webhook', 'system', 'CASHFREE_WEBHOOK_PAID', order.id, `Order ${orderId} marked paid via Cashfree Webhook`);
      }
    }

    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

