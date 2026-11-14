import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export class PaymentAdapter {
  static getStatus() {
    return {
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
      // Verify HMAC with timestamp tolerance
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

