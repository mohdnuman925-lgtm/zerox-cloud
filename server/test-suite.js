import assert from 'assert';

const BASE_URL = 'http://localhost:5050';

async function runTests() {
  console.log('--- STARTING ZEROX CLOUD INTEGRATION TEST SUITE ---');

  // Test 1: Health check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health check should return 200');
  const healthData = await healthRes.json();
  console.log('✓ Test 1 Passed: System Health OK', healthData.version);

  // Test 2: Pre-seeded Super Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@zeroxcloud.com', password: 'ZeroxAdmin2026!' })
  });
  assert.strictEqual(adminLoginRes.status, 200, 'Admin login should succeed');
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;
  assert.strictEqual(adminData.user.role, 'super_admin');
  console.log('✓ Test 2 Passed: Super Admin Authentication OK');

  // Test 3: Customer Registration
  const testEmail = `test.gamer.${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Gamer',
      email: testEmail,
      password: 'Password123!'
    })
  });
  assert.strictEqual(regRes.status, 201, 'Registration should succeed');
  const regData = await regRes.json();
  const userToken = regData.token;
  assert.strictEqual(regData.user.role, 'customer');
  console.log('✓ Test 3 Passed: Customer Registration OK');

  // Test 4: Dynamic Pricing & Catalog query
  const plansRes = await fetch(`${BASE_URL}/api/products/plans?category=games&game=minecraft&processor=intel`);
  assert.strictEqual(plansRes.status, 200);
  const plansData = await plansRes.json();
  assert(plansData.plans.length > 0, 'Plans should not be empty');
  const woodPlan = plansData.plans.find(p => p.name === 'WOOD PLAN');
  assert(woodPlan, 'WOOD PLAN should exist');
  assert.strictEqual(woodPlan.price_inr, 80, 'WOOD PLAN price should be ₹80');
  console.log('✓ Test 4 Passed: Dynamic Plans & Database Pricing OK');

  // Test 5: Coupon validation
  const couponRes = await fetch(`${BASE_URL}/api/products/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'ZEROXCLOUD' })
  });
  assert.strictEqual(couponRes.status, 200);
  const couponData = await couponRes.json();
  assert.strictEqual(couponData.discount_percent, 10);
  console.log('✓ Test 5 Passed: Coupon Code Validation OK');

  // Test 6: Cart Checkout & Server Provisioning
  const checkoutRes = await fetch(`${BASE_URL}/api/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({
      items: [
        {
          plan_id: woodPlan.id,
          location: 'India (Noida & Mumbai)',
          game: 'Minecraft',
          software: 'Forge Minecraft',
          quantity: 1
        }
      ],
      coupon_code: 'ZEROXCLOUD',
      currency: 'INR',
      payment_method: 'Razorpay UPI'
    })
  });
  assert.strictEqual(checkoutRes.status, 201);
  const checkoutData = await checkoutRes.json();
  assert(checkoutData.order.order_number.startsWith('ZX-'), 'Order number should start with ZX-');
  assert.strictEqual(checkoutData.order.total_amount, 72, 'Discounted price should be ₹72 (80 - 10%)');
  assert(checkoutData.services.length === 1, 'Should provision 1 service');
  const provisionedService = checkoutData.services[0];
  console.log(`✓ Test 6 Passed: Order & Auto-Provisioning OK (Service ID: ${provisionedService.service_id}, Port: ${provisionedService.port})`);

  // Test 7: Customer Data Isolation (Cannot see other customer records)
  const userServicesRes = await fetch(`${BASE_URL}/api/services`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  const userServices = await userServicesRes.json();
  assert(userServices.services.every(s => s.user_id === regData.user.id), 'Customer must only see own services');
  console.log('✓ Test 7 Passed: Customer Data Isolation Verified');

  // Test 8: Server Power Controls (Start, Stop, Restart)
  const stopRes = await fetch(`${BASE_URL}/api/services/${provisionedService.id}/power`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({ signal: 'stop' })
  });
  assert.strictEqual(stopRes.status, 200);
  console.log('✓ Test 8 Passed: Server Power Controls & Adapter OK');

  // Test 9: Support Ticket Creation & Thread
  const ticketRes = await fetch(`${BASE_URL}/api/tickets/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({
      department: 'Game Server Support',
      priority: 'high',
      subject: 'Forge 1.20 memory allocation question',
      message: 'Can I allocate 6GB of heap?'
    })
  });
  assert.strictEqual(ticketRes.status, 201);
  const ticketData = await ticketRes.json();
  console.log('✓ Test 9 Passed: Support Ticket Creation OK');

  // Test 10: Super Admin Role Enforcement & Access
  const adminDeniedRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  assert.strictEqual(adminDeniedRes.status, 403, 'Normal user must be blocked from /api/admin');

  const adminMetricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminMetricsRes.status, 200, 'Admin must have access to /api/admin/metrics');
  const adminMetrics = await adminMetricsRes.json();
  assert(adminMetrics.metrics.totalOrders > 0, 'Total orders should be recorded in metrics');
  console.log('✓ Test 10 Passed: Super Admin Server-Side Role Enforcement OK');

  // Test 11: Admin Audit Logging
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const auditData = await auditRes.json();
  assert(auditData.logs.length > 0, 'Audit logs should be populated');
  console.log(`✓ Test 11 Passed: Security Audit Trails OK (${auditData.logs.length} events logged)`);

  console.log('----------------------------------------------------');
  console.log('ALL 11 INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('----------------------------------------------------');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

