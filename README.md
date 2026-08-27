# BloomCart

BloomCart is a full-stack flower marketplace. Customers can browse flowers and
mixed bouquets, create accounts, manage addresses, add products to a cart,
checkout, view orders, and leave reviews. Administrators can manage flowers,
users, roles, orders, and dashboard statistics.

The repository contains a React frontend, an Express API, MongoDB persistence,
optional Redis caching, Cloudinary image uploads, email notifications, and an
optional Ollama-powered flower assistant.

## What is in the project

### Customer features

- Registration, login, logout, token refresh, and password reset
- Account, security, address, and account-removal pages
- Flower catalog, flower details, sorting, filtering, and mixed bouquets
- Shopping cart and checkout
- Customer order history and order cancellation
- Flower reviews and ratings
- Protected flower assistant page for product and support questions

### Administrator features

- Admin dashboard with user and order statistics
- Create, update, and delete flower listings
- Cloudinary image upload support
- View and manage users and user roles
- View seller orders and update order status

### Backend API

The API is an Express application in `backend/src`. Its route groups are:

| Base path      | Responsibility                                              |
| -------------- | ----------------------------------------------------------- |
| `/api/auth`    | Authentication, account, password, and address operations   |
| `/api/flowers` | Flower catalog and admin flower management                  |
| `/api/cart`    | Cart operations                                             |
| `/api/orders`  | Checkout, customer orders, seller orders, and cancellations |
| `/api/reviews` | Flower reviews                                              |
| `/api/admin`   | Admin users, statistics, and orders                         |
| `/api/ai`      | Optional Ollama flower assistant                            |
| `/health`      | Backend health check                                        |

## Technology

- **Frontend:** React 19, React Router, Vite, Tailwind CSS, Framer Motion,
  Lucide icons, Axios, and React Context
- **Backend:** Node.js, Express 5, Mongoose, MongoDB, JWT, bcrypt, Multer,
  Cloudinary, Nodemailer, and Redis
- **Optional AI:** Ollama and the configured local model
- **Deployment:** Dockerfiles for frontend and backend, plus Docker Compose

## Requirements

For local development:

- Node.js 20 or newer
- npm
- MongoDB, local or hosted
- Cloudinary credentials for flower image uploads
- SMTP credentials for password-reset and order emails

Redis is included by `docker-compose.yml`. Ollama is not required for the
store or for production. It is only needed if the AI assistant is enabled.

## Local development

1. Install dependencies:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Create `backend/.env` from `backend/.env.example` and provide the required
   database, authentication, Cloudinary, email, and frontend settings.

3. Create `frontend/.env`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the backend in one terminal:

   ```bash
   cd backend
   npm run dev
   ```

5. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

Open `http://localhost:5173`. The backend listens on `http://localhost:3000`.

## Environment variables

### Backend

Copy `backend/.env.example` to `backend/.env` and configure at least:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/flowerrmart
ACCESS_TOKEN_SECRET=replace_with_a_long_secret
REFRESH_TOKEN_SECRET=replace_with_a_different_long_secret
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Cloudinary and email settings are required for image uploads and email
notifications:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

Redis can be configured with `REDIS_URL`. Compose overrides it with
`redis://redis:6379`.

Ollama is optional:

```env
OLLAMA_ENABLED=false
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
OLLAMA_TIMEOUT_MS=120000
```

Keep `OLLAMA_ENABLED=false` in production. To use the assistant locally, set
it to `true`, run Ollama, and install the configured model:

```bash
ollama serve
ollama pull llama3.2
```

When disabled, the backend still starts and all non-AI marketplace features
remain available. The AI endpoint returns an unavailable response.

## Docker Compose

The root `docker-compose.yml` starts Redis, the backend, and the Nginx-served
frontend:

```bash
docker compose up --build
```

Before starting Compose, create `backend/.env`. The frontend is available at
`http://localhost:5173` and the API at `http://localhost:3000`.

The Compose file does not start MongoDB or Ollama. Provide a reachable
`MONGO_URI`; leave Ollama disabled unless it is hosted separately and explicitly
enabled.

## Useful commands

```bash
# Backend
cd backend
npm start                 # production-style start
npm run dev               # start with nodemon

# Frontend
cd frontend
npm run dev               # development server
npm run build             # production build
npm run lint              # ESLint
```

There are currently no automated test scripts configured in the backend or
frontend packages.

## Repository structure

```text
BloomCart/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers and business operations
│   │   ├── lib/           # Database, Redis, API, and Ollama helpers
│   │   ├── middleware/    # Authentication, admin, and upload middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express route definitions
│   │   └── utils/         # Cloudinary and email integrations
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios API client
│   │   ├── components/    # Shared UI and admin components
│   │   ├── contexts/      # Auth, cart, flower, order, and address state
│   │   └── pages/         # Application screens
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── package.json
└── README.md
```

## Security notes

- Do not commit `.env` files or real credentials.
- Use separate, long secrets for access and refresh tokens.
- Set `COOKIE_SECURE=true` and configure the production frontend origin when
  running behind HTTPS.
- Keep Ollama disabled in production unless the AI service is intentionally
  deployed and secured.
