# ArviOps - Inventory Management System

**Arvi Edibles - Food Industry (Edible Oils)**

A modern web application for managing product inventory, stock movements, and revenue tracking for Arvi Edibles.

## Project Structure

```
ArviOps - Inventory Management System/
├── backend/                 # Node.js Express server
│   ├── models/             # Database schemas (Product, StockMovement)
│   ├── controllers/        # Business logic for API endpoints
│   ├── routes/             # API route definitions
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ProductList.js
│   │   │   ├── ProductForm.js
│   │   │   └── StockMovement.js
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # Styling
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
│
└── README.md              # This file
```

## Features

✅ **Product Inventory Management**
- Add, edit, and delete SKUs
- Track product variants and pricing
- Reorder level configuration

✅ **Stock Level Management**
- Log stock IN (receipts) and OUT (dispatch)
- Real-time stock balance updates
- Stock movement history per product

✅ **Stock Health Indicators**
- Green: Sufficient stock
- Amber: Low stock (at reorder level)
- Red: Critical (out of stock)

✅ **User-Friendly Interface**
- Responsive React-based dashboard
- Modern UI with smooth interactions
- Real-time data updates

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (Local or Atlas connection)

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit .env file if needed:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/arviops
# - NODE_ENV=development
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already done)
npm install
```

### 3. MongoDB Setup

For local MongoDB:
```bash
# Make sure MongoDB is running on your machine
# Default connection: mongodb://localhost:27017/arviops
```

For MongoDB Atlas (Cloud):
```bash
# Update MONGODB_URI in backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arviops
```

## Running the Application

### Terminal 1 - Start Backend Server

```bash
cd backend
npm start          # Run with node
# OR
npm run dev        # Run with nodemon (auto-restart on changes)
```

Backend will be running at: `http://localhost:5000`

### Terminal 2 - Start Frontend Server

```bash
cd frontend
npm start
```

Frontend will automatically open at: `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock Movements
- `POST /api/stock-movements` - Log stock movement (IN/OUT)
- `GET /api/stock-history/:productId` - Get movement history

### Health Check
- `GET /api/health` - Server status

## Example API Requests

### Create a Product
```json
POST /api/products
{
  "sku": "ARVI-OIL-001",
  "productName": "Sunflower Oil",
  "variant": "1L Bottle",
  "currentStock": 100,
  "reorderLevel": 20,
  "costPrice": 150,
  "sellingPrice": 200
}
```

### Log Stock Movement
```json
POST /api/stock-movements
{
  "productId": "6xxxxx...",
  "movementType": "OUT",
  "quantity": 10,
  "notes": "Customer dispatch - Order #123"
}
```

## Development

### Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- CORS for cross-origin requests
- dotenv for environment management

**Frontend:**
- React 19+
- CSS3 for styling
- Fetch API for HTTP requests

### Project Timeline
- **Deadline:** 30th June 2026
- **Status:** Active Development

### Team
- Devanandi Abhiram (252U1R7029)
- Mathamsetty Hithesh (252U1R7063)
- Hatawate Hariom Navnath (252U1R7042)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct in `.env`
- Check firewall settings if using MongoDB Atlas

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Change port in package.json or use: `PORT=3001 npm start`

### CORS Errors
- Backend CORS is configured to accept requests from frontend
- Ensure backend is running before starting frontend

### React Dependencies Issues
```bash
cd frontend
npm install
npm start
```

## Future Enhancements

- Revenue and expense tracking dashboard
- Advanced reporting and analytics
- User authentication and role management
- Email notifications for low stock
- Batch import/export functionality
- Mobile app version

## Confidentiality Notice

This project is part of the Aurora Institute of Technology Industry Internship Programme.
**Confidential - For Assigned Team Only**

---

**Version:** v1.0 - Final
**Last Updated:** 2026-06-26
