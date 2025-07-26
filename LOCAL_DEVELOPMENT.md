# 本地开发环境配置指南

## 🎯 快速开始

### 1. 后端服务确认
确保您的后端服务运行在：
```
http://localhost:8080
```

接口基础路径：
```
http://localhost:8080/api
```

### 2. 前端配置

创建 `.env.local` 文件：
```bash
# 本地联调配置
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG=true
```

### 3. 启动前端
```bash
npm run dev
```

## 📋 接口端点确认

### 首页数据
- **URL**: `GET http://localhost:8080/api/home/dashboard`
- **用途**: 获取热门车辆、最新调校、Pro调校、统计信息

### 调校相关
- **获取详情**: `GET http://localhost:8080/api/tunes/{id}`
- **创建调校**: `POST http://localhost:8080/api/tunes`
- **点赞**: `POST http://localhost:8080/api/tunes/{id}/like`
- **收藏**: `POST http://localhost:8080/api/tunes/{id}/favorite`

## 🔧 调试技巧

### 1. 检查数据源状态
- 页面右上角会显示当前数据源：**API** 或 **Mock**
- 控制台会输出连接信息

### 2. 网络请求调试
打开浏览器开发者工具 → Network 标签页，查看：
- API请求是否发送到正确地址
- 响应状态码和数据格式
- 请求耗时

### 3. 控制台日志
启用调试模式后会看到：
```
[DataService] 数据源模式: API
[DataService] API地址: http://localhost:8080/api
[API Client] 基础URL: http://localhost:8080/api
[API Request] GET /home/dashboard
[API Response] 200 /home/dashboard
```

## ❌ 常见问题

### Q1: 页面显示"Mock"而不是"API"
**检查项**:
1. `.env.local` 文件是否正确配置
2. 是否重启了开发服务器
3. 浏览器缓存清理

**解决方案**:
```bash
# 删除 .env.local 重新创建
rm .env.local

# 重新创建配置
echo "VITE_USE_API=true" > .env.local
echo "VITE_API_BASE_URL=http://localhost:8080/api" >> .env.local
echo "VITE_DEBUG=true" >> .env.local

# 重启开发服务器
npm run dev
```

### Q2: API请求失败，自动降级到Mock
**检查项**:
1. 后端服务是否运行在8080端口
2. 接口路径是否正确（需要 `/api` 前缀）
3. CORS配置是否正确

**测试后端连通性**:
```bash
# 测试基础连接
curl http://localhost:8080/api/home/dashboard

# 或在浏览器访问
http://localhost:8080/api/home/dashboard
```

### Q3: CORS跨域错误
**后端需要配置CORS允许**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Q4: 网络请求超时
**检查项**:
1. 后端响应速度
2. 网络连接状态
3. 防火墙设置

## 🔄 数据源切换

### 临时切换到Mock模式（不修改配置文件）
```bash
VITE_USE_API=false npm run dev
```

### 切换回API模式
```bash
VITE_USE_API=true npm run dev
```

### 使用不同端口的后端
```bash
VITE_USE_API=true VITE_API_BASE_URL=http://localhost:9000/api npm run dev
```

## 📊 数据格式验证

### 首页数据返回格式
```json
{
  "success": true,
  "data": {
    "popularCars": [
      {
        "id": "car_001",
        "name": "911 GT2 RS",
        "manufacturer": "Porsche",
        "year": 2018,
        "category": "Supercars",
        "pi": 920,
        "drivetrain": "RWD",
        "imageUrl": "...",
        "tuneCount": 15
      }
    ],
    "recentTunes": [...],
    "proTunes": [...],
    "stats": {
      "totalCars": 150,
      "totalTunes": 1250,
      "totalUsers": 500,
      "totalProPlayers": 25
    }
  },
  "error": null
}
```

### 调校详情返回格式
```json
{
  "success": true,
  "data": {
    "id": "tune_12345",
    "shareCode": "123 456 789",
    "carId": "car_001",
    "authorGamertag": "SpeedMaster2024",
    "isProTune": false,
    "preference": "Balance",
    "piClass": "S1",
    "finalPI": 900,
    "drivetrain": "AWD",
    "tireCompound": "Sport",
    "surfaceConditions": ["Dry", "Wet"],
    "description": "平衡调校，适合多种赛道",
    "likeCount": 45,
    "favoriteCount": 12,
    "createdAt": "2024-01-15T10:30:00Z",
    "parameters": {
      "frontTirePressure": 32.5,
      "rearTirePressure": 30.0,
      // ... 其他参数
    }
  },
  "error": null
}
```

## 🚀 开发流程建议

1. **启动后端服务** (确保在8080端口)
2. **配置前端环境变量** (`.env.local`)
3. **启动前端开发服务器** (`npm run dev`)
4. **检查数据源指示器** (页面右上角应显示"API")
5. **测试关键功能** (首页加载、调校详情)
6. **查看控制台日志** (确认API请求正常)

---

遵循这个配置指南，可以确保本地前后端联调顺利进行！🎉 