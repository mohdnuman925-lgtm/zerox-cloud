import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const SEED_FILE = path.join(__dirname, 'data', 'db.json');
const RUNTIME_DB_FILE = isServerless ? path.join('/tmp', 'zerox_db.json') : SEED_FILE;

let memoryDB = null;

const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('ZeroxAdmin2026!', salt);
  const userPasswordHash = bcrypt.hashSync('Password123!', salt);

  return {
    profiles: [
      {
        id: 'usr-admin-01',
        name: 'Super Admin',
        email: 'admin@zeroxcloud.com',
        password_hash: adminPasswordHash,
        role: 'super_admin',
        panel_password: 'Ptero_Admin_2026!',
        status: 'active',
        created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      },
      {
        id: 'usr-demo-01',
        name: 'Mohd Numan',
        email: 'mohdnuman925@gmail.com',
        password_hash: userPasswordHash,
        role: 'customer',
        panel_password: 'Ptero_User_2026!',
        status: 'active',
        created_at: new Date('2026-11-14T07:15:00Z').toISOString(),
      }
    ],
    product_categories: [
      { id: 'cat-games', name: 'Game Server Hosting', slug: 'games', enabled: true, icon: 'Gamepad2', sort_order: 1 },
      { id: 'cat-cloud', name: 'Cloud / VPS Hosting', slug: 'cloud', enabled: true, icon: 'Cloud', sort_order: 2 },
      { id: 'cat-dedicated', name: 'Dedicated Servers', slug: 'dedicated', enabled: true, icon: 'Server', sort_order: 3 },
      { id: 'cat-web', name: 'Web Hosting', slug: 'web', enabled: true, icon: 'Globe', sort_order: 4 },
      { id: 'cat-bots', name: 'Discord Bot Hosting', slug: 'discord-bots', enabled: true, icon: 'Bot', sort_order: 5 }
    ],
    games: [
      { id: 'gm-minecraft', name: 'Minecraft', slug: 'minecraft', featured: true, image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80', description: 'Paper, Purpur, Forge, Fabric, Vanilla, Bedrock' },
      { id: 'gm-rust', name: 'Rust', slug: 'rust', featured: true, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', description: 'Oxide / uMod high-tick survival' },
      { id: 'gm-cs2', name: 'Counter-Strike 2', slug: 'cs2', featured: true, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80', description: '128 tickrate competitive esports servers' },
      { id: 'gm-ark', name: 'ARK: Survival Evolved', slug: 'ark', featured: false, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80', description: 'Crossplay cluster support' }
    ],
    plans: [
      // Game Servers - Intel Xeon & AMD EPYC
      {
        id: 'plan-dirt',
        product_id: 'prod-mc-dirt',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'intel',
        name: 'DIRT PLAN',
        tag: 'GAMES',
        badge: '',
        price_inr: 40.00,
        price_usd: 0.50,
        ram: '2 GB',
        cpu: '100% CPU',
        storage: '20 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations', 'Full SFTP & MySQL'],
        sort_order: 1,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-wood',
        product_id: 'prod-mc-wood',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'intel',
        name: 'WOOD PLAN',
        tag: 'GAMES',
        badge: 'MOST SOLD',
        price_inr: 80.00,
        price_usd: 1.00,
        ram: '4 GB',
        cpu: '200% CPU',
        storage: '30 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations', 'Full SFTP & MySQL'],
        sort_order: 2,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-stone',
        product_id: 'prod-mc-stone',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'intel',
        name: 'STONE PLAN',
        tag: 'GAMES',
        badge: '',
        price_inr: 120.00,
        price_usd: 1.50,
        ram: '6 GB',
        cpu: '300% CPU',
        storage: '40 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations', 'Full SFTP & MySQL'],
        sort_order: 3,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-coal',
        product_id: 'prod-mc-coal',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'intel',
        name: 'COAL PLAN',
        tag: 'GAMES',
        badge: '',
        price_inr: 160.00,
        price_usd: 2.00,
        ram: '8 GB',
        cpu: '400% CPU',
        storage: '50 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations', 'Full SFTP & MySQL'],
        sort_order: 4,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-lapis',
        product_id: 'prod-mc-lapis',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'amd',
        name: 'LAPIS PLAN',
        tag: 'GAMES',
        badge: '',
        price_inr: 240.00,
        price_usd: 3.00,
        ram: '10 GB',
        cpu: '450% CPU',
        storage: '60 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['AMD EPYC 7C13 cores', 'Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations'],
        sort_order: 5,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-gold',
        product_id: 'prod-mc-gold',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'amd',
        name: 'GOLD PLAN',
        tag: 'GAMES',
        badge: '',
        price_inr: 300.00,
        price_usd: 3.75,
        ram: '12 GB',
        cpu: '500% CPU',
        storage: '70 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['AMD EPYC 7C13 cores', 'Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations'],
        sort_order: 6,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-redstone',
        product_id: 'prod-mc-redstone',
        category: 'games',
        game_slug: 'minecraft',
        processor: 'amd',
        name: 'REDSTONE PLAN',
        tag: 'GAMES',
        badge: 'LIMITED STOCK',
        price_inr: 360.00,
        price_usd: 4.50,
        ram: '16 GB',
        cpu: '600% CPU',
        storage: '90 GB NVMe',
        location: 'India (Noida & Mumbai)',
        features: ['AMD EPYC 7C13 cores', 'Instant deployment', 'DDoS protection', '24/7 support', 'Custom configurations'],
        sort_order: 7,
        enabled: true,
        stock_status: 'limited'
      },
      // Cloud / VPS Plans
      {
        id: 'plan-vps-1',
        product_id: 'prod-vps-1',
        category: 'cloud',
        name: 'CLOUD VPS-01',
        tag: 'CLOUD',
        badge: '',
        price_inr: 450.00,
        price_usd: 5.50,
        ram: '4 GB DDR4',
        cpu: '2 vCPU Cores',
        storage: '60 GB NVMe SSD',
        bandwidth: '5 TB Bandwidth @ 1Gbps',
        location: 'Mumbai, India',
        features: ['Full Root Access', 'Dedicated IPv4 + IPv6', 'Sub-15ms Latency', 'Choice of Ubuntu/Debian/Alma/Windows', 'DDoS Mitigation'],
        sort_order: 1,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-vps-2',
        product_id: 'prod-vps-2',
        category: 'cloud',
        name: 'CLOUD VPS-02',
        tag: 'CLOUD',
        badge: 'RECOMMENDED',
        price_inr: 890.00,
        price_usd: 11.00,
        ram: '8 GB DDR4',
        cpu: '4 vCPU Cores',
        storage: '120 GB NVMe SSD',
        bandwidth: '10 TB Bandwidth @ 1Gbps',
        location: 'Noida, India',
        features: ['Full Root Access', 'Dedicated IPv4 + IPv6', 'Sub-15ms Latency', 'Choice of OS', 'Automated Daily Backups'],
        sort_order: 2,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-vps-3',
        product_id: 'prod-vps-3',
        category: 'cloud',
        name: 'CLOUD VPS-03',
        tag: 'CLOUD',
        badge: '',
        price_inr: 1690.00,
        price_usd: 21.00,
        ram: '16 GB DDR4',
        cpu: '8 vCPU Cores',
        storage: '240 GB NVMe SSD',
        bandwidth: '20 TB Bandwidth @ 10Gbps',
        location: 'Singapore, Asia',
        features: ['Full Root Access', 'Dedicated IPv4 + IPv6', 'Sub-15ms Latency', 'BGP Optimized Routing', 'DDoS Protection'],
        sort_order: 3,
        enabled: true,
        stock_status: 'in_stock'
      },
      // Dedicated Server Plans
      {
        id: 'plan-dedi-1',
        product_id: 'prod-dedi-1',
        category: 'dedicated',
        name: 'ENTERPRISE INTEL E-2388G',
        tag: 'DEDICATED',
        badge: '',
        price_inr: 6499.00,
        price_usd: 79.00,
        ram: '64 GB DDR4 ECC',
        cpu: '8 Cores / 16 Threads @ 5.1GHz',
        storage: '2x 1TB NVMe PCIe Gen4',
        bandwidth: '1 Gbps Unmetered',
        location: 'Mumbai Datacenter',
        features: ['100% Dedicated Hardware', 'IPMI / iDRAC remote console', 'Clean IPv4 Subnet (/29)', 'Tier-3 Datacenter SLA'],
        sort_order: 1,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-dedi-2',
        product_id: 'prod-dedi-2',
        category: 'dedicated',
        name: 'TITAN AMD RYZEN 9 7950X',
        tag: 'DEDICATED',
        badge: 'ULTRA PERFORMANCE',
        price_inr: 11999.00,
        price_usd: 145.00,
        ram: '128 GB DDR5 5200MHz',
        cpu: '16 Cores / 32 Threads @ 5.7GHz',
        storage: '2x 2TB NVMe PCIe Gen4',
        bandwidth: '10 Gbps Burst Unmetered',
        location: 'Noida Datacenter',
        features: ['Peak Single-Thread Speeds', 'Hardware RAID available', 'IPMI / KVM Included', 'Custom BGP Announce'],
        sort_order: 2,
        enabled: true,
        stock_status: 'in_stock'
      },
      // Web Hosting Plans
      {
        id: 'plan-web-1',
        product_id: 'prod-web-1',
        category: 'web',
        name: 'STARTER WEB',
        tag: 'WEB',
        badge: '',
        price_inr: 99.00,
        price_usd: 1.25,
        ram: '1 GB Cloud RAM',
        cpu: '1 Core CPU',
        storage: '10 GB NVMe Storage',
        bandwidth: 'Unlimited Bandwidth',
        location: 'India Fast Edge',
        features: ['Host 1 Website', 'Free Wildcard SSL', '5 Professional Emails', 'Daily Backups', 'cPanel / DirectAdmin'],
        sort_order: 1,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-web-2',
        product_id: 'prod-web-2',
        category: 'web',
        name: 'BUSINESS WEB PRO',
        tag: 'WEB',
        badge: 'POPULAR',
        price_inr: 249.00,
        price_usd: 3.10,
        ram: '4 GB Cloud RAM',
        cpu: '2 Core CPU',
        storage: '50 GB NVMe Storage',
        bandwidth: 'Unlimited Bandwidth',
        location: 'India Fast Edge',
        features: ['Unlimited Websites', 'Free Wildcard SSL', 'Unlimited Business Emails', 'Real-time Malware Scanner', 'WordPress 1-Click'],
        sort_order: 2,
        enabled: true,
        stock_status: 'in_stock'
      },
      // Discord Bot Hosting Plans
      {
        id: 'plan-bot-1',
        product_id: 'prod-bot-1',
        category: 'discord-bots',
        name: 'BOT SPARK',
        tag: 'BOTS',
        badge: '',
        price_inr: 49.00,
        price_usd: 0.60,
        ram: '1 GB Dedicated RAM',
        cpu: '100% CPU',
        storage: '5 GB NVMe',
        bandwidth: 'Always On 24/7',
        location: 'India Edge',
        features: ['Node.js, Python, Java, Go', 'Git Integration', 'Automatic Restarts on Crash', 'Real-time Console Logs'],
        sort_order: 1,
        enabled: true,
        stock_status: 'in_stock'
      },
      {
        id: 'plan-bot-2',
        product_id: 'prod-bot-2',
        category: 'discord-bots',
        name: 'BOT TITAN CLUSTER',
        tag: 'BOTS',
        badge: 'HEAVY BOT',
        price_inr: 149.00,
        price_usd: 1.80,
        ram: '4 GB Dedicated RAM',
        cpu: '250% CPU',
        storage: '20 GB NVMe',
        bandwidth: 'Always On 24/7',
        location: 'India Edge',
        features: ['Sharded Bot Ready', 'Postgres/Redis addon ready', 'Fast WebSocket Latency to Discord API', '24/7 Monitored'],
        sort_order: 2,
        enabled: true,
        stock_status: 'in_stock'
      }
    ],
    coupons: [
      {
        id: 'cpn-01',
        code: 'ZEROXCLOUD',
        discount_percent: 10,
        description: 'Welcome Offer: 10% OFF for new users',
        max_uses: 1000,
        current_uses: 12,
        valid_until: '2028-12-31T23:59:59Z',
        enabled: true
      },
      {
        id: 'cpn-02',
        code: 'LAUNCH20',
        discount_percent: 20,
        description: 'Launch Celebration 20% Discount',
        max_uses: 500,
        current_uses: 48,
        valid_until: '2027-12-31T23:59:59Z',
        enabled: true
      }
    ],
    orders: [
      {
        id: 'ord-1001',
        order_number: 'ZX-84920',
        user_id: 'usr-demo-01',
        user_name: 'Mohd Numan',
        user_email: 'mohdnuman925@gmail.com',
        total_amount: 80.00,
        currency: 'INR',
        status: 'paid',
        payment_method: 'Razorpay UPI',
        payment_id: 'pay_rzp_mock_84920',
        items: [
          {
            plan_id: 'plan-wood',
            plan_name: 'WOOD PLAN',
            category: 'games',
            game_slug: 'minecraft',
            instance_type: 'Forge Minecraft',
            location: 'India (Noida & Mumbai)',
            price: 80.00,
            quantity: 1
          }
        ],
        created_at: new Date('2026-11-14T07:20:00Z').toISOString()
      }
    ],
    services: [
      {
        id: 'srv-1001',
        service_id: 'ZX-SRV-4821',
        order_id: 'ord-1001',
        user_id: 'usr-demo-01',
        user_email: 'mohdnuman925@gmail.com',
        plan_id: 'plan-wood',
        name: 'Mohd Minecraft SMP',
        category: 'games',
        game: 'Minecraft (Forge 1.20.4)',
        node: 'delhi-node-01.zeroxcloud.com',
        ip_address: '103.174.102.45',
        port: 25565,
        status: 'active',
        cpu_usage: 14.5,
        ram_usage: 1.8,
        ram_max: 4.0,
        disk_usage: 6.2,
        disk_max: 30.0,
        provider: 'pterodactyl',
        provider_identifier: 'pter_srv_4821',
        renewal_date: '2026-12-14T07:20:00Z',
        created_at: new Date('2026-11-14T07:22:00Z').toISOString()
      }
    ],
    provisioning_jobs: [
      {
        id: 'job-1001',
        service_id: 'srv-1001',
        user_id: 'usr-demo-01',
        status: 'completed',
        attempts: 1,
        logs: 'Server initialized in Node delhi-node-01. Port 25565 assigned. Docker container spun up successfully.',
        created_at: new Date('2026-11-14T07:20:30Z').toISOString()
      }
    ],
    payments: [
      {
        id: 'pay-1001',
        order_id: 'ord-1001',
        user_id: 'usr-demo-01',
        amount: 80.00,
        currency: 'INR',
        provider: 'razorpay',
        provider_payment_id: 'pay_rzp_mock_84920',
        status: 'verified',
        created_at: new Date('2026-11-14T07:21:00Z').toISOString()
      }
    ],
    invoices: [
      {
        id: 'inv-1001',
        invoice_number: 'INV-2026-0042',
        order_id: 'ord-1001',
        user_id: 'usr-demo-01',
        user_name: 'Mohd Numan',
        user_email: 'mohdnuman925@gmail.com',
        amount: 80.00,
        tax: 0.00,
        total: 80.00,
        currency: 'INR',
        status: 'paid',
        items: [
          { description: 'WOOD PLAN - Minecraft Server Hosting (1 Month)', amount: 80.00 }
        ],
        created_at: new Date('2026-11-14T07:21:05Z').toISOString()
      }
    ],
    support_tickets: [
      {
        id: 'tkt-1001',
        ticket_number: 'TKT-9302',
        user_id: 'usr-demo-01',
        user_name: 'Mohd Numan',
        user_email: 'mohdnuman925@gmail.com',
        department: 'Game Server Support',
        priority: 'medium',
        subject: 'Custom Forge Modpack Installation Help',
        status: 'open',
        created_at: new Date('2026-11-14T07:30:00Z').toISOString(),
        updated_at: new Date('2026-11-14T07:30:00Z').toISOString()
      }
    ],
    ticket_messages: [
      {
        id: 'msg-1001',
        ticket_id: 'tkt-1001',
        sender_id: 'usr-demo-01',
        sender_name: 'Mohd Numan',
        sender_role: 'customer',
        message: 'Hello, I uploaded my custom mods to /mods via SFTP, can you confirm if my Java 17 flag is set correctly in startup?',
        is_internal: false,
        created_at: new Date('2026-11-14T07:30:00Z').toISOString()
      }
    ],
    website_settings: {
      site_name: 'ZEROX CLOUD',
      logo_text: 'ZEROX CLOUD',
      hero_title: 'Global cloud & game server hosting.',
      hero_subtitle: 'Experience lightning-fast performance, unbeatable reliability, and 24/7 support for all your favorite games.',
      announcement_text: 'ALL SYSTEMS OPERATIONAL',
      welcome_modal_enabled: true,
      welcome_discount_percent: 10,
      welcome_coupon_code: 'ZEROXCLOUD',
      discord_url: 'https://discord.gg/zeroxcloud',
      pterodactyl_panel_url: 'https://portal.zeroxcloud.com',
      contact_email: 'support@zeroxcloud.com',
      currency_default: 'INR',
      tax_rate: 0.0,
      maintenance_mode: false
    },
    audit_logs: [
      {
        id: 'log-1001',
        actor_name: 'System Provisioner',
        actor_role: 'system',
        action: 'PROVISION_SERVICE_SUCCESS',
        target: 'srv-1001',
        details: 'Service ZX-SRV-4821 automatically provisioned upon payment verification',
        timestamp: new Date('2026-11-14T07:22:00Z').toISOString()
      }
    ]
  };
};

export const getDB = () => {
  if (memoryDB) {
    return memoryDB;
  }

  try {
    if (fs.existsSync(RUNTIME_DB_FILE)) {
      const raw = fs.readFileSync(RUNTIME_DB_FILE, 'utf-8');
      memoryDB = JSON.parse(raw);
      return memoryDB;
    }

    // If runtime file does not exist, check seed file
    if (SEED_FILE !== RUNTIME_DB_FILE && fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf-8');
      memoryDB = JSON.parse(raw);
      try {
        fs.mkdirSync(path.dirname(RUNTIME_DB_FILE), { recursive: true });
        fs.writeFileSync(RUNTIME_DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf-8');
      } catch (writeErr) {
        // Safe fallback in read-only environment
      }
      return memoryDB;
    }

    // Default to initial data
    memoryDB = getInitialData();
    try {
      fs.mkdirSync(path.dirname(RUNTIME_DB_FILE), { recursive: true });
      fs.writeFileSync(RUNTIME_DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf-8');
    } catch (writeErr) {
      // Safe fallback in read-only environment
    }
    return memoryDB;
  } catch (error) {
    console.error('Error initializing database:', error);
    memoryDB = getInitialData();
    return memoryDB;
  }
};

export const saveDB = (data) => {
  memoryDB = data;
  try {
    fs.mkdirSync(path.dirname(RUNTIME_DB_FILE), { recursive: true });
    fs.writeFileSync(RUNTIME_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.warn('Database disk write warning (memory state retained):', error.message);
    return true;
  }
};

export const logAudit = (actorName, actorRole, action, target, details) => {
  const db = getDB();
  const entry = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    actor_name: actorName || 'System',
    actor_role: actorRole || 'system',
    action,
    target: target || 'general',
    details: typeof details === 'object' ? JSON.stringify(details) : String(details),
    timestamp: new Date().toISOString()
  };
  db.audit_logs.unshift(entry);
  if (db.audit_logs.length > 500) {
    db.audit_logs = db.audit_logs.slice(0, 500);
  }
  saveDB(db);
  return entry;
};

