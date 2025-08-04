# 🚀 Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Database Setup (ngrok)
- [ ] Install ngrok: `https://ngrok.com/download`
- [ ] Start PostgreSQL server locally
- [ ] Run: `ngrok tcp 5432`
- [ ] Note the tunnel URL (format: `tcp://X.tcp.ngrok.io:XXXXX`)

### 2. Backend Preparation
- [ ] Update `settings_production.py` with your actual:
  - [ ] PythonAnywhere username
  - [ ] ngrok tunnel URL and port
  - [ ] Secret key (generate new one)
  - [ ] Vercel domain (after deployment)
- [ ] Update `.env.production` with actual values
- [ ] Test locally: `python manage.py runserver --settings=inventory_project.settings_production`

### 3. Frontend Preparation
- [ ] Update `.env.production` with your PythonAnywhere URL
- [ ] Test local build: `npm run build`
- [ ] Test preview: `npm run preview`

---

## 🔧 PythonAnywhere Deployment

### 1. Upload Files
- [ ] Zip `inventory_project` folder
- [ ] Upload to PythonAnywhere Files
- [ ] Extract in `/home/yourusername/`

### 2. Setup Environment
```bash
# In PythonAnywhere console
cd /home/yourusername/inventory_project
pip3.11 install --user -r requirements.txt
```

### 3. Web App Configuration
- [ ] Go to Web tab → Create new web app
- [ ] Choose Python 3.11
- [ ] Set source code: `/home/yourusername/inventory_project`
- [ ] Set working directory: `/home/yourusername/inventory_project`

### 4. WSGI Configuration
- [ ] Edit WSGI file in Web tab
- [ ] Copy content from `wsgi_production.py`
- [ ] Update username paths

### 5. Static Files
```bash
python manage.py collectstatic --settings=inventory_project.settings_production
```

### 6. Environment Variables (in PythonAnywhere console)
```bash
echo 'export DJANGO_SETTINGS_MODULE=inventory_project.settings_production' >> ~/.bashrc
source ~/.bashrc
```

### 7. Database Migration
```bash
python manage.py migrate --settings=inventory_project.settings_production
```

### 8. Create Superuser
```bash
python manage.py createsuperuser --settings=inventory_project.settings_production
```

---

## 🌐 Vercel Deployment

### 1. GitHub Setup
- [ ] Push `Inventory_frontend` to GitHub repository
- [ ] Ensure all files are committed

### 2. Vercel Configuration
- [ ] Go to https://vercel.com
- [ ] Connect GitHub account
- [ ] Import repository
- [ ] Set root directory: `Inventory_frontend`

### 3. Build Settings
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 4. Environment Variables in Vercel
- [ ] Add: `VITE_API_BASE_URL` = `https://yourusername.pythonanywhere.com/api`

### 5. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build completion
- [ ] Note your Vercel URL

---

## 🔧 Post-Deployment Configuration

### 1. Update Backend CORS (PythonAnywhere)
- [ ] Add Vercel URL to `CORS_ALLOWED_ORIGINS` in `settings_production.py`
- [ ] Add Vercel URL to `CSRF_TRUSTED_ORIGINS`
- [ ] Restart web app in PythonAnywhere

### 2. Update Frontend Environment
- [ ] Update Vercel environment variable if backend URL changes
- [ ] Redeploy if needed

---

## 🧪 Testing

### 1. Backend Testing
- [ ] Test API endpoints: `curl https://yourusername.pythonanywhere.com/api/products/`
- [ ] Check admin panel: `https://yourusername.pythonanywhere.com/admin/`
- [ ] Verify database connection

### 2. Frontend Testing
- [ ] Access Vercel URL
- [ ] Test login functionality
- [ ] Verify data loading
- [ ] Test all CRUD operations

### 3. Integration Testing
- [ ] Login flow works end-to-end
- [ ] Data syncs between frontend and backend
- [ ] Admin panel accessible
- [ ] Sales dashboard functional

---

## 🔒 Security Review

- [ ] Changed default SECRET_KEY
- [ ] DEBUG = False in production
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Database credentials secure
- [ ] Environment variables set correctly

---

## 📝 Important URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://yourusername.pythonanywhere.com`
- **API**: `https://yourusername.pythonanywhere.com/api/`
- **Admin**: `https://yourusername.pythonanywhere.com/admin/`
- **Database**: `tcp://X.tcp.ngrok.io:XXXXX` (via ngrok)

---

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in Django settings
2. **Database connection failed**: Verify ngrok tunnel is active
3. **Static files not loading**: Run `collectstatic` and check `STATIC_ROOT`
4. **502 Bad Gateway**: Check WSGI configuration and Python paths
5. **Frontend blank page**: Check browser console for API connection errors

### Logs to Check:
- PythonAnywhere error logs (Web tab)
- PythonAnywhere server logs
- Browser developer console
- Vercel deployment logs
- ngrok connection status
