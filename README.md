# ZEROX CLOUD ⚡

> **Global Cloud & Game Server Hosting Platform**  
> High-performance game server hosting, NVMe cloud VPS, bare-metal dedicated servers, and Discord bot hosting with instant automated provisioning.

---

## ✨ Features

- **Cinematic Vector Splash Screen**: Stroke outline tracing to solid white fill of the **ZC monogram**, cursive handwriting reveal of *"ZeroxCloud"*, glowing aura, and smooth dissolve.
- **Atmospheric Visual Identity**: Deep charcoal Minecraft cave aesthetic with glowing spore particles, warm campfire embers, and frosted glass cards.
- **Hero Section & Live Console Preview**:
  - Interactive category tabs (`Game servers`, `Cloud`, `Dedicated`, `Web hosting`, `Discord bots`)
  - Glass callout pill (`Explore game servers →`)
  - Pterodactyl console preview frame (`portal.zeroxcloud.com`) with floating SLA badges (`✦ 99.9% Uptime SLA`, `⚡ Sub-15ms Latency`)
- **Interactive Bento Grid**: 5-card layout showcasing Game servers, Cloud servers, Dedicated servers, Web hosting, and Discord bots with arrow pills.
- **5-Step Game Configurator (`/games`)**:
  - `01 LOCATION`: India (Noida & Mumbai)
  - `02 PLAN TYPE`: Intel Xeon E5 2699 v4, AMD EPYC 7C13, Offer Plan
  - `03 GAME`: Minecraft (FEATURED)
  - `04 INSTANCE TYPE`: Paper, Bungeecord, Forge, Vanilla, Sponge, Vanilla Bedrock
  - `05 CHOOSE A PLAN`: Dirt (₹40/mo) through Netherite (₹800/mo) and special Network Packages with character banner art and spec pills.
- **Global Network & 3D Globe**: Regional low-latency nodes (Noida 20ms, Mumbai 28ms, Karachi 42ms, Lahore 48ms, Singapore 45ms) with an interactive 3D particle sphere globe.
- **Split-Screen Authentication (`/login`, `/register`)**: Brand marketing checklist on the left, glass form on the right with Discord OAuth integration.
- **Client Management Portal (`/client/*`)**:
  - Overview metrics (Active Servers, Open Tickets, Total Spent)
  - Servers list with Pterodactyl Panel notice banner (`portal.zeroxcloud.com`), live power controls (Stop, Restart, Start), and console logs
  - Full-featured support ticket system and billing invoice history
- **Super Admin Control Center (`/admin/*`)**: Complete management of customers, servers, products/plans, coupons, and security audit trails.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React, HTML5 Canvas
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs
- **Database**: Embedded JSON database with seamless fallback (`server/data/db.json`) or optional Supabase
- **Hosting / Deploy**: Full production SPA static serving + REST API on port `5050`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mohdnuman925-lgtm/zerox-cloud.git
cd zerox-cloud
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5050`

### 4. Build & Production Start
```bash
npm run build
npm start
```
The full application (frontend SPA + REST API) will be served on `http://localhost:5050`.

---

## 🌐 Production Domain Deployment (`zeroxcloud.site` & `n.stake.bond`)

This repository is pre-configured with **Vercel Serverless & SPA architecture** (`vercel.json` + `api/index.js`), plus standalone Node/Express support.

### Option A: Vercel Cloud Deployment (Recommended)
Both `zeroxcloud.site` (or `zeroxxcloud.site`) and `n.stake.bond` can be attached to the exact same Vercel project:

1. **Deploy to Vercel**:
   - Link this GitHub repo (`mohdnuman925-lgtm/zerox-cloud`) in your Vercel Dashboard.
   - Vercel automatically detects `vercel.json`, executes `npm run build`, and routes `/api/*` to the serverless function.

2. **Add Custom Domains in Vercel**:
   - Go to **Project Settings** → **Domains**.
   - Add:
     - `zeroxcloud.site` & `www.zeroxcloud.site` (or `zeroxxcloud.site`)
     - `n.stake.bond`

3. **Configure DNS Records** at your domain registrar / Cloudflare:
   | Type | Host / Name | Target / Value | TTL |
   | :--- | :--- | :--- | :--- |
   | **A** | `@` (or domain apex) | `76.76.21.21` | Auto |
   | **CNAME** | `www` | `cname.vercel-dns.com` | Auto |
   | **CNAME** | `n` (for `n.stake.bond`) | `cname.vercel-dns.com` | Auto |

Vercel will automatically provision SSL certificates for all domains within 60 seconds!

---

### Option B: VPS / Linux Server Deployment (Nginx / PM2)
If hosting on an Ubuntu/Debian server for `n.stake.bond`:

```bash
# 1. Install & build
npm install
npm run build

# 2. Run with PM2
pm2 start server/index.js --name "zerox-cloud"
pm2 save
```

**Nginx Configuration (`/etc/nginx/sites-available/zeroxcloud`)**:
```nginx
server {
    server_name zeroxcloud.site zeroxxcloud.site n.stake.bond;

    location / {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `mohdnuman925@gmail.com` | `Password123!` |
| **Super Admin** | `admin@zeroxcloud.com` | `ZeroxAdmin2026!` |

---

## 📜 License

MIT License © 2026 ZEROX CLOUD. All rights reserved.
