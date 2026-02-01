-- TK Office Manager v5 Database Schema
-- MySQL Database Setup

CREATE DATABASE IF NOT EXISTS tk_office_manager;
USE tk_office_manager;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    gst VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Works table
CREATE TABLE IF NOT EXISTS works (
    id VARCHAR(50) PRIMARY KEY,
    client VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    deadline DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fees table
CREATE TABLE IF NOT EXISTS fees (
    id VARCHAR(50) PRIMARY KEY,
    client VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    worktype VARCHAR(100),
    fee_date DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(50) PRIMARY KEY,
    file_number VARCHAR(50) UNIQUE NOT NULL,
    client VARCHAR(255) NOT NULL,
    service VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'In Office',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT IGNORE INTO clients (id, name, phone, email, address, gst) VALUES
('ID12345678', 'John Doe', '9876543210', 'john@example.com', '123 Main St, City', 'GST123456789'),
('ID23456789', 'Jane Smith', '9876543211', 'jane@example.com', '456 Oak Ave, City', 'GST987654321');

INSERT IGNORE INTO works (id, client, title, type, status, deadline, notes) VALUES
('ID34567890', 'John Doe', 'GST Filing Q1', 'GST', 'In Progress', '2024-04-15', 'Quarterly GST return'),
('ID45678901', 'Jane Smith', 'ITR Assessment', 'ITR', 'Pending', '2024-07-31', 'Annual tax filing');

INSERT IGNORE INTO fees (id, client, amount, worktype, fee_date, note) VALUES
('ID56789012', 'John Doe', 5000.00, 'GST', '2024-01-15', 'GST consulting fee'),
('ID67890123', 'Jane Smith', 3000.00, 'ITR', '2024-01-20', 'ITR preparation fee');

INSERT IGNORE INTO expenses (id, category, amount, expense_date, note) VALUES
('ID78901234', 'Office Rent', 15000.00, '2024-01-01', 'Monthly office rent'),
('ID89012345', 'Utilities', 2000.00, '2024-01-05', 'Electricity and internet');

INSERT IGNORE INTO files (id, file_number, client, service, location, status, note) VALUES
('ID90123456', 'F-001', 'John Doe', 'GST', 'Rack-A-Shelf-1-Box-A', 'In Office', 'GST documents'),
('ID01234567', 'F-002', 'Jane Smith', 'ITR', 'Rack-B-Shelf-2-Box-B', 'With Staff', 'ITR paperwork');
