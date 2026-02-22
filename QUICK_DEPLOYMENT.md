# 🚀 Quick Start Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: https://github.com/phanindrareddy2006/Honeypot-CyberProject
- [ ] Create Vercel account (if not already done)
- [ ] Create Render account (if not already done)
- [ ] Have GitHub account connected to both services

---

## 📋 Deployment Steps (In Order)

### Step 1: Deploy Frontend to Vercel (5 mins)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Honeypot-CyberProject"** repository
4. **Root Directory**: Set to `Honeypot/honeypot-frontend` or `honeypot-frontend` (depending on your structure)
5. Click **Deploy**
6. Wait for deployment to complete
7. You'll get a URL like: `https://honeypot-frontend-xxx.vercel.app`

### Step 2: Deploy Backend to Render (5-10 mins)

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Select **"Honeypot-CyberProject"** repository
4. Configure:
   - **Name**: `honeypot-backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar Honeypot/target/Honeypot-0.0.1-SNAPSHOT.jar`
5. **Environment Variables**: Add these (if not using embedded database)
   ```
   SPRING_DATASOURCE_URL=your_database_url
   SPRING_DATASOURCE_USERNAME=your_db_user
   SPRING_DATASOURCE_PASSWORD=your_db_password
   ```
6. Click **Create Web Service**
7. Wait for first deployment
8. You'll get a URL like: `https://honeypot-backend.onrender.com`

### Step 3: Connect Frontend & Backend

1. Update frontend API URL in your code:
   - Go to `Honeypot/honeypot-frontend/src/`
   - Update any API calls to use: `https://honeypot-backend.onrender.com`

2. Update Backend CORS Settings:
   - Edit `Honeypot/Honeypot/src/main/java/com/example/honeypot/config/SecurityConfig.java` or `WebConfig.java`
   - Add allowed origin: `https://honeypot-frontend-xxx.vercel.app`

3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update API URLs for production"
   git push
   ```

4. Both Vercel and Render will auto-redeploy

### Step 4: Test

1. Visit your Vercel frontend URL
2. Test API calls to the backend
3. Check browser console for CORS or network errors
4. View logs in respective dashboards if issues occur

---

## 🔗 Your Deployment URLs (After Deployment)

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | `https://honeypot-frontend-xxx.vercel.app` |
| **Backend (Render)** | `https://honeypot-backend.onrender.com` |
| **GitHub Repo** | https://github.com/phanindrareddy2006/Honeypot-CyberProject |

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment status and logs
- See build history
- Check analytics and performance

### Render Dashboard
- View service status and logs
- Monitor resource usage
- Track deployment history

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Port 8080 already in use"** | Render uses dynamic PORT env var - it's handled automatically |
| **CORS errors** | Update allowed origins in backend config and redeploy |
| **Database connection failed** | Verify connection string and credentials in env vars |
| **Frontend can't reach backend** | Check API URL is correct and CORS is enabled |
| **Build fails** | Check build logs in respective dashboard, fix errors, commit and push |

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [React on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

## 🎯 Summary

You've already completed the hardest part - having production-ready code! Now:

1. **5 minutes**: Deploy frontend to Vercel
2. **10 minutes**: Deploy backend to Render
3. **5 minutes**: Configure CORS and API URLs
4. Done! 🎉

Your app will auto-redeploy whenever you push to GitHub's `main` branch.

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
