# Domain Dashboard — RDAP-Powered Domain Intelligence (Next.js 16)

[![Vercel Deploy Status](https://img.shields.io/github/deployments/YOUR-GITHUB-USERNAME/domain-dashboard/production?label=vercel&logo=vercel)](https://domain-dashboard-drab.vercel.app/)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

A modern **domain intelligence dashboard** built with **Next.js 16**, **React 19**, **TypeScript**, and **TailwindCSS**.  
It fetches, normalizes, and presents RDAP data for any domain — with caching, on-demand refresh, and clean expandable detail views.

This project demonstrates full-stack engineering, API design, typed data modeling, and production deployment.

---

## 📸 Screenshots

### Main Dashboard & Expanded Card (Displayed Horizontally)

<div style="display: flex; gap: 12px; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/3548d4c2-f514-4678-81c6-3745d9b5cd12" width="48%" alt="Dashboard Screenshot"/>
  <img src="https://github.com/user-attachments/assets/5760b753-42b4-489d-8597-49a3d62b9447" width="48%" alt="Expanded RDAP Details Screenshot"/>
</div>
<div style="display: flex; gap: 12px; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/bea21757-2a91-43a0-8bc4-389e4ec1354d" width="48%" alt="Showing Cached Results and Refresh Button"/>
  <img src="https://github.com/user-attachments/assets/ced1972f-e9c2-4ea2-b604-955951619322" width="48%" alt="After Refresh Button and Showing RDAP Details"/>
</div>

---

## 🚀 Features

### 🔍 Multi-Domain RDAP Lookup
- Enter one or many domains separated by commas or spaces.
- Unified RDAP normalization across multiple registry formats.
- Human-readable expiry times: “in 3 months”, “2 years ago”, etc.

### ⚡ Smart Per-Domain Caching
- Cached results clearly labeled.
- Per-domain **Refresh** button forces a fresh RDAP lookup.
- Avoids reloading all results unnecessarily.
- Successfull results are chaced for 24 hours, failed results are cached for 5 minutes

### 📦 Expandable Domain Cards
Each card displays:
- Domain name  
- Registrar  
- Expiry date + relative time  
- Statuses  
- Cached indicator  

Expanding reveals:
- Full RDAP event list  
- Entities (registrant, registrar, technical contacts)  
- Nameservers  
- Additional metadata  

### 🎨 Modern UI
- TailwindCSS styling  
- Reactive, responsive layout  
- Professional card design  

### 🛠️ Strong TypeScript Modeling
- RDAP event/entity types  
- Strict TypeScript across client + server  
- Predictable data flow  

---

## 🧪 How It Works

### 1️⃣ User enters domain(s)  
Input is cleaned, validated, and split.

### 2️⃣ API determines whether RDAP data is cached  
- If cached → serve cached version  
- If not → fetch from registry, parse, cache  

### 3️⃣ Results rendered as independent cards  
Per-domain refresh does not reset others.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16 (App Router)** |
| UI | **React 19**, React Server Components |
| Styles | **TailwindCSS 4** |
| Language | **TypeScript 5** |
| API | Next.js Route Handlers |
| Deployment | Vercel |
| Data Source | Live RDAP registry endpoints |
| Caching | In-memory with timestamps |

---

## 🛠️ Running Locally

```bash
git clone https://github.com/YOUR-USERNAME/domain-dashboard.git
cd domain-dashboard
npm install
npm run dev
```
Then open http://localhost:3000

## 🔗 Live Demo

https://domain-dashboard-drab.vercel.app/

---
