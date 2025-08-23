# Project Structure Overview

```
affiliate-tracking-mvp/
├── README.md                    # Comprehensive project documentation
├── PROJECT_STRUCTURE.md         # This file - project structure overview
├── test-api.sh                  # API testing script
├── backend/                     # Express.js backend API
│   ├── package.json            # Backend dependencies and scripts
│   ├── .env.example            # Environment variables template
│   ├── server.js               # Main Express server
│   ├── database.js             # PostgreSQL connection module
│   ├── migrations.sql          # Database schema and sample data
│   └── routes/                 # API route handlers
│       ├── clicks.js           # Click tracking endpoints
│       ├── postbacks.js        # Conversion postback endpoints
│       └── affiliates.js       # Affiliate data endpoints
└── frontend/                    # Next.js frontend application
    ├── package.json            # Frontend dependencies
    ├── src/app/                # Next.js app directory
    │   ├── page.tsx            # Login page (affiliate selection)
    │   ├── dashboard/          # Affiliate dashboard
    │   │   └── [affiliate_id]/
    │   │       └── page.tsx    # Dashboard with clicks/conversions
    │   └── postback-url/       # Postback URL display
    │       └── [affiliate_id]/
    │           └── page.tsx    # Postback URL page
    └── tailwind.config.js      # Tailwind CSS configuration
```

## Key Components

### Backend (Express.js + PostgreSQL)
- **Click Tracking**: Records affiliate clicks with unique identifiers
- **Postback Processing**: Handles conversion notifications from affiliate networks
- **Data Validation**: Ensures data integrity and prevents duplicate conversions
- **RESTful API**: Clean endpoints for all affiliate tracking operations

### Frontend (Next.js + Tailwind CSS)
- **Login System**: Simple affiliate selection dropdown
- **Dashboard**: Real-time display of clicks, conversions, and performance metrics
- **Postback URL Display**: Shows affiliate-specific tracking URLs with examples
- **Responsive Design**: Modern UI that works on all devices

### Database (PostgreSQL)
- **affiliates**: Store affiliate information
- **campaigns**: Track different marketing campaigns
- **clicks**: Record all affiliate click events
- **conversions**: Store successful conversions with amounts

## Getting Started

1. **Setup Database**: Run `migrations.sql` in PostgreSQL
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Test API**: Run `./test-api.sh` to verify functionality
5. **Access App**: Open `http://localhost:3000` in browser

## API Endpoints

- `GET /click` - Track affiliate clicks
- `GET /postback` - Process conversion postbacks
- `GET /affiliates` - List all affiliates
- `GET /affiliates/:id/clicks` - Get affiliate clicks
- `GET /affiliates/:id/conversions` - Get affiliate conversions

## Features

✅ **Click Tracking** - Unique click IDs per affiliate/campaign  
✅ **Conversion Postbacks** - Server-to-server conversion tracking  
✅ **Real-time Dashboard** - Live performance metrics  
✅ **Postback URL Generation** - Affiliate-specific tracking URLs  
✅ **Data Validation** - Prevents duplicate and invalid data  
✅ **Modern UI** - Responsive design with Tailwind CSS  
✅ **TypeScript** - Full type safety in frontend  
✅ **PostgreSQL** - Robust relational database backend