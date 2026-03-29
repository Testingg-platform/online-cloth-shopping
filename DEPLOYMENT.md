# Deployment Guide for Online Cloth Shopping Application

## ✅ Code Successfully Pushed to GitHub

Your code has been successfully pushed to: `https://github.com/Piyush3954/clothing.git`

---

## Deployment Options

This project consists of three parts that need to be deployed separately:

1. **Backend** (Node.js/Express API) - Deploy to Vercel
2. **Frontend** (React/Vite) - Deploy to Vercel or Netlify
3. **Admin Panel** (React/Vite) - Deploy to Vercel or Netlify

---

## Option 1: Deploy All to Vercel (Recommended)

### Step 1: Deploy Backend

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import the `Piyush3954/clothing` repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (uses default)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables (click "Environment Variables"):
   ```
   JWT_SECRET = your_jwt_secret_here
   ADMIN_EMAIL = your_admin_email_here
   ADMIN_PASSWORD = your_admin_password_here
   MONGODB_URI = your_mongodb_connection_string_here
   CLOUDINARY_API_KEY = your_cloudinary_api_key_here
   CLOUDINARY_SECRET_KEY = your_cloudinary_secret_key_here
   CLOUDINARY_NAME = your_cloudinary_name_here
   STRIPE_SECRET_KEY = your_stripe_secret_key_here
   RAZORPAY_KEY_ID = your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET = your_razorpay_key_secret_here
   ```
   
   ⚠️ **Important**: Get these values from your `.env` file (which is not committed to Git for security).

6. Click "Deploy"
7. After deployment, copy the backend URL (e.g., `https://backend-xyz.vercel.app`)

### Step 2: Deploy Frontend

1. Go to Vercel dashboard → "Add New..." → "Project"
2. Import the same `Piyush3954/clothing` repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   VITE_BACKEND_URL = https://your-backend-url.vercel.app
   VITE_RAZORPAY_KEY_ID = your_razorpay_key_id_here
   ```
   
   ⚠️ **Important**: 
   - Replace `https://your-backend-url.vercel.app` with your actual backend URL
   - Get `VITE_RAZORPAY_KEY_ID` from your `.env` file (which is not committed to Git for security)

5. Click "Deploy"
6. After deployment, copy the frontend URL

### Step 3: Deploy Admin Panel

1. Go to Vercel dashboard → "Add New..." → "Project"
2. Import the same `Piyush3954/clothing` repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   VITE_BACKEND_URL = https://your-backend-url.vercel.app
   ```
   
   ⚠️ **Important**: Replace `https://your-backend-url.vercel.app` with your actual backend URL

5. Click "Deploy"
6. After deployment, copy the admin URL

---

## Option 2: Deploy Frontend/Admin to Netlify

### For Frontend:

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and choose `Piyush3954/clothing`
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Add Environment Variables (Site settings → Environment variables):
   ```
   VITE_BACKEND_URL = https://your-backend-url.vercel.app
   VITE_RAZORPAY_KEY_ID = your_razorpay_key_id_here
   ```
   
   ⚠️ **Important**: 
   - Replace `https://your-backend-url.vercel.app` with your actual backend URL
   - Get `VITE_RAZORPAY_KEY_ID` from your `.env` file (which is not committed to Git for security)

6. Click "Deploy site"

### For Admin Panel:

Follow the same steps as Frontend, but use:
- **Base directory**: `admin`
- **Publish directory**: `admin/dist`
- Environment Variables:
  ```
  VITE_BACKEND_URL = https://your-backend-url.vercel.app
  ```
  
  ⚠️ **Important**: Replace `https://your-backend-url.vercel.app` with your actual backend URL

---

## Post-Deployment Configuration

### Update CORS Settings (if needed)

If you encounter CORS errors, update the backend's CORS configuration to allow your frontend and admin domains.

### Update Backend URL in Frontend/Admin

After deploying the backend, update the `VITE_BACKEND_URL` in both frontend and admin environment variables to point to your deployed backend URL.

---

## Testing the Deployment

1. **Backend API**: Visit `https://your-backend-url.vercel.app/api/products` to test the API
2. **Frontend**: Visit your frontend URL to test the shopping experience
3. **Admin Panel**: Visit your admin URL to test the admin dashboard

---

## Default Admin Credentials

- **Email**: admin@example.com
- **Password**: greatstack123

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure backend CORS is configured to allow frontend/admin domains
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Failures**: Check build logs in Vercel/Netlify dashboard
4. **API Connection**: Verify `VITE_BACKEND_URL` is correct and accessible

### Support:

- Check Vercel/Netlify deployment logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Test API endpoints directly using tools like Postman

---

## Security Notes

⚠️ **Important**: The `.env` files contain sensitive credentials. Never commit them to version control. Always use environment variables in your deployment platform.

---

## Quick Reference

| Component | Platform | Root Directory | Build Command | Output Directory |
|-----------|----------|----------------|---------------|------------------|
| Backend   | Vercel   | `backend`      | -             | -                |
| Frontend  | Vercel   | `frontend`     | `npm run build` | `dist`          |
| Admin     | Vercel   | `admin`        | `npm run build` | `dist`          |

---

**Last Updated**: 2026-03-27
