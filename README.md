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
