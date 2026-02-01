-- Admin users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert two admin users (passwords are hashed)
INSERT IGNORE INTO users (id, username, password, role) VALUES
('admin1', 'admin', 'admin123', 'admin'),
('admin2', 'manager', 'manager123', 'admin');

-- Show created users
SELECT * FROM users;
