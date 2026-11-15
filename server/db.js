import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.env.IS_SERVERLESS);
const SEED_FILE = path.join(__dirname, 'data', 'db.json');
const RUNTIME_DB_FILE = isServerless ? path.join('/tmp', 'zerox_db.json') : SEED_FILE;

let memoryDB = null;

export const getInitialData = () => {
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
        role: 'super_admin',
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
      { id: 'gm-minecraft', name: 'Minecraft', slug: 'minecraft', featured: true, logo: '/assets/logos/minecraft-logo.svg', image: '/assets/minecraft-plan-card.jpg', description: 'Paper, Purpur, Forge, Fabric, Vanilla, Bedrock' },
      { id: 'gm-rust', name: 'Rust', slug: 'rust', featured: true, logo: '/assets/logos/rust-logo.svg', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', description: 'Oxide / uMod high-tick survival' },
      { id: 'gm-cs2', name: 'Counter-Strike 2', slug: 'cs2', featured: true, logo: '/assets/logos/cs2-logo.svg', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80', description: '128 tickrate competitive esports servers' },
      { id: 'gm-ark', name: 'ARK: Survival Evolved', slug: 'ark', featured: false, logo: '', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80', description: 'Crossplay cluster support' }
    ],
    plans: [
      {
            "id": "plan-dirt",
            "product_id": "prod-mc-dirt",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "DIRT PLAN",
            "tag": "GAMES",
            "badge": "CHEAPEST",
            "price_inr": 40,
            "price_usd": 0.5,
            "ram": "4 GB",
            "cpu": "100% CPU",
            "storage": "20 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations",
                  "Full SFTP & MySQL"
            ],
            "sort_order": 1,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-wood",
            "product_id": "prod-mc-wood",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "WOOD PLAN",
            "tag": "GAMES",
            "badge": "MOST SOLD",
            "price_inr": 80,
            "price_usd": 1,
            "ram": "4 GB",
            "cpu": "200% CPU",
            "storage": "30 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations",
                  "Full SFTP & MySQL"
            ],
            "sort_order": 2,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-stone",
            "product_id": "prod-mc-stone",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "STONE PLAN",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 120,
            "price_usd": 1.5,
            "ram": "6 GB",
            "cpu": "300% CPU",
            "storage": "40 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations",
                  "Full SFTP & MySQL"
            ],
            "sort_order": 3,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-coal",
            "product_id": "prod-mc-coal",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "COAL PLAN",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 160,
            "price_usd": 2,
            "ram": "8 GB",
            "cpu": "400% CPU",
            "storage": "50 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations",
                  "Full SFTP & MySQL"
            ],
            "sort_order": 4,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-iron",
            "product_id": "prod-mc-iron",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "IRON PLAN",
            "tag": "GAMES",
            "badge": "RECOMMENDED",
            "price_inr": 200,
            "price_usd": 2.5,
            "ram": "10 GB",
            "cpu": "500% CPU",
            "storage": "60 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Smooth modpack handling",
                  "Instant deployment",
                  "DDoS protection",
                  "Full SFTP & MySQL",
                  "Automated Daily Backups"
            ],
            "sort_order": 5,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-diamond",
            "product_id": "prod-mc-diamond",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "DIAMOND PLAN",
            "tag": "GAMES",
            "badge": "HIGH POP",
            "price_inr": 280,
            "price_usd": 3.5,
            "ram": "14 GB",
            "cpu": "600% CPU",
            "storage": "80 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Heavy SMP & custom plugins",
                  "Instant deployment",
                  "DDoS protection",
                  "NVMe Gen4 speed",
                  "Sub-15ms Indian Ping"
            ],
            "sort_order": 6,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-netherite",
            "product_id": "prod-mc-netherite",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "intel",
            "name": "NETHERITE PLAN",
            "tag": "GAMES",
            "badge": "ULTIMATE",
            "price_inr": 400,
            "price_usd": 5,
            "ram": "20 GB",
            "cpu": "800% CPU",
            "storage": "120 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Large public community",
                  "Zero tickrate lag",
                  "Free subdomain & MySQL",
                  "DDoS protection",
                  "Priority 24/7 Support"
            ],
            "sort_order": 7,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-lapis",
            "product_id": "prod-mc-lapis",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "LAPIS PLAN",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 240,
            "price_usd": 3,
            "ram": "10 GB",
            "cpu": "450% CPU",
            "storage": "60 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD EPYC 7C13 cores",
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations"
            ],
            "sort_order": 8,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-gold",
            "product_id": "prod-mc-gold",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "GOLD PLAN",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 300,
            "price_usd": 3.75,
            "ram": "12 GB",
            "cpu": "500% CPU",
            "storage": "70 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD EPYC 7C13 cores",
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations"
            ],
            "sort_order": 9,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-redstone",
            "product_id": "prod-mc-redstone",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "REDSTONE PLAN",
            "tag": "GAMES",
            "badge": "LIMITED STOCK",
            "price_inr": 360,
            "price_usd": 4.5,
            "ram": "16 GB",
            "cpu": "600% CPU",
            "storage": "90 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD EPYC 7C13 cores",
                  "Instant deployment",
                  "DDoS protection",
                  "24/7 support",
                  "Custom configurations"
            ],
            "sort_order": 10,
            "enabled": true,
            "stock_status": "limited",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-emerald",
            "product_id": "prod-mc-emerald",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "EMERALD PLAN",
            "tag": "GAMES",
            "badge": "TOP TIER",
            "price_inr": 450,
            "price_usd": 5.6,
            "ram": "20 GB",
            "cpu": "700% CPU",
            "storage": "100 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD EPYC 7C13 high-clock",
                  "Large modded networks",
                  "DDoS protection",
                  "Full SFTP & MySQL",
                  "Automated Daily Backups"
            ],
            "sort_order": 11,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-obsidian",
            "product_id": "prod-mc-obsidian",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "OBSIDIAN PLAN",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 540,
            "price_usd": 6.75,
            "ram": "24 GB",
            "cpu": "800% CPU",
            "storage": "120 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD EPYC 7C13 high-clock",
                  "Massive entity load",
                  "DDoS protection",
                  "NVMe Gen4 fast chunk generation",
                  "Full SFTP"
            ],
            "sort_order": 12,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-netherite-extreme",
            "product_id": "prod-mc-netherite-extreme",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "amd",
            "name": "NETHERITE EXTREME PLAN",
            "tag": "GAMES",
            "badge": "ENTERPRISE",
            "price_inr": 720,
            "price_usd": 9,
            "ram": "32 GB",
            "cpu": "1000% CPU",
            "storage": "160 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Heavy BungeeCord & Velocity clusters",
                  "AMD EPYC 7C13 enterprise node",
                  "DDoS protection",
                  "Dedicated port",
                  "VIP Support"
            ],
            "sort_order": 13,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-ryzen-spark",
            "product_id": "prod-mc-ryzen-spark",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "ryzen",
            "name": "RYZEN SPARK PLAN",
            "tag": "GAMES",
            "badge": "5.7GHz TURBO",
            "price_inr": 280,
            "price_usd": 3.5,
            "ram": "8 GB DDR5",
            "cpu": "400% CPU @ 5.7GHz",
            "storage": "60 GB Gen4 NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD Ryzen 9 7950X single-core turbo",
                  "Peak 20.0 TPS stability",
                  "DDoS mitigation",
                  "Fast world loading",
                  "Full SFTP & MySQL"
            ],
            "sort_order": 14,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-ryzen-beast",
            "product_id": "prod-mc-ryzen-beast",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "ryzen",
            "name": "RYZEN BEAST PLAN",
            "tag": "GAMES",
            "badge": "BEST VALUE",
            "price_inr": 560,
            "price_usd": 7,
            "ram": "16 GB DDR5",
            "cpu": "600% CPU @ 5.7GHz",
            "storage": "100 GB Gen4 NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "AMD Ryzen 9 7950X single-core turbo",
                  "Heavy redstone & mob farms",
                  "Gen4 7000MB/s NVMe",
                  "Path.net DDoS shield",
                  "Daily Backups"
            ],
            "sort_order": 15,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-ryzen-titan",
            "product_id": "prod-mc-ryzen-titan",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "ryzen",
            "name": "RYZEN TITAN PLAN",
            "tag": "GAMES",
            "badge": "MAXIMUM FPS",
            "price_inr": 1120,
            "price_usd": 14,
            "ram": "32 GB DDR5",
            "cpu": "800% CPU @ 5.7GHz",
            "storage": "200 GB Gen4 NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Top-spec esports Minecraft server",
                  "AMD Ryzen 9 7950X flagship",
                  "Unlimited player capacity",
                  "Custom dedicated port",
                  "VIP Support"
            ],
            "sort_order": 16,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-mc-offer",
            "product_id": "prod-mc-offer",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "offer",
            "name": "Offer Plan",
            "tag": "GAMES",
            "badge": "HOT DEAL",
            "price_inr": 360,
            "price_usd": 4.5,
            "original_price_inr": 480,
            "save_badge": "SAVE 25%",
            "ram": "8 GB",
            "cpu": "400% CPU",
            "storage": "50 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Budget-friendly SMP starter",
                  "DDoS protection",
                  "24/7 uptime guarantee",
                  "Full SFTP access",
                  "Instant activation"
            ],
            "sort_order": 17,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-mc-network",
            "product_id": "prod-mc-network",
            "category": "games",
            "game_slug": "minecraft",
            "processor": "offer",
            "name": "Minecraft Server Network Package",
            "tag": "GAMES",
            "badge": "NETWORK BUNDLE",
            "price_inr": 1700,
            "price_usd": 21,
            "original_price_inr": 2400,
            "save_badge": "SAVE 30%",
            "ram": "32 GB",
            "cpu": "1200% CPU",
            "storage": "120 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Complete Proxy + Lobby + Sub-server network bundle",
                  "Pre-configured Velocity proxy",
                  "Multiple MySQL databases",
                  "Sub-10ms Indian routing"
            ],
            "sort_order": 18,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "/assets/minecraft-plan-card.jpg"
      },
      {
            "id": "plan-rust-duo",
            "product_id": "prod-rust-duo",
            "category": "games",
            "game_slug": "rust",
            "processor": "ryzen",
            "name": "SMALL GROUP / DUO",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 349,
            "price_usd": 4.49,
            "ram": "4 GB DDR5",
            "cpu": "2 vCPU Boost",
            "storage": "40 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Up to 30 Players",
                  "Instant deployment",
                  "Oxide/uMod Ready",
                  "Path.net DDoS Shield",
                  "Auto Wipe Scheduler"
            ],
            "sort_order": 19,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-rust-clan",
            "product_id": "prod-rust-clan",
            "category": "games",
            "game_slug": "rust",
            "processor": "ryzen",
            "name": "CLAN WARFARE",
            "tag": "GAMES",
            "badge": "MOST POPULAR",
            "price_inr": 649,
            "price_usd": 7.99,
            "ram": "8 GB DDR5",
            "cpu": "4 vCPU Boost",
            "storage": "80 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Up to 80 Players",
                  "5.7GHz Turbo",
                  "Custom Maps & RustMaps",
                  "Automated Wipe Scheduler",
                  "RCON Web Console"
            ],
            "sort_order": 20,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-rust-highpop",
            "product_id": "prod-rust-highpop",
            "category": "games",
            "game_slug": "rust",
            "processor": "ryzen",
            "name": "HIGH-POP MEGASERVER",
            "tag": "GAMES",
            "badge": "MEGA SERVER",
            "price_inr": 1249,
            "price_usd": 14.99,
            "ram": "16 GB DDR5",
            "cpu": "6 vCPU Boost",
            "storage": "120 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Up to 200+ Players",
                  "Maximum Server FPS",
                  "Enterprise NVMe RAID-1",
                  "High Entity Cap",
                  "Priority Support"
            ],
            "sort_order": 21,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-cs2-scrim",
            "product_id": "prod-cs2-scrim",
            "category": "games",
            "game_slug": "cs2",
            "processor": "ryzen",
            "name": "5V5 COMPETITIVE SCRIM",
            "tag": "GAMES",
            "badge": "",
            "price_inr": 299,
            "price_usd": 3.89,
            "ram": "4 GB DDR5",
            "cpu": "2 vCPU",
            "storage": "40 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "10 Players + Coach",
                  "MatchZy Scrim Preloaded",
                  "Sub-Tick & 128-Tick Accuracy",
                  "Sub-5ms Indian Peering",
                  "Demo Auto-Recorder"
            ],
            "sort_order": 22,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-cs2-community",
            "product_id": "prod-cs2-community",
            "category": "games",
            "game_slug": "cs2",
            "processor": "ryzen",
            "name": "COMMUNITY RETAKE / CASUAL",
            "tag": "GAMES",
            "badge": "POPULAR",
            "price_inr": 599,
            "price_usd": 7.49,
            "ram": "8 GB DDR5",
            "cpu": "4 vCPU",
            "storage": "70 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "Up to 24 Players",
                  "FastDL & Workshop Sync",
                  "Retake & DM Plugins",
                  "VAC & Steam UDP Shield",
                  "Clean Indian Bandwidth"
            ],
            "sort_order": 23,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-cs2-tournament",
            "product_id": "prod-cs2-tournament",
            "category": "games",
            "game_slug": "cs2",
            "processor": "ryzen",
            "name": "TOURNAMENT & LEAGUE HOST",
            "tag": "GAMES",
            "badge": "LEAGUE READY",
            "price_inr": 1099,
            "price_usd": 13.49,
            "ram": "12 GB DDR5",
            "cpu": "6 vCPU",
            "storage": "100 GB NVMe",
            "bandwidth": "Unlimited",
            "location": "India (Noida & Mumbai)",
            "features": [
                  "32+ Players + GOTV Relay",
                  "Full CSTV Streaming",
                  "Dedicated 10Gbps L4/L7 Mitigation",
                  "Tournament Master Config",
                  "24/7 Priority Staff"
            ],
            "sort_order": 24,
            "enabled": true,
            "stock_status": "in_stock",
            "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80"
      },
      {
            "id": "plan-vps-1",
            "product_id": "prod-vps-1",
            "category": "cloud",
            "name": "CLOUD VPS-01",
            "tag": "CLOUD",
            "badge": "",
            "price_inr": 450,
            "price_usd": 5.5,
            "ram": "4 GB DDR4",
            "cpu": "2 vCPU Cores",
            "storage": "60 GB NVMe SSD",
            "bandwidth": "5 TB Bandwidth @ 1Gbps",
            "location": "Mumbai, India",
            "features": [
                  "Full Root Access",
                  "Dedicated IPv4 + IPv6",
                  "Sub-15ms Latency",
                  "Choice of Ubuntu/Debian/Alma/Windows",
                  "DDoS Mitigation"
            ],
            "sort_order": 25,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-vps-2",
            "product_id": "prod-vps-2",
            "category": "cloud",
            "name": "CLOUD VPS-02",
            "tag": "CLOUD",
            "badge": "RECOMMENDED",
            "price_inr": 890,
            "price_usd": 11,
            "ram": "8 GB DDR4",
            "cpu": "4 vCPU Cores",
            "storage": "120 GB NVMe SSD",
            "bandwidth": "10 TB Bandwidth @ 1Gbps",
            "location": "Noida, India",
            "features": [
                  "Full Root Access",
                  "Dedicated IPv4 + IPv6",
                  "Sub-15ms Latency",
                  "Choice of OS",
                  "Automated Daily Backups"
            ],
            "sort_order": 26,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-vps-3",
            "product_id": "prod-vps-3",
            "category": "cloud",
            "name": "CLOUD VPS-03",
            "tag": "CLOUD",
            "badge": "",
            "price_inr": 1690,
            "price_usd": 21,
            "ram": "16 GB DDR4",
            "cpu": "8 vCPU Cores",
            "storage": "240 GB NVMe SSD",
            "bandwidth": "20 TB Bandwidth @ 10Gbps",
            "location": "Singapore, Asia",
            "features": [
                  "Full Root Access",
                  "Dedicated IPv4 + IPv6",
                  "Sub-15ms Latency",
                  "BGP Optimized Routing",
                  "DDoS Protection"
            ],
            "sort_order": 27,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-vps-4",
            "product_id": "prod-vps-4",
            "category": "cloud",
            "name": "CLOUD VPS-04",
            "tag": "CLOUD",
            "badge": "POWERHOUSE",
            "price_inr": 3290,
            "price_usd": 39.99,
            "ram": "32 GB DDR4",
            "cpu": "12 vCPU Cores",
            "storage": "400 GB NVMe SSD",
            "bandwidth": "Unlimited @ 10Gbps",
            "location": "Noida & Mumbai",
            "features": [
                  "Full Root Access",
                  "Dedicated IPv4 + IPv6",
                  "Sub-15ms Latency",
                  "BGP Optimized 10Gbps Uplink",
                  "Daily Backups Included"
            ],
            "sort_order": 28,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-dedi-1",
            "product_id": "prod-dedi-1",
            "category": "dedicated",
            "name": "ENTERPRISE INTEL E-2388G",
            "tag": "DEDICATED",
            "badge": "",
            "price_inr": 6499,
            "price_usd": 79,
            "ram": "64 GB DDR4 ECC",
            "cpu": "8 Cores / 16 Threads @ 5.1GHz",
            "storage": "2x 1TB NVMe PCIe Gen4",
            "bandwidth": "1 Gbps Unmetered",
            "location": "Mumbai Datacenter",
            "features": [
                  "100% Dedicated Hardware",
                  "IPMI / iDRAC remote console",
                  "Clean IPv4 Subnet (/29)",
                  "Tier-3 Datacenter SLA"
            ],
            "sort_order": 29,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-dedi-2",
            "product_id": "prod-dedi-2",
            "category": "dedicated",
            "name": "TITAN AMD RYZEN 9 7950X",
            "tag": "DEDICATED",
            "badge": "ULTRA PERFORMANCE",
            "price_inr": 11999,
            "price_usd": 145,
            "ram": "128 GB DDR5 5200MHz",
            "cpu": "16 Cores / 32 Threads @ 5.7GHz",
            "storage": "2x 2TB NVMe PCIe Gen4",
            "bandwidth": "10 Gbps Burst Unmetered",
            "location": "Noida Datacenter",
            "features": [
                  "Peak Single-Thread Speeds",
                  "Hardware RAID available",
                  "IPMI / KVM Included",
                  "Custom BGP Announce"
            ],
            "sort_order": 30,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-dedi-3",
            "product_id": "prod-dedi-3",
            "category": "dedicated",
            "name": "WORKFORCE INTEL CORE I9-14900K",
            "tag": "DEDICATED",
            "badge": "6.0GHz FLAGSHIP",
            "price_inr": 13999,
            "price_usd": 169,
            "ram": "128 GB DDR5",
            "cpu": "24 Cores / 32 Threads @ 6.0GHz",
            "storage": "2x 2TB Gen4 NVMe RAID",
            "bandwidth": "10 Gbps Port Unmetered",
            "location": "Noida Datacenter",
            "features": [
                  "Unmatched 6.0GHz Single-Core",
                  "Hardware IPMI / KVM",
                  "Unmetered 10Gbps Port",
                  "DDoS Protection & /29 Subnet"
            ],
            "sort_order": 31,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-web-1",
            "product_id": "prod-web-1",
            "category": "web",
            "name": "STARTER WEB",
            "tag": "WEB",
            "badge": "",
            "price_inr": 99,
            "price_usd": 1.25,
            "ram": "1 GB Cloud RAM",
            "cpu": "1 Core CPU",
            "storage": "10 GB NVMe Storage",
            "bandwidth": "Unlimited Bandwidth",
            "location": "India Fast Edge",
            "features": [
                  "Host 1 Website",
                  "Free Wildcard SSL",
                  "5 Professional Emails",
                  "Daily Backups",
                  "cPanel / DirectAdmin"
            ],
            "sort_order": 32,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-web-2",
            "product_id": "prod-web-2",
            "category": "web",
            "name": "BUSINESS WEB PRO",
            "tag": "WEB",
            "badge": "POPULAR",
            "price_inr": 249,
            "price_usd": 3.1,
            "ram": "4 GB Cloud RAM",
            "cpu": "2 Core CPU",
            "storage": "50 GB NVMe Storage",
            "bandwidth": "Unlimited Bandwidth",
            "location": "India Fast Edge",
            "features": [
                  "Unlimited Websites",
                  "Free Wildcard SSL",
                  "Unlimited Business Emails",
                  "Real-time Malware Scanner",
                  "WordPress 1-Click"
            ],
            "sort_order": 33,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-web-3",
            "product_id": "prod-web-3",
            "category": "web",
            "name": "ENTERPRISE CLOUD WEB",
            "tag": "WEB",
            "badge": "ENTERPRISE",
            "price_inr": 499,
            "price_usd": 5.99,
            "ram": "8 GB Cloud RAM",
            "cpu": "4 Core CPU",
            "storage": "120 GB NVMe Storage",
            "bandwidth": "Unlimited Bandwidth",
            "location": "India Fast Edge",
            "features": [
                  "Free Wildcard SSL & Dedicated IP",
                  "LiteSpeed Web Server + LSCache",
                  "Real-Time Malware Scanning",
                  "Priority VIP Support",
                  "Daily Offsite Backups"
            ],
            "sort_order": 34,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-bot-1",
            "product_id": "prod-bot-1",
            "category": "discord-bots",
            "name": "BOT SPARK",
            "tag": "BOTS",
            "badge": "",
            "price_inr": 49,
            "price_usd": 0.6,
            "ram": "1 GB Dedicated RAM",
            "cpu": "100% CPU",
            "storage": "5 GB NVMe",
            "bandwidth": "Always On 24/7",
            "location": "India Edge",
            "features": [
                  "Node.js, Python, Java, Go",
                  "Git Integration",
                  "Automatic Restarts on Crash",
                  "Real-time Console Logs"
            ],
            "sort_order": 35,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-bot-2",
            "product_id": "prod-bot-2",
            "category": "discord-bots",
            "name": "BOT TITAN CLUSTER",
            "tag": "BOTS",
            "badge": "HEAVY BOT",
            "price_inr": 149,
            "price_usd": 1.8,
            "ram": "4 GB Dedicated RAM",
            "cpu": "250% CPU",
            "storage": "20 GB NVMe",
            "bandwidth": "Always On 24/7",
            "location": "India Edge",
            "features": [
                  "Sharded Bot Ready",
                  "Postgres/Redis addon ready",
                  "Fast WebSocket Latency to Discord API",
                  "24/7 Monitored"
            ],
            "sort_order": 36,
            "enabled": true,
            "stock_status": "in_stock"
      },
      {
            "id": "plan-bot-3",
            "product_id": "prod-bot-3",
            "category": "discord-bots",
            "name": "BOT ENTERPRISE SHARD",
            "tag": "BOTS",
            "badge": "SHARD MASTER",
            "price_inr": 299,
            "price_usd": 3.6,
            "ram": "8 GB Dedicated RAM",
            "cpu": "400% CPU",
            "storage": "50 GB NVMe",
            "bandwidth": "Always On 24/7",
            "location": "India Edge",
            "features": [
                  "Multi-Process Sharded Cluster",
                  "Dedicated Redis & Postgres Addon",
                  "Ultra-Low Discord Gateway Latency",
                  "Auto Git Webhook Deploy",
                  "24/7 SLA Uptime Guarantee"
            ],
            "sort_order": 37,
            "enabled": true,
            "stock_status": "in_stock"
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
            price: 8.00,
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
      pterodactyl_panel_url: 'https://panel.zeroxcloud.site',
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
    ],
    nodes: getDefaultNodes(),
    roles: getDefaultRoles()
  };
};

export const getDefaultNodes = () => [];

export const getDefaultRoles = () => [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Supreme owner access with full control over the platform, databases, and roles.',
    badge_color: 'purple',
    badge_text: '#EC4899',
    badge_bg: 'rgba(236, 72, 153, 0.15)',
    badge_border: 'rgba(236, 72, 153, 0.35)',
    is_system: true,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: ['all']
  },
  {
    id: 'founder',
    name: 'Founder',
    description: 'Executive platform founder with complete management and administrative privileges.',
    badge_color: 'amber',
    badge_text: '#F59E0B',
    badge_bg: 'rgba(245, 158, 11, 0.15)',
    badge_border: 'rgba(245, 158, 11, 0.35)',
    is_system: false,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: ['all']
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manages customers, servers, products, nodes, billing, and support desks.',
    badge_color: 'emerald',
    badge_text: '#10B981',
    badge_bg: 'rgba(16, 185, 129, 0.15)',
    badge_border: 'rgba(16, 185, 129, 0.35)',
    is_system: true,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: [
      'manage_servers',
      'manage_nodes',
      'manage_customers',
      'manage_billing',
      'manage_tickets',
      'manage_content',
      'view_audit_logs'
    ]
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Assists with customer oversight, ticket escalation, and community moderation.',
    badge_color: 'indigo',
    badge_text: '#818CF8',
    badge_bg: 'rgba(129, 140, 248, 0.15)',
    badge_border: 'rgba(129, 140, 248, 0.35)',
    is_system: false,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: ['manage_customers', 'manage_tickets']
  },
  {
    id: 'ticket_staff',
    name: 'Ticket Staff',
    description: 'Support agent handling customer inquiries, ticket replies, and technical assistance.',
    badge_color: 'cyan',
    badge_text: '#38BDF8',
    badge_bg: 'rgba(56, 189, 248, 0.15)',
    badge_border: 'rgba(56, 189, 248, 0.35)',
    is_system: false,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: ['manage_tickets']
  },
  {
    id: 'customer',
    name: 'Customer',
    description: 'Standard client account with access to purchased cloud servers and billing portal.',
    badge_color: 'neutral',
    badge_text: '#9CA3AF',
    badge_bg: 'rgba(156, 163, 175, 0.15)',
    badge_border: 'rgba(156, 163, 175, 0.35)',
    is_system: true,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    permissions: ['client_access']
  }
];

export const getDB = () => {
  if (memoryDB) {
    if (!memoryDB.nodes || !Array.isArray(memoryDB.nodes)) {
      memoryDB.nodes = [];
    }
    if (!memoryDB.roles || !Array.isArray(memoryDB.roles) || memoryDB.roles.length === 0) {
      memoryDB.roles = getDefaultRoles();
    }
    return memoryDB;
  }

  try {
    if (fs.existsSync(RUNTIME_DB_FILE)) {
      const raw = fs.readFileSync(RUNTIME_DB_FILE, 'utf-8');
      memoryDB = JSON.parse(raw);
      if (!memoryDB.nodes || !Array.isArray(memoryDB.nodes)) {
        memoryDB.nodes = [];
      }
      if (!memoryDB.roles || !Array.isArray(memoryDB.roles) || memoryDB.roles.length === 0) {
        memoryDB.roles = getDefaultRoles();
      }
      return memoryDB;
    }

    // If runtime file does not exist, check seed file
    if (SEED_FILE !== RUNTIME_DB_FILE && fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf-8');
      memoryDB = JSON.parse(raw);
      if (!memoryDB.nodes || !Array.isArray(memoryDB.nodes)) {
        memoryDB.nodes = [];
      }
      if (!memoryDB.roles || !Array.isArray(memoryDB.roles) || memoryDB.roles.length === 0) {
        memoryDB.roles = getDefaultRoles();
      }
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

