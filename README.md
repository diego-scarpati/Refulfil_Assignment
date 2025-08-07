# Refulfil GMV Importer

A lightweight service to fetch Shopify order data for multiple merchants, store it in a hosted PostgreSQL (Supabase), and expose a simple GMV (Gross Merchandise Value) summary endpoint.

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Setup](#setup)  
- [Database Schema](#database-schema)  
- [Architecture](#architecture)  
- [GraphQL Query](#graphql-query)  
- [Scheduler](#scheduler)  
- [API Endpoint](#api-endpoint)  
- [Observations & Future Improvements](#observations--future-improvements)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Overview

This project automates:

1. **Importing** orders for each merchant via the Shopify Admin GraphQL API  
2. **Storing** them in a Supabase-hosted PostgreSQL database  
3. **Aggregating & serving** a GMV summary (total orders, AOV, GMV) via an internal HTTP endpoint  

---

## Features

- Multi-merchant support  
- Cursor-based pagination of Shopify orders  
- Upsert logic (no duplicates)  
- Hourly (or configurable) scheduling  
- Lightweight Express/Koa API for summary reports  

---

## Prerequisites

- Node.js ≥ 16  
- npm or yarn  
- Supabase account (free tier is fine)  
- Shopify Admin API access token for each merchant  
- [Supabase CLI][supabase-cli] (optional, for local testing)  

---

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/refulfil-gmv-importer.git
   cd refulfil-gmv-importer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```dotenv
   PORT=3000
   NODE_ENV=development
   DB_HOST=<your-db-host>
   DB_PORT=<your-db-port>
   DB_NAME=<your-db-name>
   DB_USER=<your-db-user>
   DB_PASS=<your-db-password>
   SHOPIFY_HOST_NAME=<your-shop-domain>
   SHOPIFY_ACCESS_TOKEN=<admin-api-access-token>
   CRON_SCHEDULE="*/30 * * * *" # optional
   ```

4. **Run the service**
   ```bash
   npm run dev
   ```

---

## Database Schema

- **merchants** – stores Shopify merchant details (name, shopify_id, plan type, etc.)
- **keys** – API credentials for each merchant
- **orders** – high level order data from Shopify (total price, timestamps, statuses)
- **order_items** – individual line items belonging to orders

---

## Architecture

- **Express + TypeScript** REST API structured as routes → controllers → services
- **Sequelize** ORM connected to a Supabase PostgreSQL instance
- **Shopify GraphQL Admin API** used to import orders
- **Cron scheduler** periodically pulls recent orders for all active merchants

---

## GraphQL Query

Orders are fetched using Shopify's Admin API GraphQL queries. See
[`src/utils/shopify/queries.ts`](src/utils/shopify/queries.ts) for the full query
used to paginate and fetch orders with line items.

---

## Scheduler

The scheduler runs according to `CRON_SCHEDULE` (default every 30 minutes) and
imports orders from the previous hour for all active merchants.

---

## API Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/keys` | Create merchant API key |
| `GET` | `/api/merchants` | List merchants |
| `GET` | `/api/merchants/:id` | Get merchant by id |
| `GET` | `/api/merchants/shopify/:shopifyId` | Get merchant by Shopify id |
| `GET` | `/api/merchants/:id/gmv` | GMV/AOV for merchant |
| `GET` | `/api/merchants/gmv` | Aggregate GMV/AOV |
| `GET` | `/api/merchants/gmv/merchants` | GMV/AOV per merchant |
| `GET` | `/api/orders` | List orders |
| `GET` | `/api/orders/:id` | Get order by id |
| `GET` | `/api/orders/shopify/:shopifyOrderId` | Get order by Shopify id |
| `GET` | `/api/orders/last` | Most recent order |
| `POST` | `/api/orders` | Create order |

---

## Observations & Future Improvements

- Add automated tests and CI integration
- Enhance validation and error handling
- Support pagination for order line items beyond 100 records
- Harden the data model and add proper migrations

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to
discuss what you would like to change.

---

## License

ISC

