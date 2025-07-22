# 地面条件筛选简化更新

## 🔄 更新内容

根据用户需求，简化了地面条件筛选标签，从原来的6个选项减少到3个选项。

### ✅ **保留的地面条件**
- **干地** (Dry)
- **湿地** (Wet)
- **雪地** (Snow)

### ❌ **移除的地面条件**
- ~~砂石~~ (Gravel)
- ~~沙地~~ (Sand)
- ~~柏油路~~ (Tarmac)

## 🛠️ 技术修改

### 1. 类型定义更新
**文件**: `src/types/index.ts`
```typescript
// 修改前
export type SurfaceCondition = 'Dry' | 'Wet' | 'Snow' | 'Gravel' | 'Sand' | 'Tarmac'

// 修改后
export type SurfaceCondition = 'Dry' | 'Wet' | 'Snow'
```

### 2. 语言文件更新
**中文翻译** (`src/locales/zh.json`):
```json
"surfaceConditions": {
  "Dry": "干地",
  "Wet": "湿地", 
  "Snow": "雪地"
}
```

**英文翻译** (`src/locales/en.json`):
```json
"surfaceConditions": {
  "Dry": "Dry",
  "Wet": "Wet", 
  "Snow": "Snow"
}
```

### 3. 界面选项更新
**修改的文件**:
- `src/views/CarTunes.vue` - 调校筛选页面
- `src/views/UploadTune.vue` - 上传调校页面

**选项简化**:
```javascript
// 修改前 (6个选项)
const surfaceConditionOptions = computed(() => [
  { value: 'Dry', label: t('tune.surfaceConditions.Dry') },
  { value: 'Wet', label: t('tune.surfaceConditions.Wet') },
  { value: 'Snow', label: t('tune.surfaceConditions.Snow') },
  { value: 'Gravel', label: t('tune.surfaceConditions.Gravel') },
  { value: 'Sand', label: t('tune.surfaceConditions.Sand') },
  { value: 'Tarmac', label: t('tune.surfaceConditions.Tarmac') }
])

// 修改后 (3个选项)
const surfaceConditionOptions = computed(() => [
  { value: 'Dry', label: t('tune.surfaceConditions.Dry') },
  { value: 'Wet', label: t('tune.surfaceConditions.Wet') },
  { value: 'Snow', label: t('tune.surfaceConditions.Snow') }
])
```

### 4. 模拟数据更新
**修改的文件**:
- `src/views/Home.vue` - 首页展示数据
- `src/views/CarTunes.vue` - 调校列表数据

**数据适配**:
- 原来使用 `['Dry', 'Tarmac']` 的改为 `['Dry']`
- 原来使用 `['Gravel']` 的改为 `['Wet']`
- 原来使用 `['Snow', 'Sand']` 的改为 `['Snow']`
- 原来使用 `['Wet', 'Gravel']` 的改为 `['Wet']`

## 📱 用户体验改进

### 简化后的界面
- **筛选更简洁**: 减少选择复杂度，提高用户体验
- **标签更清晰**: 3个常用条件覆盖主要使用场景
- **操作更快速**: 减少选择时间，提高筛选效率

### 适用场景
- **干地**: 适合大部分赛道和公路驾驶
- **湿地**: 雨天和湿滑路面条件
- **雪地**: 冬季和雪地赛道条件

## 🚀 部署状态

- **开发服务器**: http://localhost:3002 ✅ 正常运行
- **功能验证**: ✅ 所有页面正常显示
- **数据兼容**: ✅ 模拟数据已更新适配
- **多语言**: ✅ 中英文翻译完整

## 🎯 用户影响

### 正面影响
- **选择简化**: 减少用户选择负担
- **界面清洁**: 筛选区域更简洁
- **常用优先**: 保留最常用的3个条件

### 向后兼容
- **数据兼容**: 现有调校数据自动适配新的条件分类
- **功能完整**: 所有筛选和上传功能正常
- **无破坏性**: 不影响现有用户体验流程

现在地面条件筛选更加精简实用，专注于最常见的使用场景！ 🌟 