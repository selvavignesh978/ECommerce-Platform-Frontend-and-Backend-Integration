# Market & Co. — End-to-End MERN E-Commerce Platform
### Module 5 Assignment: Frontend + Backend Integration

A full-stack e-commerce application: React (Vite) frontend + Node.js/Express/MongoDB backend, JWT auth, role-based access control, product filtering/search, Redux Toolkit cart & auth state, a recommendation endpoint, and a validated contact form.

```
mern-ecommerce-project/
├── ecommerce-backend/     # Express API — see ecommerce-backend/README.md
└── ecommerce-frontend/    # React (Vite) app — see ecommerce-frontend/README.md
```

## Quick Start (local)

**1. Backend**
```bash
cd ecommerce-backend
npm install
cp .env.example .env        # set MONGO_URI (Atlas or local) and JWT_SECRET
npm run seed                 # optional demo data: admin@shop.com / Admin@123
npm run dev                   # http://localhost:5000
```

**2. Frontend**
```bash
cd ecommerce-frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

Both servers must be running for the app to work end-to-end. Register a new
account or log in with the seeded demo accounts to exercise the full flow:
browse → filter/search → product detail + recommendations → cart → checkout
→ orders. Log in as `admin@shop.com` and visit `/admin` to manage products
and update order status (role-based access control).

## Feature Checklist (maps to the assignment brief)

**Backend**
- [x] JWT auth + bcryptjs password hashing (`authentication.js`, `authMiddleware.js`)
- [x] CRUD APIs for Products, Orders, User Profiles
- [x] Product filter/sort/search via query params (`GET /api/products`)
- [x] Recommendation endpoint with RapidMiner integration point + local fallback (`analyticsController.js`)
- [x] Role-based access control middleware (`authorize("admin")`)
- [x] Modular folder structure: `config/ models/ controllers/ routes/ middleware/`

**Frontend**
- [x] Product listing, detail, filter, search — React Router + Axios (`Home.jsx`, `ProductDetail.jsx`)
- [x] Redux Toolkit for cart & auth global state (`redux/slices`, `redux/thunks`)
- [x] Responsive UI with Tailwind CSS
- [x] Contact form with client-side validation (`Contact.jsx`)
- [x] Login/Register/Logout wired to backend JWT flow, token persisted + attached via Axios interceptor
- [x] Ready for Netlify/Vercel deployment (`public/_redirects`, env-based API URL)

**Full-Stack Integration**
- [x] Frontend consumes backend endpoints for auth, products, orders
- [x] Environment variables for API URL (Vite `VITE_API_URL`) and server config (Node `.env`)
- [x] Loading states, error states, and 401 token handling throughout

## What's stubbed vs. fully implemented

- **RapidMiner recommendations**: RapidMiner Studio/Server is a separate
  desktop/server data-mining tool, not an npm package, so it can't be
  literally embedded in this repo. The backend calls out to a configurable
  `RAPIDMINER_ENDPOINT` (a RapidMiner Server web service you'd publish
  separately) and — since that endpoint won't exist until you deploy one —
  automatically falls back to a working local content-based recommender, so
  `/api/analytics/recommendations/:productId` returns real results today.
  To finish the RapidMiner half: build a similarity/association-rule model
  in RapidMiner Studio on exported order/product data, publish it via
  RapidMiner Server as a REST web service, and set `RAPIDMINER_ENDPOINT`.
- **Deployment**: the app is deployment-ready (env-driven API URL, SPA
  redirects, build scripts) but actually deploying to Netlify/Vercel/Render
  and connecting a live MongoDB Atlas cluster is an environment-specific
  step you'll need to do with your own accounts/repo.
- **Payment**: checkout uses Cash-on-Delivery only; no payment gateway is
  integrated (not in the assignment scope).

## Suggested next steps for your submission

1. `git init`, commit, push to your own GitHub repo (root containing both folders, or split into two repos).
2. Create a free MongoDB Atlas cluster, put its URI in the backend `.env`.
3. Deploy backend to Render (Web Service, build `npm install`, start `npm start`).
4. Deploy frontend to Netlify/Vercel, set `VITE_API_URL` to the deployed backend URL + `/api`.
5. Run `npm run seed` against your Atlas cluster (locally, pointing `MONGO_URI` at Atlas) to get demo data.
