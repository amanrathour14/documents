# Affiliate Postback Tracking MVP

A full-stack affiliate tracking system that supports click tracking, conversion postbacks, and affiliate dashboards with PostgreSQL backend and Next.js frontend.

## 🎯 System Overview

### What is Server-to-Server (S2S) Postback?

Server-to-Server postback is a tracking method where conversion data is sent directly from one server to another via HTTP requests. This system allows affiliate networks and advertisers to track conversions in real-time without relying on browser cookies or JavaScript.

**How it works:**
1. **Click Tracking**: When a user clicks an affiliate link, a unique `click_id` is generated and stored
2. **Conversion Postback**: When the user converts (purchase, signup, etc.), the affiliate's server calls our postback URL with the `click_id` and conversion details
3. **Validation**: Our system validates the `click_id` belongs to the correct affiliate and records the conversion
4. **Dashboard**: Affiliates can view their clicks, conversions, and performance metrics in real-time

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Login Page    │    │ • Click Tracking│    │ • affiliates    │
│ • Dashboard     │    │ • Postbacks     │    │ • campaigns     │
│ • Postback URL  │    │ • Affiliate API │    │ • clicks        │
└─────────────────┘    └─────────────────┘    │ • conversions   │
                                              └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd affiliate-tracking-mvp
```

### 2. Database Setup

#### Create Database
```sql
CREATE DATABASE affiliate_tracking;
```

#### Run Migrations
Connect to your database and run the SQL from `backend/migrations.sql`:

```bash
psql -U postgres -d affiliate_tracking -f backend/migrations.sql
```

Or manually run the SQL commands in your PostgreSQL client.

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Example .env file:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=affiliate_tracking
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
```

**Start the backend:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies (already done if using create-next-app)
npm install

# Start the frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📊 Database Schema

### Tables

#### `affiliates`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))

#### `campaigns`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))

#### `clicks`
- `id` (SERIAL PRIMARY KEY)
- `affiliate_id` (INT, REFERENCES affiliates.id)
- `campaign_id` (INT, REFERENCES campaigns.id)
- `click_id` (VARCHAR(100), UNIQUE per affiliate+campaign)
- `timestamp` (TIMESTAMP DEFAULT NOW())

#### `conversions`
- `id` (SERIAL PRIMARY KEY)
- `click_id` (INT, REFERENCES clicks.id)
- `amount` (FLOAT)
- `currency` (VARCHAR(10))
- `timestamp` (TIMESTAMP DEFAULT NOW())

## 🔌 API Endpoints

### Base URL: `http://localhost:3001`

#### 1. Track Click
```http
GET /click?affiliate_id=1&campaign_id=1&click_id=abc123
```

**Response:**
```json
{
  "status": "success",
  "message": "Click tracked",
  "data": {
    "id": 1,
    "affiliate_id": 1,
    "campaign_id": 1,
    "click_id": "abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Track Conversion (Postback)
```http
GET /postback?affiliate_id=1&click_id=abc123&amount=99.99&currency=USD
```

**Response:**
```json
{
  "status": "success",
  "message": "Conversion tracked",
  "data": {
    "conversion": {
      "id": 1,
      "click_id": 1,
      "amount": 99.99,
      "currency": "USD",
      "timestamp": "2024-01-15T11:00:00Z"
    },
    "click": {
      "id": 1,
      "affiliate_id": 1,
      "campaign_id": 1,
      "click_id": "abc123",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 3. Get Affiliates
```http
GET /affiliates
```

#### 4. Get Affiliate Clicks
```http
GET /affiliates/1/clicks
```

#### 5. Get Affiliate Conversions
```http
GET /affiliates/1/conversions
```

## 🧪 Testing the System

### 1. Test Click Tracking
```bash
curl "http://localhost:3001/click?affiliate_id=1&campaign_id=1&click_id=test123"
```

### 2. Test Conversion Postback
```bash
curl "http://localhost:3001/postback?affiliate_id=1&click_id=test123&amount=99.99&currency=USD"
```

### 3. View Dashboard
1. Open `http://localhost:3000`
2. Select an affiliate from the dropdown
3. View clicks and conversions in the dashboard

## 🎨 Frontend Features

### Pages

#### `/` - Login Page
- Dropdown to select affiliate
- Redirects to dashboard after selection

#### `/dashboard/[affiliate_id]` - Affiliate Dashboard
- **Stats Cards**: Total clicks, conversions, conversion rate
- **Clicks Table**: Campaign, click ID, timestamp
- **Conversions Table**: Amount, currency, campaign, timestamp
- Navigation to postback URL page

#### `/postback-url/[affiliate_id]` - Postback URL Display
- Shows affiliate's unique postback URL
- Parameter explanations and examples
- Copy-to-clipboard functionality
- Testing instructions

## 🔧 Development

### Backend Structure
```
backend/
├── server.js          # Main Express server
├── database.js        # PostgreSQL connection
├── routes/
│   ├── clicks.js      # Click tracking routes
│   ├── postbacks.js   # Conversion postback routes
│   └── affiliates.js  # Affiliate data routes
├── migrations.sql     # Database schema
└── package.json
```

### Frontend Structure
```
frontend/
├── src/app/
│   ├── page.tsx                           # Login page
│   ├── dashboard/[affiliate_id]/page.tsx   # Dashboard
│   └── postback-url/[affiliate_id]/page.tsx # Postback URL
├── tailwind.config.js
└── package.json
```

## 🚨 Error Handling

### Common Errors

#### Invalid Click
```json
{
  "status": "error",
  "message": "Invalid click: click not found for this affiliate"
}
```

#### Missing Parameters
```json
{
  "status": "error",
  "message": "Missing required parameters: affiliate_id, click_id, amount, currency"
}
```

#### Duplicate Conversion
```json
{
  "status": "error",
  "message": "Conversion already tracked for this click"
}
```

## 🔒 Security Considerations

- **Input Validation**: All parameters are validated before processing
- **SQL Injection Protection**: Uses parameterized queries with node-postgres
- **CORS**: Configured for development (adjust for production)
- **Rate Limiting**: Consider implementing for production use

## 📈 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=affiliate_tracking
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
PORT=3001
```

### Security Enhancements
- Enable HTTPS
- Implement authentication/authorization
- Add rate limiting
- Use environment-specific CORS settings
- Database connection pooling optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `http://localhost:3001/`
2. Review the database schema in `backend/migrations.sql`
3. Check browser console for frontend errors
4. Verify database connection and credentials

---

**Happy Tracking! 🎯**