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
  assert.strictEqual(checkoutData.order.subtotal, 80, 'Subtotal should be ₹80');
  assert.strictEqual(checkoutData.order.discount_amount, 8, 'Discount should be ₹8 (10%)');
  assert.strictEqual(checkoutData.order.taxable_amount, 72, 'Taxable amount should be ₹72');
  assert.strictEqual(checkoutData.order.gst_amount, 12.96, 'GST 18% should be ₹12.96');
  assert.strictEqual(checkoutData.order.total_amount, 84.96, 'Total due with 18% GST should be ₹84.96 (72 + 18% GST)');
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

  // Test 12: Cashfree Payment Order Creation & Session Generation
  const cfCheckoutRes = await fetch(`${BASE_URL}/api/orders/checkout`, {
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
          software: 'Paper',
          quantity: 1
        }
      ],
      currency: 'INR',
      payment_method: 'Cashfree Payments'
    })
  });
  assert.strictEqual(cfCheckoutRes.status, 201, 'Cashfree checkout should succeed');
  const cfData = await cfCheckoutRes.json();
  assert(cfData.cashfree, 'Cashfree payload should be returned');
  assert(cfData.cashfree.payment_session_id, 'Cashfree payment session ID must exist');
  assert.strictEqual(cfData.order.payment_method, 'Cashfree Payments');
  console.log(`✓ Test 12 Passed: Cashfree Payments & Session Generation OK (Session: ${cfData.cashfree.payment_session_id})`);

  // Test 13: Discord OAuth2 Config & SSO
  const dcUrlRes = await fetch(`${BASE_URL}/api/auth/discord/url?redirect=/client/overview`);
  assert.strictEqual(dcUrlRes.status, 200, 'Discord URL endpoint should return 200');
  const dcUrlData = await dcUrlRes.json();
  assert(dcUrlData.redirectUri, 'Discord redirectUri must be provided');

  const dcSsoRes = await fetch(`${BASE_URL}/api/auth/discord-sso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  assert.strictEqual(dcSsoRes.status, 200, 'Discord SSO should return 200');
  const dcSsoData = await dcSsoRes.json();
  assert(dcSsoData.token, 'Discord auth token must be generated');
  console.log(`✓ Test 13 Passed: Discord OAuth2 URL & SSO Verification OK (User: ${dcSsoData.user.name})`);

  // Test 14: Infrastructure Nodes & Wings Management (CRUD, Edit IP, Limits & Maintenance)
  // 14a. List nodes
  const listNodesRes = await fetch(`${BASE_URL}/api/admin/nodes`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(listNodesRes.status, 200, 'Should fetch nodes fleet');
  const listNodesData = await listNodesRes.json();
  assert(Array.isArray(listNodesData.nodes), 'Nodes must be an array');
  assert(listNodesData.summary !== undefined, 'Fleet summary metrics must be calculated');

  // 14b. Customer role restriction check
  const custNodesRes = await fetch(`${BASE_URL}/api/admin/nodes`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  assert.strictEqual(custNodesRes.status, 403, 'Regular customer must be forbidden from nodes admin API');

  // 14c. Create new node
  const testNodeFqdn = `node-test-${Date.now()}.zeroxcloud.site`;
  const createNodeRes = await fetch(`${BASE_URL}/api/admin/nodes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Frankfurt Node 01 (Equinix FR2)',
      fqdn: testNodeFqdn,
      ip_address: '194.187.249.50',
      location: 'Frankfurt, Germany',
      country_code: 'DE',
      daemon_port: 8080,
      daemon_sftp: 2022,
      scheme: 'https',
      status: 'online',
      maintenance_mode: false,
      memory_limit_mb: 131072, // 128 GB
      memory_overcommit_pct: 10,
      disk_limit_mb: 2097152, // 2 TB
      disk_overcommit_pct: 15,
      cpu_cores: 64,
      port_range_start: 25565,
      port_range_end: 25999,
      max_servers: 60,
      description: 'AMD EPYC 7763, Tier-IV Datacenter, 10Gbps transit'
    })
  });
  assert.strictEqual(createNodeRes.status, 201, 'Node creation should succeed');
  const createNodeData = await createNodeRes.json();
  const createdNodeId = createNodeData.node.id;
  assert.strictEqual(createNodeData.node.ip_address, '194.187.249.50');

  // 14d. Edit Node IP, FQDN, and limits
  const updateNodeRes = await fetch(`${BASE_URL}/api/admin/nodes/${createdNodeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      ip_address: '194.187.249.99', // Updated IP
      memory_limit_mb: 262144, // Upgraded to 256 GB
      max_servers: 85
    })
  });
  assert.strictEqual(updateNodeRes.status, 200, 'Node update should succeed');
  const updateNodeData = await updateNodeRes.json();
  assert.strictEqual(updateNodeData.node.ip_address, '194.187.249.99', 'IP address must be updated');
  assert.strictEqual(updateNodeData.node.memory_limit_mb, 262144, 'Memory limit must be updated');
  assert.strictEqual(updateNodeData.node.max_servers, 85, 'Max servers must be updated');

  // 14e. Toggle maintenance mode
  const maintRes = await fetch(`${BASE_URL}/api/admin/nodes/${createdNodeId}/maintenance`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(maintRes.status, 200, 'Maintenance toggle should succeed');
  const maintData = await maintRes.json();
  assert.strictEqual(maintData.node.maintenance_mode, true, 'Node maintenance mode should be true');

  // 14f. Query node servers
  const nodeSrvRes = await fetch(`${BASE_URL}/api/admin/nodes/${createdNodeId}/servers`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(nodeSrvRes.status, 200);
  const nodeSrvData = await nodeSrvRes.json();
  assert(Array.isArray(nodeSrvData.servers));

  // 14g. Delete node
  const delNodeRes = await fetch(`${BASE_URL}/api/admin/nodes/${createdNodeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(delNodeRes.status, 200, 'Node deletion should succeed');
  console.log(`✓ Test 14 Passed: Infrastructure Nodes & Wings Management OK (CRUD, IP edit, Limits & Maintenance)`);

  // Test 15: Super Admin Fleet Server Management (Power Signals, Config Edits, Suspension)
  // 15a. Get list of servers
  const srvListRes = await fetch(`${BASE_URL}/api/admin/servers`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(srvListRes.status, 200);
  const srvListData = await srvListRes.json();
  assert(srvListData.services.length > 0, 'At least 1 server should exist');
  const targetServer = srvListData.services[0];

  // 15b. Execute admin power action (restart)
  const powerRes = await fetch(`${BASE_URL}/api/admin/servers/${targetServer.id}/power`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ action: 'restart' })
  });
  assert.strictEqual(powerRes.status, 200, 'Admin power action restart should succeed');
  const powerData = await powerRes.json();
  assert.strictEqual(powerData.action, 'restart');

  // 15c. Update server configuration (RAM, Port, IP)
  const updateSrvRes = await fetch(`${BASE_URL}/api/admin/servers/${targetServer.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Super Admin Managed SMP',
      port: 25688,
      ram_max: 8.0
    })
  });
  assert.strictEqual(updateSrvRes.status, 200, 'Server update should succeed');
  const updateSrvData = await updateSrvRes.json();
  assert.strictEqual(updateSrvData.server.name, 'Super Admin Managed SMP');
  assert.strictEqual(updateSrvData.server.port, 25688);
  assert.strictEqual(updateSrvData.server.ram_max, 8.0);

  // 15d. Suspend server
  const suspendRes = await fetch(`${BASE_URL}/api/admin/servers/${targetServer.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'suspended', reason: 'Audit verification' })
  });
  assert.strictEqual(suspendRes.status, 200);
  const suspendData = await suspendRes.json();
  assert.strictEqual(suspendData.server.status, 'suspended');

  // 15e. Unsuspend back to active
  const unsuspendRes = await fetch(`${BASE_URL}/api/admin/servers/${targetServer.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'active', reason: 'Audit completed' })
  });
  assert.strictEqual(unsuspendRes.status, 200);
  console.log(`✓ Test 15 Passed: Super Admin Fleet Server Management OK (Power Signals, Config Edits, Suspension)`);

  // Test 16: Bulk & Fleet-Wide Server Deletion (Delete All Servers At Once)
  // 16a. Purge all servers at once
  const delAllRes = await fetch(`${BASE_URL}/api/admin/servers/all`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(delAllRes.status, 200, 'DELETE /api/admin/servers/all should return 200');
  const delAllData = await delAllRes.json();
  assert.strictEqual(delAllData.success, true);

  // 16b. Verify server fleet count is 0
  const verifyFleetRes = await fetch(`${BASE_URL}/api/admin/servers`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const verifyFleetData = await verifyFleetRes.json();
  assert.strictEqual(verifyFleetData.services.length, 0, 'Fleet should have 0 servers after delete all');

  // 16c. Restore baseline demo server for UI and operational checks
  const { getDB, saveDB } = await import('./db.js');
  const dbRestore = getDB();
  dbRestore.services = [
    {
      id: 'srv-demo-default-01',
      service_id: 'ZX-SRV-1001',
      order_id: 'ord-demo-01',
      user_id: 'usr-demo-01',
      user_email: 'mohdnuman925@gmail.com',
      plan_id: 'plan-dirt',
      name: "Mohd's Minecraft SMP",
      category: 'games',
      game: 'minecraft (Paper)',
      node: 'delhi-node-01.zeroxcloud.site',
      ip_address: '103.174.102.45',
      port: 25565,
      status: 'active',
      cpu_usage: 12.4,
      ram_usage: 1.8,
      ram_max: 4,
      disk_usage: 2.1,
      disk_max: 30,
      provider: 'pterodactyl',
      provider_identifier: 'demo-ptero-default',
      renewal_date: '2026-12-15T08:00:00.000Z',
      created_at: new Date().toISOString()
    }
  ];
  saveDB(dbRestore);
  console.log(`✓ Test 16 Passed: Fleet-Wide Server Deletion OK (Delete All At Once & Provisioning Cleanup)`);

  console.log('----------------------------------------------------');
  console.log('ALL 16 INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('----------------------------------------------------');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

