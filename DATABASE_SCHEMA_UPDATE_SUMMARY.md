# 🗄️ 数据库Schema更新总结

## 📋 **更新概览**

根据游戏分类功能的实施需求，对数据库schema进行了全面优化，确保支持FH4和FH5的数据分离存储和高效查询。

---

## ✅ **核心表结构更新**

### **1. 车辆表 (cars) - 重大更新**

#### **主键结构改变**
```sql
-- 原结构
id VARCHAR(50) PRIMARY KEY

-- 新结构  
id VARCHAR(50) NOT NULL,
game_category ENUM('fh4', 'fh5') NOT NULL,
PRIMARY KEY (id, game_category)
```

#### **设计理念**
- **复合主键**：同一车辆在不同游戏中作为独立记录存储
- **数据分离**：FH4和FH5的车辆数据完全独立
- **查询优化**：支持按游戏分类的高效查询

#### **优化索引**
```sql
INDEX idx_car_id (id), -- 支持按车辆ID查询所有游戏版本
INDEX idx_popular_cars (game_category, pi DESC), -- 优化热门车辆查询
INDEX idx_tune_count (game_category) -- 支持调校数量统计
```

### **2. 调校表 (tunes) - 关联约束更新**

#### **外键约束**
```sql
-- 复合外键：确保调校只能关联同游戏的车辆
FOREIGN KEY (car_id, game_category) REFERENCES cars(id, game_category)
```

#### **查询优化索引**
```sql
INDEX idx_recent_tunes (game_category, created_at DESC), -- 最新调校查询优化
INDEX idx_pro_tunes (game_category, is_pro_tune, like_count DESC), -- PRO调校查询优化
INDEX idx_popular_tunes (game_category, like_count DESC) -- 热门调校查询优化
```

### **3. 调校参数表 (tune_parameters) - 数据类型修正**

#### **关键修正**
```sql
-- 原字段
tune_id VARCHAR(36) NOT NULL

-- 修正后
tune_id VARCHAR(50) NOT NULL -- 与tunes表主键类型保持一致
```

---

## 🔍 **数据存储示例**

### **车辆数据存储**
```sql
-- 同一车辆在不同游戏中的独立记录
('porsche-911-gt2-rs', 'Porsche', '911 GT2 RS', 2018, 'Supercars', 920, 'RWD', 'fh5', ...)
('porsche-911-gt2-rs', 'Porsche', '911 GT2 RS', 2018, 'Supercars', 920, 'RWD', 'fh4', ...)
```

### **调校数据存储**
```sql
-- FH5调校
('tune-fh5-001', 'porsche-911-gt2-rs', 'user-001', 'FH5-001-ABC', 'Power', 'S2', 920, 'fh5', ...)

-- FH4调校  
('tune-fh4-001', 'porsche-911-gt2-rs', 'user-002', 'FH4-001-PQR', 'Power', 'S2', 920, 'fh4', ...)
```

---

## 📊 **查询性能优化**

### **热门车辆查询**
```sql
-- 优化前：需要应用层过滤
SELECT * FROM cars ORDER BY tune_count DESC LIMIT 4;

-- 优化后：数据库层直接过滤
SELECT * FROM cars 
WHERE game_category = 'fh5'
ORDER BY tune_count DESC LIMIT 4;
-- 使用索引：idx_popular_cars (game_category, pi DESC)
```

### **最新调校查询**
```sql
-- 按游戏分类查询最新调校
SELECT * FROM tunes 
WHERE game_category = 'fh5' 
ORDER BY created_at DESC LIMIT 3;
-- 使用索引：idx_recent_tunes (game_category, created_at DESC)
```

### **PRO调校查询**
```sql
-- 按游戏分类查询PRO调校
SELECT * FROM tunes 
WHERE game_category = 'fh5' AND is_pro_tune = 1
ORDER BY like_count DESC LIMIT 3;
-- 使用索引：idx_pro_tunes (game_category, is_pro_tune, like_count DESC)
```

---

## 🎯 **数据完整性保障**

### **外键约束确保**
1. **车辆-调校关联**：调校只能关联同游戏的车辆
2. **用户-调校关联**：调校必须关联有效用户
3. **数据一致性**：防止跨游戏的数据关联错误

### **索引策略**
1. **复合索引**：支持多字段查询优化
2. **排序索引**：支持常用排序字段的快速查询
3. **覆盖索引**：减少回表查询，提升性能

---

## 📈 **示例数据插入**

### **测试数据覆盖**
- ✅ **4个用户**：包含PRO和普通用户
- ✅ **9辆车**：5辆FH5车辆，4辆FH4车辆
- ✅ **9个调校**：5个FH5调校，4个FH4调校
- ✅ **用户活动**：上传、点赞、收藏等操作记录

### **数据多样性**
- **车辆类型**：超级跑车、肌肉车、运动车等
- **调校偏好**：Power、Handling、Balance
- **PI等级**：从A级到X级的完整覆盖
- **驱动方式**：RWD、AWD的不同配置

---

## 🔄 **数据库迁移策略**

### **现有数据迁移**
如果已有数据库数据，需要执行以下迁移步骤：

```sql
-- 1. 备份现有数据
CREATE TABLE cars_backup AS SELECT * FROM cars;
CREATE TABLE tunes_backup AS SELECT * FROM tunes;

-- 2. 为现有数据添加默认游戏分类
ALTER TABLE cars ADD COLUMN game_category_temp ENUM('fh4', 'fh5') DEFAULT 'fh5';
ALTER TABLE tunes ADD COLUMN game_category_temp ENUM('fh4', 'fh5') DEFAULT 'fh5';

-- 3. 根据业务逻辑更新游戏分类
UPDATE cars SET game_category_temp = 'fh4' WHERE /* 特定条件 */;
UPDATE tunes SET game_category_temp = 'fh4' WHERE /* 特定条件 */;

-- 4. 重建表结构（详见完整schema.sql）
-- 5. 迁移数据到新表结构
-- 6. 验证数据完整性
-- 7. 删除备份表
```

---

## 🎉 **更新完成效果**

### **功能增强**
- ✅ **完整的游戏数据分离**：FH4和FH5数据独立存储
- ✅ **高效的分类查询**：数据库层面按游戏过滤
- ✅ **优化的查询性能**：专门的索引支持常用查询
- ✅ **数据完整性保障**：复合外键防止数据关联错误

### **API查询支持**
- ✅ **按游戏统计**：`SELECT COUNT(*) FROM cars WHERE game_category = 'fh5'`
- ✅ **热门车辆查询**：支持按游戏分类的热门车辆排序
- ✅ **最新调校查询**：支持按游戏分类的时间排序
- ✅ **PRO调校查询**：支持按游戏分类的点赞数排序

### **扩展性设计**
- ✅ **新游戏支持**：ENUM类型易于扩展新的游戏版本
- ✅ **索引优化**：支持未来新增的查询需求
- ✅ **数据隔离**：不同游戏数据互不干扰

---

## 📝 **使用说明**

### **执行SQL脚本**
```bash
# 连接到MySQL数据库
mysql -u root -p

# 执行更新后的schema.sql
source /path/to/schema.sql
```

### **验证数据完整性**
```sql
-- 检查车辆数据
SELECT game_category, COUNT(*) as car_count FROM cars GROUP BY game_category;

-- 检查调校数据
SELECT game_category, COUNT(*) as tune_count FROM tunes GROUP BY game_category;

-- 检查外键约束
SELECT COUNT(*) FROM tunes t 
LEFT JOIN cars c ON t.car_id = c.id AND t.game_category = c.game_category 
WHERE c.id IS NULL;
-- 应该返回0，表示所有调校都正确关联到车辆
```

### **性能测试**
```sql
-- 测试热门车辆查询性能
EXPLAIN SELECT * FROM cars 
WHERE game_category = 'fh5' 
ORDER BY pi DESC LIMIT 4;

-- 测试最新调校查询性能
EXPLAIN SELECT * FROM tunes 
WHERE game_category = 'fh5' 
ORDER BY created_at DESC LIMIT 3;
```

数据库schema现已完全支持游戏分类功能，为前后端的高效查询提供了坚实的数据基础！🎮✨ 