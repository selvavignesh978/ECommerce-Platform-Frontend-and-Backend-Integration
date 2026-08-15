# E-Commerce Backend (Node.js + Express + MongoDB)

REST API powering the Market & Co. MERN e-commerce platform: JWT auth, bcrypt
password hashing, role-based access control, product CRUD with
filter/sort/search, order management, and a recommendation endpoint that
integrates with a RapidMiner Server web service (with a local fallback).

## Setup

```bash
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed               # optional: inserts demo admin/user + 8 products
npm run dev                 # starts on http://localhost:5000
```

## Environment Variables (.env)

| Key | Description |
|---|---|
| PORT | Server port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign JWTs |
| JWT_EXPIRES_IN | Token lifetime, e.g. `7d` |
| CLIENT_URL | Frontend origin, for CORS |
| RAPIDMINER_ENDPOINT | *(optional)* URL of a RapidMiner Server web service |
| RAPIDMINER_API_KEY | *(optional)* Bearer token for that service |

## API Reference

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account, returns JWT |
| POST | `/login` | Public | Authenticate, returns JWT |
| GET | `/me` | Private | Validate token, return current user |

### Users — `/api/users`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/profile` | Private | Get own profile |
| PUT | `/profile` | Private | Update name/phone/address/password |
| GET | `/` | Admin | List all users |
| DELETE | `/:id` | Admin | Remove a user |

### Products — `/api/products`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/?keyword=&category=&minPrice=&maxPrice=&sort=&page=&limit=` | Public | Filter, search, sort, paginate |
| GET | `/categories` | Public | Distinct category list |
| GET | `/:id` | Public | Single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Place order (server recomputes totals & stock) |
| GET | `/my-orders` | Private | Logged-in user's orders |
| GET | `/:id` | Private | Single order (owner or admin) |
| GET | `/` | Admin | All orders |
| PUT | `/:id/status` | Admin | Update order status |

### Analytics / Recommendations — `/api/analytics`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/recommendations/:productId` | Public | Similar products (RapidMiner → local fallback) |
| GET | `/recommendations/for-me` | Private | Personalized picks from order history |

## Recommendation System Notes

`controllers/analyticsController.js` first tries `RAPIDMINER_ENDPOINT`
(a RapidMiner Server process published as a REST web service — e.g. a
k-NN similarity or Market Basket Analysis model built in RapidMiner Studio).
If that endpoint is not configured or unreachable, it automatically falls
back to a local content-based scorer (shared category + tags + price
proximity + rating) so the feature works out of the box in local/dev
environments without a RapidMiner Server instance running.

## Role-Based Access Control

`middleware/authMiddleware.js` exports:
- `protect` — verifies the JWT and attaches `req.user`
- `authorize(...roles)` — restricts a route to given roles, e.g. `authorize("admin")`
