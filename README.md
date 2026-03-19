# ATELIER RELIC

A modern vintage furniture e-commerce platform built with Next.js, featuring a minimal luxury aesthetic and full-stack Supabase integration.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

---

## Overview

ATELIER RELIC is a portfolio-grade e-commerce application for curated vintage furniture. The project emphasizes clean architecture, server-side rendering, and a refined editorial design language suitable for high-end retail.

### Key Features

- **Product Catalog** — Browse vintage furniture with detailed product pages
- **Magazine Section** — Editorial content and storytelling
- **User Authentication** — Sign up, login, and session management via Supabase Auth
- **Shopping Cart** — Persistent cart with DB sync for logged-in users
- **Wishlist** — Save favorites with like-count integration
- **Checkout & Orders** — Full checkout flow with address management
- **My Page** — Profile, addresses, order history, and wishlist management
- **Responsive Design** — Mobile-first layout across all breakpoints

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Deployment | Vercel-ready |

---

## Project Structure

```
src/
├── app/                    # Routes & page composition
│   ├── page.tsx            # Home
│   ├── shop/               # Product listing & detail
│   ├── magazine/           # Magazine listing
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── my/                 # User dashboard (SSR)
│   ├── login/              # Login
│   ├── join/               # Sign up
│   └── about/              # About page
├── components/             # Shared UI components
│   ├── layout/             # Header, Footer
│   └── magazine/           # MagazineCarousel
├── features/               # Domain modules
│   ├── products/           # ProductGridSection, ProductDetail
│   ├── magazine/           # MagazineGridSection
│   ├── checkout/           # CheckoutPage, orderService
│   └── my/                 # MyPageClient, myService
├── lib/                    # Supabase clients, types
├── store/                  # Zustand stores (cart, wishlist)
└── middleware.ts           # Auth session refresh
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd atelier_relic

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the schema in `supabase/schema.sql` via the SQL Editor
3. (Optional) Run `supabase/seed.sql` for sample data

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

---

## Architecture

### Server-Side Data Fetching

Pages fetch data on the server and pass it as props to client components:

- **Home** — Products and magazines via `productService`, `magazineService`
- **Shop** — Products via `getProducts()`
- **Magazine** — Magazines via `getMagazinesByIdOrder()`
- **My Page** — Profile, addresses, orders, wishlist via `getMyPageData()`

### Auth Flow

- **Client**: `createBrowserClient` from `@supabase/ssr` (cookies)
- **Server**: `createClient()` from `@/lib/supabase/server`
- **Middleware**: Session refresh on each request

### State Management

- **Cart** — Zustand store with Supabase sync when logged in
- **Wishlist** — Zustand store with Supabase sync
- **Auth** — Supabase Auth with `getUser()` for session checks

---

## Database Schema (Supabase)

| Table | Description |
|-------|-------------|
| `users` | User profiles (linked to Supabase Auth) |
| `addresses` | Shipping addresses |
| `products` | Product catalog |
| `magazines` | Editorial content |
| `cart_items` | Shopping cart items |
| `wishlist_items` | User wishlists |
| `orders` | Order headers |
| `order_items` | Order line items |

Row Level Security (RLS) is enabled on all tables.

---

## Design Principles

- **Minimal** — Clean layouts, ample whitespace
- **Luxury** — Refined typography (Caudex), muted palette
- **Vintage** — Editorial imagery, timeless aesthetic
- **Responsive** — Mobile-first, sm/md/lg/xl breakpoints

---

## Deployment

The project is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Add environment variables
3. Deploy

---

## License

Private project. All rights reserved.
