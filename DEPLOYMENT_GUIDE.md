# 🚀 Deployment Guide: Inventory Management System

## Architecture Overview
- **Database**: PostgreSQL exposed via ngrok tunnel
- **Backend**: Django REST API hosted on PythonAnywhere
- **Frontend**: React/TypeScript app deployed on Vercel

---

## 🗄️ Step 1: Database Setup (ngrok)

### 1.1 Install ngrok
```bash
# Download from https://ngrok.com/download
# Extract and add to PATH
```

### 1.2 Start PostgreSQL tunnel
```bash
# Start your local PostgreSQL server first
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Create ngrok tunnel (replace with your PostgreSQL port)
ngrok tcp 5432
```

### 1.3 Note the ngrok details
```
# Example output:
# Session Status: online
# Forwarding: tcp://2.tcp.ngrok.io:12345 -> localhost:5432
```

**Important**: 
- Keep ngrok running throughout development/testing
- The tunnel URL changes each time you restart ngrok (use paid plan for static URLs)
- Update your database connection settings with the ngrok URL

---

## 🔧 Step 2: Backend Deployment (PythonAnywhere)

### 2.1 Prepare production settings
Create `/Inv/inventory_project/inventory_project/settings_production.py`

### 2.2 Create requirements.txt
```bash
cd /Inv/inventory_project
pip freeze > requirements.txt
```

### 2.3 PythonAnywhere Setup Steps:

1. **Upload your code**:
   - Zip your `inventory_project` folder
   - Upload to PythonAnywhere Files section
   - Extract in `/home/yourusername/`

2. **Install dependencies**:
   ```bash
   pip3.11 install --user -r requirements.txt
   ```

3. **Configure WSGI**:
   - Go to Web tab → Create new web app
   - Choose Django
   - Edit WSGI configuration file

4. **Environment Variables**:
   - Set in Files → .env or via console
   - Database connection to ngrok tunnel
   - Secret keys and production settings

5. **Static Files**:
   ```bash
   python manage.py collectstatic
   ```

6. **Database Migration**:
   ```bash
   python manage.py migrate
   ```

### 2.4 Expected Backend URL:
```
https://yourusername.pythonanywhere.com/api/
```

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Update API configuration
Update all API base URLs to point to your PythonAnywhere backend

### 3.2 Vercel Deployment:

1. **Push to GitHub**:
   - Push `Inventory_frontend` folder to GitHub repository

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select `Inventory_frontend` as root directory

3. **Environment Variables**:
   - Add `VITE_API_BASE_URL=https://yourusername.pythonanywhere.com/api`

4. **Build Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3.3 Expected Frontend URL:
```
https://your-app-name.vercel.app
```

---

## 🔒 Step 4: Security & Configuration Updates

### 4.1 Update CORS Settings
Add your Vercel domain to Django CORS settings

### 4.2 Update Allowed Hosts
Add PythonAnywhere domain to Django ALLOWED_HOSTS

### 4.3 Environment Variables Summary

**Backend (.env for PythonAnywhere)**:
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourusername.pythonanywhere.com
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=2.tcp.ngrok.io
DB_PORT=12345
```

**Frontend (Vercel Environment Variables)**:
```
VITE_API_BASE_URL=https://yourusername.pythonanywhere.com/api
```

---

## 🧪 Step 5: Testing Deployment

### 5.1 Test Database Connection
```bash
# From PythonAnywhere console
python manage.py dbshell
```

### 5.2 Test API Endpoints
```bash
curl https://yourusername.pythonanywhere.com/api/products/
```

### 5.3 Test Frontend
- Access your Vercel URL
- Test login functionality
- Verify data loading from backend

---

## 📝 Important Notes

1. **ngrok Limitations**:
   - Free tier has session limits
   - URL changes on restart
   - Consider upgrading for production

2. **PythonAnywhere Limitations**:
   - Free tier has CPU seconds limit
   - Limited outbound internet access
   - Consider upgrading for production

3. **Security Considerations**:
   - Use environment variables for sensitive data
   - Enable HTTPS only in production
   - Implement rate limiting
   - Regular security updates

4. **Backup Strategy**:
   - Regular database backups
   - Code repository backups
   - Environment configuration backups

---

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS_ALLOWED_ORIGINS in Django settings
2. **Database Connection**: Verify ngrok tunnel is active
3. **Static Files**: Run `collectstatic` on PythonAnywhere
4. **Environment Variables**: Check all required variables are set
5. **API Endpoints**: Verify URL patterns and trailing slashes

### Logs to Check:
- PythonAnywhere error logs
- Browser developer console
- Vercel deployment logs
- ngrok connection logs
