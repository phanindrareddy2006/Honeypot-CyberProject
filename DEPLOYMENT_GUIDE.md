# Deployment Guide: Honeypot CyberSecurity Project

## Overview
This guide covers deploying your Honeypot project to:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Spring Boot Java)

---

## Part 1: Frontend Deployment on Vercel

### Prerequisites
- GitHub account connected to Vercel
- Code pushed to GitHub (✅ Already done)

### Steps:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `Honeypot-CyberProject`

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `honeypot-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard
   - Set backend API URL: `VITE_API_URL=https://honeypot-backend.onrender.com`

5. **Deploy**
   - Vercel will automatically deploy on every push to `main` branch
   - Your frontend will be available at: `https://honeypot-frontend-${username}.vercel.app`

---

## Part 2: Backend Deployment on Render

### Prerequisites
- Render account (https://render.com)
- GitHub account connected to Render
- Code pushed to GitHub (✅ Already done)

### Steps:

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select your `Honeypot-CyberProject` repository
   - Choose the appropriate branch: `main`

3. **Configure Service Settings**
   - **Name**: `honeypot-backend`
   - **Runtime**: Java
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free or Starter (depending on your needs)

4. **Build and Start Commands**
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar Honeypot/target/Honeypot-0.0.1-SNAPSHOT.jar`

5. **Environment Variables**
   Create a `.env.production` file or set in Render dashboard:
   ```
   SPRING_DATASOURCE_URL=your_database_url
   SPRING_DATASOURCE_USERNAME=your_db_username
   SPRING_DATASOURCE_PASSWORD=your_db_password
   SPRING_JPA_HIBERNATE_DDL_AUTO=validate
   SPRING_JPA_SHOW_SQL=false
   ```

6. **Database Option** (Choose One)

   **Option A: PostgreSQL on Render**
   - Create a PostgreSQL database on Render
   - Link it to your web service
   - Render will auto-inject connection variables

   **Option B: External Database**
   - Use your existing database service
   - Add connection details to environment variables

7. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy on every push to `main` branch
   - Your backend will be available at: `https://honeypot-backend.onrender.com`

---

## Part 3: Connect Frontend to Backend

After both are deployed, update your frontend API calls:

1. **Update Frontend Configuration**
   - In `honeypot-frontend/.env` or your API configuration:
   ```javascript
   VITE_API_URL=https://honeypot-backend.onrender.com
   ```

2. **CORS Configuration** (Backend)
   - Update `SecurityConfig.java` to allow Vercel domain:
   ```java
   // In your Spring Boot config
   allowedOrigins = "https://honeypot-frontend-${username}.vercel.app"
   ```

3. **Redeploy**
   - Push changes to GitHub
   - Both Vercel and Render will auto-deploy

---

## Monitoring & Logs

### Vercel
- View logs in Vercel dashboard → "Deployments" → "Functions"
- Monitor with [Vercel Analytics](https://vercel.com/analytics)

### Render
- View logs in Render dashboard → "Logs" section
- Check application runs in "Events" tab

---

## Troubleshooting

### Frontend Issues
- **Build fails**: Check `package.json` scripts exist
- **404 errors**: Ensure `vercel.json` rewrite rules are correct
- **API calls fail**: Verify `VITE_API_URL` environment variable

### Backend Issues
- **Won't start**: Check Java version (17+) and JAR file path
- **Database connection fails**: Verify connection strings in env vars
- **CORS errors**: Update allowed origins in SecurityConfig.java
- **Port issues**: Render assigns dynamic PORT via env var - use `System.getenv("PORT")`

---

## Auto-Deployment

Both platforms support automatic deployments:
- **Vercel**: Deploys on every push to `main`, pull requests create preview deployments
- **Render**: Deploys on every push to connected branch

To disable auto-deploy, configure in respective dashboards.

---

## Next Steps

1. ✅ Code pushed to GitHub
2. 🔄 Deploy frontend to Vercel
3. 🔄 Deploy backend to Render
4. 🔄 Configure CORS and API URLs
5. 🧪 Test the full application

---

## Support

For issues:
- **Vercel Support**: https://vercel.com/support
- **Render Support**: https://render.com/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
