-- =====================================
-- 数据库schema修复脚本
-- 修复缺失的 author_gamertag 字段
-- =====================================

-- 检查是否已存在 author_gamertag 字段
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tunes'
    AND COLUMN_NAME = 'author_gamertag'
);

-- 如果字段不存在，则添加该字段
SET @sql = IF(@column_exists = 0,
    'ALTER TABLE tunes ADD COLUMN author_gamertag VARCHAR(50) NOT NULL DEFAULT "" AFTER author_id;',
    'SELECT "author_gamertag column already exists" as message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 更新现有记录的 author_gamertag 字段
-- 通过关联 users 表获取 gamertag
UPDATE tunes t
INNER JOIN users u ON t.author_id = u.id
SET t.author_gamertag = u.gamertag
WHERE t.author_gamertag = '' OR t.author_gamertag IS NULL;

-- 验证更新结果
SELECT 
    COUNT(*) as total_tunes,
    COUNT(CASE WHEN author_gamertag IS NOT NULL AND author_gamertag != '' THEN 1 END) as tunes_with_gamertag,
    COUNT(CASE WHEN author_gamertag IS NULL OR author_gamertag = '' THEN 1 END) as tunes_without_gamertag
FROM tunes;

-- 显示一些示例数据
SELECT 
    id, 
    car_id, 
    author_id, 
    author_gamertag, 
    share_code, 
    game_category,
    description
FROM tunes 
LIMIT 5; 