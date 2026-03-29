# Online Cloth Shopping - Full Stack E-commerce Application

A complete e-commerce platform for online cloth shopping with separate frontend, backend, and admin panel.

## 🚀 Features

### Frontend (Customer-facing)
- Product browsing and search
- Shopping cart functionality
- User authentication and profiles
- Order placement and tracking
- Wishlist management
- Payment integration (Razorpay)
- Responsive design with Tailwind CSS

### Backend (API Server)
- RESTful API with Express.js
- MongoDB database with Mongoose
- JWT authentication
- Cloudinary image upload
- Payment processing (Stripe & Razorpay)
- Order management
- User management

### Admin Panel
- Dashboard with analytics
- Product management (CRUD)
- Category and subcategory management
- Order management
- User management
- Image upload functionality

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for image uploads)
- **Stripe** account (for payments)
- **Razorpay** account (for payments)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd online-cloth-shopping
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### Admin Panel
```bash
cd admin
npm install
```

### 3. Environment Setup

Create `.env` files in the respective directories:

#### Backend `.env`
```env
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=your_admin_email_here
ADMIN_PASSWORD=your_admin_password_here
MONGODB_URI=your_mongodb_connection_string_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

#### Frontend `.env`
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

#### Admin `.env`
```env
VITE_BACKEND_URL=http://localhost:4000
```

## 🚀 Running the Application

### Option 1: Using PowerShell Script (Windows)
```powershell
.\start-local.ps1
```

This will start:
- Backend on http://localhost:4000
- Frontend on http://127.0.0.1:5174
- Admin on http://127.0.0.1:5175

### Option 2: Manual Start

#### Start Backend
```bash
cd backend
npm run server
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

#### Start Admin Panel
```bash
cd admin
npm run dev
```

## 📁 Project Structure

```
online-cloth-shopping/
├── backend/           # Express.js API server
│   ├── config/       # Database and cloudinary config
│   ├── controllers/  # Route controllers
│   ├── middleware/    # Auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
├── frontend/         # React customer app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
├── admin/            # React admin panel
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
├── DEPLOYMENT.md     # Deployment guide
└── start-local.ps1   # Local startup script
```

## 🔐 Default Admin Credentials

- **Email:** admin@example.com
- **Password:** greatstack123

## 🌐 API Endpoints

### User Routes
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile

### Product Routes
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product
- `PUT /api/product/update` - Update product
- `DELETE /api/product/remove` - Delete product

### Order Routes
- `POST /api/order/place` - Place order
- `GET /api/order/list` - Get all orders
- `PUT /api/order/status` - Update order status

### Cart Routes
- `POST /api/cart/add` - Add to cart
- `GET /api/cart/get` - Get cart items
- `PUT /api/cart/update` - Update cart

## 🚀 Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy (Vercel)
1. Deploy backend to Vercel
2. Deploy frontend to Vercel
3. Deploy admin to Vercel
4. Update environment variables with deployed URLs

## 🛡️ Security Notes

- Never commit `.env` files to version control
- Use strong passwords and secrets
- Enable MongoDB authentication
- Use HTTPS in production
- Regularly update dependencies

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Piyush Ambaliya**
- GitHub: [@Piyush3954](https://github.com/Piyush3954)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database
- Cloudinary for image hosting
- Stripe and Razorpay for payment processing
