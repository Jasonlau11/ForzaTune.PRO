# 数据源切换使用指南

## 概述

ForzaTune.PRO 前端支持在 **API数据源** 和 **Mock数据源** 之间灵活切换，便于开发调试和生产部署。

## 功能特性

### ✅ **智能数据源切换**
- 🔄 **一键切换**: 通过环境变量控制数据来源
- 🛡️ **自动降级**: API失败时自动切换到Mock数据
- 📊 **数据源指示器**: 页面右上角显示当前数据源状态
- 🎯 **统一接口**: 前端代码无需修改，数据格式完全兼容

### ✅ **支持的接口**
- 🏠 **首页数据**: `/home/dashboard` - 热门车辆、最新调校、Pro调校、统计信息
- 🚗 **调校详情**: `/tunes/{id}` - 完整调校信息和参数
- 📝 **调校创建**: `/tunes` - 创建新调校
- ❤️ **点赞收藏**: `/tunes/{id}/like` & `/tunes/{id}/favorite`

## 环境配置

### 方式一：环境变量文件（推荐）

创建 `.env.local` 文件：

```bash
# 数据源配置
VITE_USE_API=true                           # true: 使用API, false: 使用Mock
VITE_API_BASE_URL=http://localhost:8080/api # 本地后端服务地址 (重要!)

# 可选配置
VITE_MOCK_TOKEN=dev-mock-token-123456       # 开发模式Mock Token
VITE_DEBUG=true                             # 启用调试日志
```

⚠️ **重要提醒**: 本地联调时，确保后端服务运行在 `localhost:8080`，API接口前缀为 `/api`

### 方式二：运行时环境变量

```bash
# 使用Mock数据启动（离线开发）
VITE_USE_API=false npm run dev

# 使用本地API联调
VITE_USE_API=true npm run dev

# 指定自定义API地址（如果后端不在8080端口）
VITE_USE_API=true VITE_API_BASE_URL=http://localhost:9000/api npm run dev
```

## 数据源模式

### 🟨 Mock模式
```bash
VITE_USE_API=false
```

**特点:**
- ✅ 无需后端服务即可运行
- ✅ 数据响应速度快
- ✅ 便于前端开发调试
- ⚠️ 数据为静态模拟数据
- ❌ 无法测试真实API交互

**适用场景:**
- 前端开发和调试
- 演示和展示
- 离线开发环境

### 🟩 API模式（本地联调推荐）
```bash
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api
```

**特点:**
- ✅ 真实后端数据交互
- ✅ 完整的业务逻辑测试
- ✅ 支持数据创建和修改
- ⚠️ 需要后端服务运行
- ⚠️ 网络延迟影响响应速度

**适用场景:**
- 集成测试
- 生产环境部署
- 后端联调

## 数据源指示器

页面右上角会显示当前数据源状态：

- 🟩 **API** - 成功连接到API服务器
- 🟨 **Mock** - 使用本地模拟数据

## 接口映射

### 首页数据 (`/home/dashboard`)

**API响应格式:**
```json
{
  "success": true,
  "data": {
    "popularCars": [...],
    "recentTunes": [...],
    "proTunes": [...],
    "stats": {...}
  },
  "error": null
}
```

**Mock数据转换:**
- ✅ 自动计算车辆调校数量
- ✅ 按时间排序最新调校
- ✅ 筛选Pro调校
- ✅ 生成统计信息

### 调校详情 (`/tunes/{id}`)

**API响应格式:**
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
    "parameters": {...}
  },
  "error": null
}
```

**Mock数据兼容:**
- ✅ 完整参数映射
- ✅ 类型自动转换
- ✅ 空值安全处理

## 错误处理

### API降级机制

```typescript
// 自动降级示例
async getHomeData(): Promise<HomeDataDto> {
  if (USE_API) {
    try {
      const response = await api.get('/home/dashboard')
      return response.data
    } catch (error) {
      console.error('API获取数据失败，切换到Mock数据:', error)
      return this.getMockHomeData() // 自动降级
    }
  } else {
    return this.getMockHomeData()
  }
}
```

### 错误状态显示

- 🔄 **加载中**: 显示加载动画
- ❌ **错误状态**: 显示错误信息和重试按钮
- 📱 **空数据**: 友好的空状态提示

## 开发调试

### 控制台日志

启用调试模式后，控制台会显示：

```bash
[API Request] GET /home/dashboard
[API Response] 200 /home/dashboard
Mock模式：模拟点赞调校 tune_12345
```

### 网络面板

API模式下可在浏览器开发者工具中查看：
- 请求URL和参数
- 响应状态和数据
- 请求耗时

## 部署配置

### 本地开发（离线）
```bash
VITE_USE_API=false                  # 使用Mock数据
VITE_DEBUG=true                     # 启用调试
```

### 本地联调（推荐）
```bash
VITE_USE_API=true                   # 使用本地API
VITE_API_BASE_URL=http://localhost:8080/api  # 本地后端地址
VITE_DEBUG=true                     # 启用调试
```

### 测试环境
```bash
VITE_USE_API=true                   # 使用API
VITE_API_BASE_URL=http://test-api.forzatune.pro
VITE_DEBUG=true                     # 启用调试
```

### 生产环境
```bash
VITE_USE_API=true                   # 使用API
VITE_API_BASE_URL=https://api.forzatune.pro
VITE_DEBUG=false                    # 关闭调试
```

## 注意事项

### ⚠️ 数据一致性
- Mock数据结构需与API保持一致
- 新增字段时需同时更新Mock数据
- 类型定义保持同步

### ⚠️ 功能限制
- Mock模式下无法创建/修改数据
- 点赞收藏操作仅为模拟
- 实时数据更新不可用

### ⚠️ 性能考虑
- API模式需考虑网络延迟
- 大量数据加载时显示加载状态
- 合理使用缓存机制

## 故障排除

### Q: 切换到API模式后页面空白
A: 检查 `VITE_API_BASE_URL` 是否正确，确认后端服务是否运行

### Q: Mock模式下无法上传调校
A: Mock模式不支持数据修改，请切换到API模式

### Q: 数据源指示器显示不正确
A: 清除浏览器缓存，重新加载页面

### Q: API请求失败但未降级到Mock
A: 检查错误处理逻辑，确认降级机制是否正确实现

## 扩展指南

### 添加新接口

1. **在 `dataService.ts` 中添加方法:**
```typescript
async getNewData(): Promise<NewDataDto> {
  if (USE_API) {
    try {
      const response = await api.get('/new-endpoint')
      return response.data
    } catch (error) {
      return this.getMockNewData()
    }
  } else {
    return this.getMockNewData()
  }
}
```

2. **添加Mock数据处理:**
```typescript
private getMockNewData(): NewDataDto {
  // 实现Mock数据逻辑
}
```

3. **在组件中使用:**
```typescript
const data = await dataService.getNewData()
```

### 自定义数据转换

```typescript
// 数据格式转换
private convertApiToLocal(apiData: ApiFormat): LocalFormat {
  return {
    id: apiData.id,
    name: apiData.display_name,
    // ... 其他字段映射
  }
}
```

---

通过这套数据源切换系统，开发团队可以在不同环境下灵活选择最适合的数据来源，提高开发效率和系统可靠性。 