# Market & Co. — E-Commerce Frontend (React + Vite)

React 18 storefront consuming the `ecommerce-backend` API. Uses React Router
for navigation, Redux Toolkit for global cart/auth state, Axios for API
calls, and Tailwind CSS for styling.

## Setup

```bash
npm install
cp .env.example .env      # set VITE_API_URL to your backend URL
npm run dev                 # starts on http://localhost:5173
```

## Environment Variables (.env)

| Key | Description |
|---|---|
| VITE_API_URL | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## Structure

- `src/api/axiosInstance.js` — Axios instance with a request interceptor that
  attaches the JWT from `localStorage` and a response interceptor that clears
  it on `401`.
- `src/redux/` — `store.js` plus `slices/` (state + reducers) and `thunks/`
  (async API calls) for `auth`, `products`, `cart`, `orders`.
- `src/pages/` — routed pages: `Home` (listing/filter/search/sort/pagination),
  `ProductDetail` (with recommendations), `Cart`, `Checkout`, `Orders`,
  `Login` (login + register), `Contact` (validated form), `Admin`
  (product + order management, admin-only).
- `src/components/ProtectedRoute.jsx` — guards routes behind login, with an
  `adminOnly` flag for RBAC on the frontend.

## Deployment (Netlify / Vercel)

1. Push this folder to GitHub.
2. Import the repo into Netlify or Vercel.
3. Build command: `npm run build`, publish directory: `dist`.
4. Set the `VITE_API_URL` environment variable in the hosting dashboard to
   your deployed backend's URL (e.g. an API on Render).
5. If using Netlify, add a `_redirects` file with `/* /index.html 200` (or a
   `vercel.json` rewrite on Vercel) so client-side routes don't 404 on refresh.
