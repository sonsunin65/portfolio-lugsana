
-- Clear existing highlights (optional, but requested to "change to" this set)
DELETE FROM highlights;

-- Insert requested highlights
INSERT INTO highlights (title, description, icon_name, color_class, bg_class, display_order) VALUES
('การศึกษา', 'ปริญญาตรี สาขาการศึกษา มหาวิทยาลัยชั้นนำ', 'GraduationCap', 'text-pink-600', 'bg-pink-100', 1),
('ประสบการณ์', 'มากกว่า 10 ปี ในการสอนและพัฒนานักเรียน', 'Award', 'text-green-600', 'bg-green-100', 2),
('วิชาที่สอน', 'ภาษาไทย ภาษาอังกฤษ และกิจกรรมพัฒนาผู้เรียน', 'BookOpen', 'text-yellow-600', 'bg-yellow-100', 3),
('ทักษะพิเศษ', 'การจัดกิจกรรมสร้างสรรค์ การใช้เทคโนโลยีในการสอน', 'Users', 'text-purple-600', 'bg-purple-100', 4);
