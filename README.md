# 🌸 FlowerVerse - Your online flower marketplace

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-API-orange.svg)](https://cloudinary.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)

Welcome to **FlowerVerse**! 🌼 Your online flower marketplace for browsing, ordering, and managing premium floral products. This project lets customers shop, save items, place orders, and manage their accounts securely, while sellers can create and update listings with Cloudinary-powered image uploads.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📖 Usage](#-usage)
- [🔗 API Endpoints](#-api-endpoints)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- 🔐 **User Authentication**: Secure login, registration, password reset, and account management.
- 🛒 **Shopping Cart**: Add, update, and remove items from the cart.
- 📦 **Order Management**: Place orders, view order history, and track status.
- 🌺 **Flower Listings**: Browse, create, edit, and delete flower products with image uploads.
- ☁️ **Cloudinary Integration**: Seamless image uploads for flower photos.
- 📧 **Email Notifications**: Automated emails for orders and password resets.
- 🔒 **Protected Routes**: Secure access to user-specific pages.
- 📱 **Responsive Design**: Optimized for desktop and mobile devices.

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer + Cloudinary
- **Email**: Nodemailer
- **AI**: Ollama (local inference)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: React Context API
- **Styling**: CSS Modules
- **HTTP Client**: Axios

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint
- **Environment**: dotenv for configuration

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Cloudinary account for image uploads

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/flowerverse.git
   cd flowerverse
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set Up Environment Variables**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories.
   - Fill in your MongoDB URI, JWT secret, Cloudinary credentials, and email settings.
   - Refer to [EMAIL_SETUP.md](EMAIL_SETUP.md) for email configuration.

5. **Start the Backend Server**

   ```bash
   cd backend
   npm start
   ```

   The server will run on `http://localhost:5000`.

6. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flowerrmart
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
OLLAMA_TIMEOUT_MS=30000
```

The AI endpoints use Ollama's local API. Install Ollama, start it, and download
the configured model before starting the backend:

```bash
ollama serve
ollama pull llama3.2
```

#### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

For detailed email setup, see [EMAIL_SETUP.md](EMAIL_SETUP.md).

## 📖 Usage

1. **Register/Login**: Create an account or log in to access the platform.
2. **Browse Flowers**: View available flowers on the home page.
3. **Add to Cart**: Click "Add to Cart" on flower details.
4. **Checkout**: Review cart and place orders.
5. **Manage Listings** (Sellers): Create, edit, or delete your flower products.
6. **View Orders**: Check order history and status.

### Screenshots

_(Add screenshots here if available)_

## 🔗 API Endpoints

For a complete list of API endpoints and testing instructions, refer to [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md).

### Key Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Flowers

- `GET /api/flowers` - Get all flowers
- `POST /api/flowers` - Create a new flower (authenticated)
- `PUT /api/flowers/:id` - Update a flower (owner only)
- `DELETE /api/flowers/:id` - Delete a flower (owner only)

#### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

#### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Place a new order

## 📁 Project Structure

```
flowerverse/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── lib/            # Database and utility classes
│   │   ├── middleware/     # Authentication and file upload middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Cloudinary and email utilities
│   ├── package.json
│   └── index.js            # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios configuration
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React Context for state management
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── index.html          # HTML template
├── API_TESTING_GUIDE.md    # API documentation
├── EMAIL_SETUP.md          # Email configuration guide
└── README.md               # This file
```

## 🧪 Testing

### API Testing

Use tools like Postman or Thunder Client to test the API endpoints. Refer to [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for detailed instructions and sample requests.

### Running Tests

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for flower lovers everywhere! 🌻
