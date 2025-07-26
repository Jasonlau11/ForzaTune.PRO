# 生产环境部署配置指南

## 🏗️ **同一VPS部署方案**

### **方案一：Nginx反向代理（推荐）**

#### 1. **前端构建配置**

创建 `.env.production`：
```bash
# 生产环境配置
VITE_USE_API=true
VITE_USE_PROXY=true  # 启用代理模式
# 不需要设置 VITE_API_BASE_URL，使用相对路径 /api
```

#### 2. **构建前端**
```bash
npm run build
```

#### 3. **Nginx配置**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /var/www/forzatune-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (如果需要)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
    }
}
```

#### 4. **HTTPS配置（可选）**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 其余配置同上...
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

### **方案二：Node.js静态文件服务**

#### 1. **前端配置**
```bash
# .env.production
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api  # 直接指定后端地址
```

#### 2. **Express服务器代理**
```javascript
// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// API代理
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Frontend server running on http://localhost:3000');
});
```

---

## 🌍 **不同部署场景配置**

### **场景1：同一VPS，相对路径（推荐）**
```bash
# .env.production
VITE_USE_API=true
VITE_USE_PROXY=true
```
**优势**：无需配置具体地址，通过Nginx代理访问

### **场景2：同一VPS，完整地址**
```bash
# .env.production  
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api
```
**优势**：配置清晰，便于调试

### **场景3：分离部署**
```bash
# .env.production
VITE_USE_API=true
VITE_API_BASE_URL=https://api.your-domain.com/api
```
**适用**：前后端分别部署在不同服务器

### **场景4：CDN + API服务器**
```bash
# .env.production
VITE_USE_API=true
VITE_API_BASE_URL=https://api.your-domain.com/api
```
**适用**：前端部署到CDN，后端独立服务器

---

## 📋 **部署流程**

### **1. 准备服务器环境**
```bash
# 安装必要软件
sudo apt update
sudo apt install nginx nodejs npm

# 启动后端服务
cd /path/to/backend
java -jar your-backend-app.jar --server.port=8080

# 或者使用PM2管理
npm install -g pm2
pm2 start "java -jar your-backend-app.jar --server.port=8080" --name backend
```

### **2. 构建和部署前端**
```bash
# 本地构建
npm run build

# 上传到服务器
scp -r dist/ user@your-server:/var/www/forzatune-frontend/

# 或使用rsync
rsync -avz dist/ user@your-server:/var/www/forzatune-frontend/
```

### **3. 配置Nginx**
```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/forzatune

# 启用站点
sudo ln -s /etc/nginx/sites-available/forzatune /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

### **4. 验证部署**
```bash
# 检查前端
curl http://your-domain.com

# 检查API代理
curl http://your-domain.com/api/home/dashboard

# 检查服务状态
sudo systemctl status nginx
sudo netstat -tlnp | grep :8080  # 检查后端端口
```

---

## 🎯 **推荐配置总结**

### **开发环境**
```bash
# .env.local
VITE_USE_API=true  # 或false使用Mock
VITE_DEBUG=true
```

### **生产环境（同一VPS）**
```bash
# .env.production
VITE_USE_API=true
VITE_USE_PROXY=true  # 使用相对路径
VITE_DEBUG=false
```

### **生产环境（分离部署）**
```bash
# .env.production
VITE_USE_API=true
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_DEBUG=false
```

---

## ✅ **最佳实践**

1. **同一VPS部署时使用 `VITE_USE_PROXY=true`**
2. **通过Nginx反向代理管理路由**
3. **生产环境关闭调试日志**
4. **使用PM2管理后端进程**
5. **配置SSL证书启用HTTPS**
6. **设置适当的缓存策略**

这样配置后，您就可以在同一VPS上方便地部署前后端服务，无需处理跨域问题！🚀 