-- migrations/create_device_tokens_table.sql
-- Push notification device tokens storage

CREATE TABLE IF NOT EXISTS device_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  platform ENUM('ios', 'android') NOT NULL,
  device_name VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_active (user_id, is_active),
  INDEX idx_token (token),
  FOREIGN KEY (user_id) REFERENCES register(id) ON DELETE CASCADE
);
