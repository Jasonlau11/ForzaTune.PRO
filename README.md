# ForzaTune PRO 🏎️

> 专业的Forza赛车游戏调校分享平台

[![Vue](https://img.shields.io/badge/Vue-3.4.0-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Jasonlau11/ForzaTune.PRO?style=social)](https://github.com/Jasonlau11/ForzaTune.PRO)

一个现代化的Web应用，专为Forza赛车游戏玩家打造，提供调校分享、发现和社区交流功能。

## ✨ 核心特性

### 🎮 游戏支持
- **多游戏兼容**: 支持 Forza Horizon 5 和 Forza Motorsport
- **游戏切换**: 一键切换不同游戏，数据独立管理
- **版本适配**: 针对不同游戏版本优化调校参数

### 🔍 智能搜索与筛选
- **多维度搜索**: 按车型、制造商、分类等快速定位
- **多选筛选**: 支持同时选择多个分类、地面条件等
- **PI等级系统**: 完整支持X/S2/S1/A/B/C/D等级分类
- **比赛类型**: Forza Horizon系列支持公路/拉力/越野
- **地面条件**: 干地/湿地/雪地多选支持
- **调校倾向**: 动力/操控/均衡分类筛选

### 📊 调校管理
- **详细参数**: 8大类完整调校参数展示
- **参数保护**: 支持调校参数隐私保护
- **截图识别**: AI自动识别调校参数截图（模拟）
- **版本控制**: 调校版本管理和历史记录

### ⚡ 性能与圈速
- **圈速排行**: 按赛道圈速排序找到最佳调校
- **Pro圈速认证**: Pro玩家圈速优先显示，突出权威性
- **分层显示**: Pro圈速金星认证标识，普通圈速参考
- **多维度排序**: 圈速、时间、下载量、点赞数

### 👑 Pro认证系统
- **完整申请流程**: 游戏ID、经验描述、成绩截图、调校作品
- **多重验证**: 支持上传游戏成绩截图和视频证明链接
- **权益展示**: 清晰说明Pro认证后的4大权益
- **审核流程**: 5-7个工作日专业审核，站内消息通知

### 🏁 车队系统
- **社交功能**: 创建、加入、管理赛车车队
- **角色权限**: 队长、管理员、版主、成员四级权限
- **团队共享**: 支持仅车队内可见的专属调校
- **协作编辑**: 车队成员协作编辑和完善调校参数
- **动态权限**: 调校作者可随时调整共享级别

### 💬 社区互动
- **评论系统**: 用户可发表评论和1-5星评分
- **Pro标识**: Pro玩家评论特殊标识，增加权威性
- **互动功能**: 支持评论回复、点赞和多维度筛选
- **用户资料**: 个人资料管理和成就展示

### 🎨 用户体验
- **响应式设计**: 完美适配桌面、平板和移动设备
- **深色主题**: 专业竞速环境，营造沉浸式体验
- **橙色主调**: 象征速度与激情的视觉设计
- **动态效果**: 赛道线动画、悬浮光效、霓虹文字
- **多语言支持**: 中文和英文完整支持

## 🛠️ 技术栈

### 前端框架
- **[Vue 3](https://vuejs.org/)** - 渐进式JavaScript框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的JavaScript超集
- **[Vue Router 4](https://router.vuejs.org/)** - 官方路由管理器
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - 国际化解决方案

### 构建工具
- **[Vite](https://vitejs.dev/)** - 下一代前端构建工具
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的CSS框架
- **[PostCSS](https://postcss.org/)** - CSS处理工具
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS前缀自动添加

### 工具库
- **[Axios](https://axios-http.com/)** - HTTP客户端
- **[Lodash-es](https://lodash.com/)** - JavaScript实用工具库
- **[Day.js](https://day.js.org/)** - 轻量级日期处理库

## 🚀 快速开始

### 环境要求

- **Node.js**: 16.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **Git**: 用于版本控制

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Jasonlau11/ForzaTune.PRO.git
   cd ForzaTune.PRO
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   
   应用将在以下地址启动：
   - 本地: http://localhost:3000
   - 网络: http://your-ip:3000

### 构建部署

```bash
# 类型检查
npm run typecheck

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
ForzaTune.PRO/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── common/         # 通用组件
│   │   ├── layout/         # 布局组件
│   │   ├── profile/        # 用户资料组件
│   │   └── teams/          # 车队相关组件
│   ├── views/              # 页面组件
│   ├── router/             # 路由配置
│   ├── locales/            # 国际化文件
│   │   ├── zh.json         # 中文语言包
│   │   └── en.json         # 英文语言包
│   ├── types/              # TypeScript 类型定义
│   ├── styles/             # 样式文件
│   ├── utils/              # 工具函数
│   ├── composables/        # 组合式函数
│   └── main.ts             # 应用入口
├── public/                 # 静态资源
├── dist/                   # 构建输出
├── docs/                   # 项目文档
├── package.json            # 项目配置
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
└── README.md               # 项目说明
```

## 🗺️ 页面导航

| 页面 | 路径 | 描述 |
|------|------|------|
| **首页** | `/` | 展示热门车型、最新调校和专业推荐 |
| **车型列表** | `/cars` | 浏览和搜索所有车型 |
| **车型调校** | `/cars/:id/tunes` | 查看特定车型的所有调校 |
| **调校详情** | `/tunes/:id` | 查看调校详细参数和用户评论 |
| **上传调校** | `/upload` | 分享自己的调校作品 |
| **Pro认证申请** | `/pro-application` | 申请成为认证Pro玩家 |
| **社区** | `/community` | 社区讨论和互动功能 |
| **个人资料** | `/profile` | 用户资料管理和设置 |
| **车队管理** | `/teams` | 车队创建和管理功能 |

## 🎯 功能演示

### 游戏切换
页面顶部提供游戏选择器，支持在 Forza Horizon 5 和 Forza Motorsport 之间无缝切换，数据独立管理。

### 智能搜索与筛选
- **多选车辆分类**: 支持同时选择多个分类进行筛选
- **比赛类型筛选**: Forza Horizon系列支持公路/拉力/越野
- **地面条件多选**: 干地/湿地/雪地灵活组合
- **PI等级精确筛选**: X/S2/S1/A/B/C/D等级分类
- **Pro玩家筛选**: 专门筛选Pro玩家调校
- **一键清空**: 快速重置所有筛选条件

### 调校排序系统
- **最佳圈速**: 按赛道最佳圈速排序
- **最新时间**: 按调校发布时间排序
- **下载量**: 按调校下载次数排序
- **点赞数**: 按用户点赞数量排序

### Pro认证申请流程
1. **基本信息**: 填写游戏ID和经验描述
2. **成绩验证**: 上传游戏成绩截图
3. **作品展示**: 提供调校作品链接
4. **视频证明**: 可选上传视频证明链接
5. **权益了解**: 查看Pro认证后的4大权益
6. **审核等待**: 5-7个工作日专业审核

### 调校详情与评论
- **参数展示**: 8大类完整调校参数，支持隐私保护
- **评论系统**: 用户可发表评论和1-5星评分
- **Pro标识**: Pro玩家评论特殊标识，增加权威性
- **互动功能**: 支持评论回复、点赞和多维度筛选

### 首页交互优化
- **统一交互**: 最新调校和专业推荐卡片交互体验统一
- **双重点击**: 支持卡片整体点击和详情按钮点击
- **完整信息**: 统一显示下载数、点赞数和操作按钮
- **视觉差异**: 保持专业推荐的金色边框突出权威性

### 车队系统功能
- **创建车队**: 建立专属赛车车队
- **成员管理**: 邀请、申请、审批、角色调整
- **权限控制**: 队长、管理员、版主、成员四级权限
- **团队共享**: 仅车队内可见的专属调校
- **协作编辑**: 车队成员协作完善调校参数

### 响应式设计
- **大屏幕（>1024px）**: 完整布局，所有功能正常
- **中等屏幕（768px-1024px）**: 紧凑布局，文字自适应
- **小屏幕（<768px）**: 移动端菜单，功能完整

## 📈 开发进度

### ✅ 已完成功能
- [x] **基础架构**: Vue 3 + TypeScript + Vite
- [x] **多语言支持**: 中文和英文完整支持
- [x] **响应式设计**: 完美适配各种设备
- [x] **PI等级系统**: 完整支持X/S2/S1/A/B/C/D等级
- [x] **多选筛选**: 车型分类、地面条件等多选支持
- [x] **Pro认证系统**: 完整的申请和审核流程
- [x] **调校详情**: 8大类参数展示和评论系统
- [x] **首页优化**: 统一交互体验和视觉设计
- [x] **Pro圈速认证**: Pro玩家圈速优先显示
- [x] **赛车主题**: 深色主题和橙色主调设计
- [x] **车队系统**: 完整的社交和协作功能
- [x] **响应式优化**: 导航栏和用户体验改进

### 🚧 开发中功能
- [ ] **用户认证系统**: 完整的用户注册和登录
- [ ] **Pro认证审核后台**: 管理员审核界面
- [ ] **真实OCR识别**: 集成真实的截图识别API
- [ ] **圈速记录系统**: 圈速记录和视频证明
- [ ] **社区讨论**: 论坛和讨论功能
- [ ] **移动端APP**: 原生移动应用

### 📋 计划功能
- [ ] **实时聊天**: 车队内部实时通讯
- [ ] **调校对比**: 多调校参数对比功能
- [ ] **数据统计**: 用户和调校数据分析
- [ ] **API开放**: 第三方开发者API
- [ ] **云同步**: 跨设备数据同步

## 🔄 最新更新

### 2025-07-23 - 响应式布局优化和用户体验改进

#### 🎯 响应式布局优化
- **导航栏响应式改进**: 调整断点策略，优化中等屏幕显示效果
- **按钮文字自适应**: 上传调校按钮在大屏幕显示完整文字，中等屏幕显示简短文字
- **移动端菜单完善**: 修复样式不一致问题，添加语言切换功能

#### 🚀 用户体验提升
- **页面滚动优化**: 切换页面时自动滚动到顶部，提升导航体验
- **车型信息自动填充**: 从车型详情页面点击上传时自动填充车型信息
- **表单体验改进**: 地面条件选择更简洁，避免重复显示

#### 🌍 国际化完善
- **用户菜单翻译**: 修复退出登录按钮显示未翻译键值的问题
- **按钮文字翻译**: 补充上传按钮简短文字的国际化支持

#### 🎨 界面统一
- **标题样式统一**: 统一使用一致的标题颜色和样式
- **筛选器优化**: 简化多选标签显示，提升界面清爽度

#### 🔧 技术改进
- **路由滚动行为**: 实现智能滚动策略，保持前进/后退时的位置
- **条件渲染优化**: 添加必要的空值检查，防止页面渲染错误
- **URL参数传递**: 实现车型信息的URL编码传递

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看以下指南：

### 提交Issue
- 使用清晰的标题描述问题
- 提供详细的复现步骤
- 包含浏览器和操作系统信息
- 添加截图或录屏（如果适用）
- 在 [GitHub Issues](https://github.com/Jasonlau11/ForzaTune.PRO/issues) 提交问题

### 提交Pull Request
1. Fork项目到你的GitHub账户：[Fork ForzaTune.PRO](https://github.com/Jasonlau11/ForzaTune.PRO/fork)
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建Pull Request：[Create Pull Request](https://github.com/Jasonlau11/ForzaTune.PRO/compare)

### 代码规范
- 使用TypeScript进行类型安全开发
- 遵循Vue 3 Composition API最佳实践
- 使用Tailwind CSS进行样式开发
- 保持代码简洁和可读性
- 添加必要的注释和文档

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🔗 相关链接

- **GitHub仓库**: [https://github.com/Jasonlau11/ForzaTune.PRO](https://github.com/Jasonlau11/ForzaTune.PRO)
- **在线演示**: [https://forza-tune-pro.vercel.app](https://forza-tune-pro.vercel.app) (待部署)
- **问题反馈**: [GitHub Issues](https://github.com/Jasonlau11/ForzaTune.PRO/issues)
- **讨论交流**: [GitHub Discussions](https://github.com/Jasonlau11/ForzaTune.PRO/discussions)

## 🙏 致谢

感谢所有为ForzaTune PRO做出贡献的开发者！

特别感谢：
- [Vue.js](https://vuejs.org/) 团队提供的优秀框架
- [Tailwind CSS](https://tailwindcss.com/) 提供的现代化样式解决方案
- [Vite](https://vitejs.dev/) 团队提供的快速构建工具

---

**ForzaTune PRO** - 让赛车调校更简单，让竞速更精彩！🏁

[![GitHub stars](https://img.shields.io/github/stars/Jasonlau11/ForzaTune.PRO?style=social)](https://github.com/Jasonlau11/ForzaTune.PRO)
[![GitHub forks](https://img.shields.io/github/forks/Jasonlau11/ForzaTune.PRO?style=social)](https://github.com/Jasonlau11/ForzaTune.PRO)
[![GitHub issues](https://img.shields.io/github/issues/Jasonlau11/ForzaTune.PRO)](https://github.com/Jasonlau11/ForzaTune.PRO/issues)
[![GitHub license](https://img.shields.io/github/license/Jasonlau11/ForzaTune.PRO)](https://github.com/Jasonlau11/ForzaTune.PRO/blob/main/LICENSE) 