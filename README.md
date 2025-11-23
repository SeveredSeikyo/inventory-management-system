# Inventory Management System

A full-stack inventory management application built with React, Node.js, Express, and SQLite. This system provides comprehensive product tracking, inventory history, import/export capabilities, and user authentication.

## 🚀 Features

### Core Features
- **Product Management**: Create, read, update, and delete products with inline editing
- **Inventory Tracking**: Automatic history logging for all stock changes
- **Import/Export**: Bulk operations via CSV files
- **Search & Filter**: Real-time search and category-based filtering
- **Stock Status**: Visual indicators for stock availability (In Stock/Out of Stock)
- **Responsive Design**: Mobile-friendly interface

### Bonus Features
- **Authentication**: Secure JWT-based user authentication
- **Client-Side Pagination & Sorting**: Efficient data handling for large inventories
- **Unit Testing**: Comprehensive test coverage for critical components
- **History Sidebar**: Detailed view of inventory changes per product

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **File Upload**: Multer
- **CSV Parsing**: csv-parser
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Testing**: Jest, React Testing Library
- **Styling**: CSS3 with Flexbox/Grid

## 📁 Project Structure

```
inventory-management-app/
├── backend/
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT authentication middleware
│   ├── models/
│   │   └── db.js                   # Database initialization & queries
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication endpoints
│   │   ├── history.routes.js       # Inventory history endpoints
│   │   ├── products.routes.js      # Product CRUD endpoints
│   │   └── uploads.routes.js       # Import/Export endpoints
│   ├── utils/
│   │   ├── auth.validator.js       # Auth validation rules
│   │   └── products.validators.js  # Product validation rules
│   ├── __tests__/
│   │   ├── auth.test.js           # Authentication tests
│   │   └── product.test.js        # Product API tests
│   ├── uploads/                    # Temporary file uploads
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── inventory.db                # SQLite database
│   ├── .env.example               # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/                     # Static assets
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios configuration
    │   ├── components/
    │   │   ├── HeaderBar/         # Top navigation bar
    │   │   ├── HistorySidebar/    # Inventory history display
    │   │   ├── ImportModal/       # CSV import dialog
    │   │   ├── InlineEditor/      # Inline product editing
    │   │   └── ProductsTable/     # Product list table
    │   ├── hooks/
    │   │   ├── useAuth.js         # Authentication hook
    │   │   └── useProducts.js     # Product data hook
    │   ├── pages/
    │   │   ├── Dashboard.js       # Main product dashboard
    │   │   ├── Login.js           # Login page
    │   │   └── Signup.js          # Registration page
    │   ├── routes/
    │   │   ├── ProtectedRoute.js  # Auth-protected routes
    │   │   └── PublicRoute.js     # Public routes
    │   ├── utils/
    │   │   └── debounce.js        # Debounce utility
    │   ├── App.js                  # Root component
    │   └── index.js                # Entry point
    ├── .env.example               # Environment variables template
    └── package.json
```

## ✅ Prerequisites

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Git**: For cloning the repository

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/inventory-management-app.git
cd inventory-management-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Copy the environment template:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

1. Copy the environment template:
```bash
cd frontend
cp .env.example .env
```

2. Edit `.env` with your backend URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | Yes |
| GET | `/api/products/:id` | Get single product | Yes |
| POST | `/api/products` | Create new product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

**Query Parameters for GET `/api/products`:**
- `search`: Search by product name (optional)
- `category`: Filter by category (optional)

**Note:** Pagination and sorting are handled client-side for better performance with the current dataset size.

### Import/Export Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/products/import` | Import products from CSV | Yes |
| GET | `/api/products/export` | Export products to CSV | Yes |

### History Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/:id/history` | Get inventory history for product | Yes |

### Example Requests

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

**Get Products:**
```bash
curl -X GET "http://localhost:5000/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Search Products:**
```bash
curl -X GET "http://localhost:5000/api/products?search=laptop&category=Electronics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Import CSV:**
```bash
curl -X POST http://localhost:5000/api/products/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "csvFile=@products.csv"
```

**Export CSV:**
```bash
curl -X GET http://localhost:5000/api/products/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o products.csv
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                  # Run all tests
npm test -- --coverage   # Run with coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm test -- --coverage  # Run with coverage report
```

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push your code to GitHub
2. Connect your repository to your hosting service
3. Set environment variables in the hosting dashboard:
   - `PORT`
   - `NODE_ENV=production`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CORS_ORIGIN` (your frontend URL)
4. Deploy command: `npm start`
5. Note the deployed backend URL

### Frontend Deployment (Netlify/Vercel)

1. Update `.env` with your production backend URL:
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```
2. Build the application: `npm run build`
3. Deploy the `build` folder
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

### Important Deployment Notes

- **CORS Configuration**: Update `CORS_ORIGIN` in backend `.env` to match your deployed frontend URL
- **Database**: SQLite works for small deployments. For production with multiple instances, consider migrating to PostgreSQL or MySQL
- **HTTPS**: Ensure both frontend and backend are served over HTTPS
- **JWT Secret**: Use a strong, random JWT secret in production (minimum 32 characters)
- **Environment Variables**: Never commit `.env` files. Always use `.env.example` as a template

## 📝 CSV Import Format

Your CSV file should follow this structure:

```csv
name,unit,category,brand,stock,status,image
Product A,pcs,Electronics,BrandX,100,active,http://example.com/image.jpg
Product B,kg,Food,BrandY,50,active,http://example.com/image2.jpg
```

**Required Fields:**
- `name`: Product name (must be unique)
- `stock`: Stock quantity (integer)

**Optional Fields:**
- `unit`: Unit of measurement (e.g., pcs, kg, liters)
- `category`: Product category (e.g., Electronics, Food, Clothing)
- `brand`: Brand name
- `status`: Product status (e.g., active, discontinued)
- `image`: Image URL

**Import Notes:**
- Duplicate product names will be skipped
- The API returns a summary of imported and skipped products
- Invalid rows are logged and can be reviewed

## 🔧 Available Scripts

### Backend Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm test -- --coverage`: Run tests with coverage

### Frontend Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests in watch mode
- `npm run eject`: Eject from Create React App (one-way operation)