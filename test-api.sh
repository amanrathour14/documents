#!/bin/bash

# Affiliate Tracking API Test Script
# Make sure the backend is running on http://localhost:3001

echo "🧪 Testing Affiliate Tracking API"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3001"

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
if curl -s "$BASE_URL/health" | grep -q "success"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Make sure the backend is running on port 3001"
    exit 1
fi
echo ""

# Test 2: Get Affiliates
echo "2️⃣ Testing Get Affiliates..."
if curl -s "$BASE_URL/affiliates" | grep -q "success"; then
    echo -e "${GREEN}✅ Get affiliates passed${NC}"
    echo "Available affiliates:"
    curl -s "$BASE_URL/affiliates" | jq -r '.data[] | "  - ID: \(.id), Name: \(.name)"' 2>/dev/null || echo "  (Install jq for better formatting)"
else
    echo -e "${RED}❌ Get affiliates failed${NC}"
fi
echo ""

# Test 3: Track Click
echo "3️⃣ Testing Click Tracking..."
CLICK_RESPONSE=$(curl -s "$BASE_URL/click?affiliate_id=1&campaign_id=1&click_id=test123")
if echo "$CLICK_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Click tracking passed${NC}"
    CLICK_ID=$(echo "$CLICK_RESPONSE" | jq -r '.data.click_id' 2>/dev/null || echo "test123")
else
    echo -e "${RED}❌ Click tracking failed${NC}"
    echo "Response: $CLICK_RESPONSE"
fi
echo ""

# Test 4: Track Conversion (Postback)
echo "4️⃣ Testing Conversion Postback..."
if curl -s "$BASE_URL/postback?affiliate_id=1&click_id=test123&amount=99.99&currency=USD" | grep -q "success"; then
    echo -e "${GREEN}✅ Conversion postback passed${NC}"
else
    echo -e "${RED}❌ Conversion postback failed${NC}"
fi
echo ""

# Test 5: Get Affiliate Clicks
echo "5️⃣ Testing Get Affiliate Clicks..."
if curl -s "$BASE_URL/affiliates/1/clicks" | grep -q "success"; then
    echo -e "${GREEN}✅ Get affiliate clicks passed${NC}"
else
    echo -e "${RED}❌ Get affiliate clicks failed${NC}"
fi
echo ""

# Test 6: Get Affiliate Conversions
echo "6️⃣ Testing Get Affiliate Conversions..."
if curl -s "$BASE_URL/affiliates/1/conversions" | grep -q "success"; then
    echo -e "${GREEN}✅ Get affiliate conversions passed${NC}"
else
    echo -e "${RED}❌ Get affiliate conversions failed${NC}"
fi
echo ""

# Test 7: Test Invalid Click
echo "7️⃣ Testing Invalid Click (should fail)..."
if curl -s "$BASE_URL/postback?affiliate_id=1&click_id=invalid123&amount=50&currency=USD" | grep -q "error"; then
    echo -e "${GREEN}✅ Invalid click validation passed${NC}"
else
    echo -e "${RED}❌ Invalid click validation failed${NC}"
fi
echo ""

echo "🎯 API Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Select an affiliate from the dropdown"
echo "3. View the dashboard and postback URL"
echo ""
echo "💡 Tip: Use the postback URL to test real-time conversion tracking!"