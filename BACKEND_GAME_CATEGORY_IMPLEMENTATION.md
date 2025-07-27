# 🎮 后端游戏分类字段实施计划

## 📋 **正确理解的需求**

### **核心概念**
- 在数据库层面添加游戏分类字段
- 同一辆车在不同游戏中是两条独立的数据库记录
- 前端通过传递分类参数来过滤数据
- 保持原有的简单ID设计

### **数据模型设计**
```sql
-- 车辆表
CREATE TABLE cars (
    id VARCHAR(50) PRIMARY KEY,           -- 简单ID: 'porsche-911-gt2-rs'
    name VARCHAR(100) NOT NULL,           -- 车辆名称
    manufacturer VARCHAR(50) NOT NULL,    -- 制造商
    year INT NOT NULL,                    -- 年份
    category VARCHAR(50) NOT NULL,        -- 车辆分类
    pi INT NOT NULL,                      -- 性能指数
    drivetrain VARCHAR(10) NOT NULL,      -- 驱动方式
    game_category VARCHAR(10) NOT NULL,   -- 游戏分类: 'fh4' | 'fh5'
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 调校表
CREATE TABLE tunes (
    id VARCHAR(50) PRIMARY KEY,           -- 简单ID: 'tune-001'
    car_id VARCHAR(50) NOT NULL,          -- 关联车辆ID
    author_id VARCHAR(50) NOT NULL,       -- 作者ID
    share_code VARCHAR(20) NOT NULL,      -- 分享代码
    preference VARCHAR(20) NOT NULL,      -- 偏好
    pi_class VARCHAR(5) NOT NULL,         -- PI等级
    final_pi INT NOT NULL,                -- 最终PI
    game_category VARCHAR(10) NOT NULL,   -- 游戏分类: 'fh4' | 'fh5'
    -- ... 其他字段
    FOREIGN KEY (car_id) REFERENCES cars(id)
);
```

### **数据示例**
```sql
-- 同一辆车在不同游戏中的两条记录
INSERT INTO cars (id, name, manufacturer, year, category, pi, drivetrain, game_category) VALUES
('porsche-911-gt2-rs', 'Porsche 911 GT2 RS', 'Porsche', 2018, 'Sports Cars', 920, 'RWD', 'fh5'),
('porsche-911-gt2-rs', 'Porsche 911 GT2 RS', 'Porsche', 2018, 'Sports Cars', 920, 'RWD', 'fh4');

-- 调校数据
INSERT INTO tunes (id, car_id, author_id, share_code, preference, pi_class, final_pi, game_category) VALUES
('tune-001', 'porsche-911-gt2-rs', 'user1', '123 456 789', 'Power', 'S1', 900, 'fh5'),
('tune-002', 'porsche-911-gt2-rs', 'user1', '111 222 333', 'Power', 'S1', 900, 'fh4');
```

## 🎯 **实施计划**

### **阶段1：后端数据库设计**
1. 更新数据库schema，添加game_category字段
2. 更新实体类，添加gameCategory属性
3. 更新Mapper接口，支持game_category过滤
4. 更新Controller，接收game_category参数

### **阶段2：前端查询参数**
1. 更新前端查询接口，传递game_category参数
2. 更新车辆列表页面，添加游戏分类过滤
3. 更新调校查询，确保按游戏分类过滤

### **阶段3：数据迁移**
1. 更新mock数据，使用新的数据结构
2. 确保前后端数据一致
3. 测试游戏分类过滤功能

## 🔄 **API设计**

### **车辆查询API**
```http
GET /api/cars?game_category=fh5&category=Sports Cars&manufacturer=Porsche
```

### **调校查询API**
```http
GET /api/tunes?car_id=porsche-911-gt2-rs&game_category=fh5
```

### **响应格式**
```json
{
  "success": true,
  "data": [
    {
      "id": "porsche-911-gt2-rs",
      "name": "Porsche 911 GT2 RS",
      "manufacturer": "Porsche",
      "gameCategory": "fh5",
      // ... 其他字段
    }
  ]
}
```

## 📊 **数据分布示例**

### **车辆数据**
```
FH5车辆:
- porsche-911-gt2-rs (game_category: 'fh5')
- mclaren-senna (game_category: 'fh5')
- nissan-skyline-gtr (game_category: 'fh5')

FH4车辆:
- porsche-911-gt2-rs (game_category: 'fh4')
- mclaren-senna (game_category: 'fh4')
- nissan-skyline-gtr (game_category: 'fh4')
```

### **调校数据**
```
FH5调校:
- tune-001 (car_id: porsche-911-gt2-rs, game_category: 'fh5')
- tune-002 (car_id: mclaren-senna, game_category: 'fh5')

FH4调校:
- tune-003 (car_id: porsche-911-gt2-rs, game_category: 'fh4')
- tune-004 (car_id: mclaren-senna, game_category: 'fh4')
```

## 🎉 **预期效果**

1. **数据库层面**：清晰的数据分离，便于管理和查询
2. **API层面**：统一的查询接口，通过参数区分游戏
3. **前端层面**：简单的参数传递，无需复杂的ID解析
4. **扩展性**：未来添加新游戏只需添加新的game_category值 