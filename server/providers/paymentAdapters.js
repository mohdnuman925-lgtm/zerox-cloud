import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Cashfree PG Configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2023-08-01';

const CASHFREE_BASE_URL = (CASHFREE_ENV === 'PRODUCTION' || CASHFREE_ENV === 'PROD')
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export class PaymentAdapter {
  static getStatus() {
    return {
      cashfree: {
        configured: Boolean(CASHFREE_APP_ID && CASHFREE_SECRET_KEY),
        app_id: CASHFREE_APP_ID ? `${CASHFREE_APP_ID.substring(0, 6)}...` : null,
        environment: CASHFREE_ENV
      },
      razorpay: {
        configured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
        key_id: RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 8)}...` : null
      },
      stripe: {
        configured: Boolean(STRIPE_SECRET_KEY),
        publishable: Boolean(STRIPE_SECRET_KEY)
      }
    };
  }

  /**
   * Create Cashfree PG Order Transaction
   */
  static async createCashfreeOrder({ orderId, amount, currency = 'INR', user, returnUrl, notifyUrl }) {
    const isConfigured = Boolean(CASHFREE_APP_ID && CASHFREE_SECRET_KEY);

    if (isConfigured) {
      try {
        const payload = {
          order_id: String(orderId),
          order_amount: Number(amount.toFixed(2)),
          order_currency: currency,
          customer_details: {
            customer_id: String(user.id || `cust_${Date.now()}`),
            customer_name: user.name || 'Customer',
            customer_email: user.email || 'billing@zeroxcloud.com',
            customer_phone: user.phone || '9999999999'
          },
          order_meta: {
            return_url: returnUrl || `https://zeroxcloud.site/checkout?order_id=${orderId}`,
            notify_url: notifyUrl || `https://zeroxcloud.site/api/billing/cashfree/webhook`,
            payment_methods: 'cc,dc,upi,nb'
          },
          order_note: `ZEROX CLOUD Order ${orderId}`
        };

        const res = await fetch(`${CASHFREE_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET_KEY,
            'x-api-version': CASHFREE_API_VERSION,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.payment_session_id) {
          return {
            mode: 'live',
            provider: 'cashfree',
            environment: CASHFREE_ENV,
            order_id: data.order_id,
            cf_order_id: data.cf_order_id,
            payment_session_id: data.payment_session_id,
            order_status: data.order_status,
            amount: data.order_amount,
            currency: data.order_currency
          };
        } else {
          console.error('Cashfree Live Order Error:', data);
        }
      } catch (err) {
        console.error('Cashfree API request failed:', err.message);
      }
    }

    // Seamless Sandbox / Simulation Mode with explicit watermark
    return {
      mode: 'sandbox_demo',
      provider: 'cashfree',
      environment: CASHFREE_ENV,
      order_id: orderId,
      cf_order_id: 'cf_demo_' + Date.now(),
      payment_session_id: 'session_demo_cf_' + Math.random().toString(36).substring(2, 9),
      order_status: 'ACTIVE',
      amount,
      currency,
      demo_transaction_id: 'cf_txn_' + Date.now(),
      message: 'Cashfree demo mode active. Add CASHFREE_APP_ID & CASHFREE_SECRET_KEY in .env for live gateway.'
    };
  }

  /**
   * Verify Cashfree Order Status via REST API
   */
  static async verifyCashfreeOrder(orderId) {
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return { verified: true, mode: 'sandbox_demo', status: 'PAID' };
    }

    try {
      const res = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': CASHFREE_API_VERSION
        }
      });
      const data = await res.json();
      const isPaid = data.order_status === 'PAID';
      return { verified: isPaid, mode: 'live', status: data.order_status, data };
    } catch (err) {
      console.error('Cashfree Verification Error:', err.message);
      return { verified: false, error: err.message };
    }
  }

  /**
   * Verify Cashfree Webhook Signature
   */
  static verifyCashfreeWebhook({ rawBody, timestamp, signature }) {
    if (!CASHFREE_SECRET_KEY) {
      return { verified: true, mode: 'sandbox_demo' };
    }

    try {
      const dataToSign = timestamp + rawBody;
      const expectedSignature = crypto
        .createHmac('sha256', CASHFREE_SECRET_KEY)
        .update(dataToSign)
        .digest('base64');

      return { verified: expectedSignature === signature, mode: 'live' };
    } catch (err) {
      return { verified: false, error: err.message };
    }
  }

  /**
   * Create checkout transaction for client
   */
  static async createOrderTransaction({ orderId, amount, currency, user }) {
    const isRzpConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
    const isStripeConfigured = Boolean(STRIPE_SECRET_KEY);

    if (currency === 'INR' && isRzpConfigured) {
      // Live Razorpay API call
      try {
        const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // in paise
            currency: 'INR',
            receipt: `rcpt_${orderId}`,
            notes: { orderId, userId: user.id }
          })
        });
        const rzpData = await res.json();
        return {
          mode: 'live',
          provider: 'razorpay',
          razorpay_order_id: rzpData.id,
          key_id: RAZORPAY_KEY_ID,
          amount: rzpData.amount,
          currency: 'INR'
        };
      } catch (err) {
        console.error('Razorpay order creation error:', err);
      }
    }

    // Secure Sandbox / Simulation Mode with explicit watermark
    return {
      mode: 'sandbox_demo',
      provider: currency === 'INR' ? 'razorpay_demo' : 'stripe_demo',
      order_id: orderId,
      amount,
      currency,
      demo_transaction_id: 'demo_txn_' + Date.now(),
      message: 'Payment simulation enabled. Configure RAZORPAY_KEY_ID & SECRET in .env for live gateway.'
    };
  }

  /**
   * Verify Razorpay Payment Signature on server
   */
  static verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!RAZORPAY_KEY_SECRET) {
      // Demo validation
      return { verified: true, mode: 'sandbox_demo' };
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;
    return { verified: isValid, mode: 'live' };
  }

  /**
   * Verify Stripe Webhook Signature
   */
  static verifyStripeWebhook({ payload, signatureHeader }) {
    if (!STRIPE_WEBHOOK_SECRET) {
      return { verified: false, error: 'STRIPE_WEBHOOK_SECRET is not configured' };
    }

    try {
      const parts = signatureHeader.split(',').reduce((acc, part) => {
        const [key, val] = part.split('=');
        acc[key.trim()] = val.trim();
        return acc;
      }, {});

      const timestamp = parts.t;
      const signature = parts.v1;
      const signedPayload = `${timestamp}.${payload}`;
      const expected = crypto
        .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest('hex');

      return { verified: expected === signature, mode: 'live' };
    } catch (err) {
      return { verified: false, error: err.message };
    }
  }
}


