# TK Office Manager v5 - Backend with MySQL

## Database Setup

1. **Install MySQL** if not already installed
2. **Create database** using the provided SQL file:
   ```bash
   mysql -u root -p < database.sql
   ```

3. **Update database credentials** in `server-mysql.js`:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'YOUR_PASSWORD', // Update this
       database: 'tk_office_manager'
   };
   ```

## Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the MySQL server**:
   ```bash
   node server-mysql.js
   ```

## API Endpoints

### Data Management
- `GET /api/data` - Get all data from all tables
- `GET /api/stats` - Get dashboard statistics

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Works
- `GET /api/works` - Get all works
- `POST /api/works` - Add new work
- `PUT /api/works/:id` - Update work
- `DELETE /api/works/:id` - Delete work

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Add new fee
- `DELETE /api/fees/:id` - Delete fee

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `DELETE /api/expenses/:id` - Delete expense

### Files
- `GET /api/files` - Get all files
- `POST /api/files` - Add new file
- `DELETE /api/files/:id` - Delete file

## Database Schema

### Tables
- **clients** - Client information
- **works** - Work/Project tracking
- **fees** - Fee received records
- **expenses** - Expense tracking
- **files** - Physical file register

### Features
- Auto-increment timestamps for created_at/updated_at
- Unique IDs for all records
- Proper data types (DECIMAL for amounts, DATE for dates)
- Sample data included for testing

## Frontend Integration

The frontend remains the same but now connects to MySQL database through the API endpoints. All CRUD operations are properly handled with error handling and data validation.
