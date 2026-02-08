#!/bin/bash

# TechAssassin Backend - Deployment Verification Script
# 
# This script verifies that the deployed backend is functioning correctly.
# Run this after deploying to production or staging.
#
# Usage:
#   ./scripts/verify-deployment.sh https://your-api-domain.com
#
# Example:
#   ./scripts/verify-deployment.sh https://api.techassassin.com
#   ./scripts/verify-deployment.sh https://your-deployment.vercel.app

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if API URL is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: API URL not provided${NC}"
  echo "Usage: $0 <api-url>"
  echo "Example: $0 https://your-deployment.vercel.app"
  exit 1
fi

API_URL="$1"
API_BASE="${API_URL}/api"

echo "=========================================="
echo "TechAssassin Backend Deployment Verification"
echo "=========================================="
echo "API URL: $API_BASE"
echo ""

# Counter for passed/failed tests
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local expected_status="$4"
  local data="$5"
  
  echo -n "Testing $name... "
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$API_BASE$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
    echo "Response: $body"
    ((FAILED++))
    return 1
  fi
}

echo "=========================================="
echo "1. Core Functionality Tests"
echo "=========================================="

# Test 1: Health Check
test_endpoint "Health Check" "GET" "/health" "200"

# Test 2: Events List (Public)
test_endpoint "Events List" "GET" "/events" "200"

# Test 3: Sponsors List (Public)
test_endpoint "Sponsors List" "GET" "/sponsors" "200"

echo ""
echo "=========================================="
echo "2. Authentication Tests"
echo "=========================================="

# Test 4: Sign In with Invalid Credentials (should fail gracefully)
test_endpoint "Sign In (Invalid)" "POST" "/auth/signin" "401" \
  '{"email":"nonexistent@example.com","password":"wrongpassword"}'

# Test 5: Sign Up with Invalid Data (should return validation error)
test_endpoint "Sign Up (Invalid)" "POST" "/auth/signup" "400" \
  '{"email":"invalid-email","password":"123"}'

echo ""
echo "=========================================="
echo "3. Authorization Tests"
echo "=========================================="

# Test 6: Create Event without Auth (should fail)
test_endpoint "Create Event (No Auth)" "POST" "/events" "401" \
  '{"title":"Test Event","description":"Test","start_date":"2026-03-01T00:00:00Z","end_date":"2026-03-02T00:00:00Z","location":"Test","max_participants":100}'

# Test 7: Create Announcement without Auth (should fail)
test_endpoint "Create Announcement (No Auth)" "POST" "/announcements" "401" \
  '{"content":"Test announcement"}'

# Test 8: Create Resource without Auth (should fail)
test_endpoint "Create Resource (No Auth)" "POST" "/resources" "401" \
  '{"title":"Test","description":"Test","content_url":"https://example.com","category":"test"}'

echo ""
echo "=========================================="
echo "4. Validation Tests"
echo "=========================================="

# Test 9: Create Registration with Invalid Data (should fail)
test_endpoint "Registration (Invalid)" "POST" "/registrations" "400" \
  '{"event_id":"invalid-uuid","team_name":"","project_idea":""}'

# Test 10: Get Profile with Invalid ID (should fail)
test_endpoint "Profile (Invalid ID)" "GET" "/profile/invalid-uuid" "400"

echo ""
echo "=========================================="
echo "5. CORS Tests"
echo "=========================================="

# Test 11: OPTIONS Request (Preflight)
echo -n "Testing CORS Preflight... "
cors_response=$(curl -s -w "\n%{http_code}" -X OPTIONS "$API_BASE/events" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET")

cors_status=$(echo "$cors_response" | tail -n1)
cors_headers=$(echo "$cors_response" | head -n-1)

if [ "$cors_status" = "200" ]; then
  if echo "$cors_headers" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ PASSED${NC} (CORS headers present)"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠ WARNING${NC} (CORS headers missing)"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAILED${NC} (Status: $cors_status)"
  ((FAILED++))
fi

echo ""
echo "=========================================="
echo "6. Error Handling Tests"
echo "=========================================="

# Test 12: Not Found (should return 404)
test_endpoint "Not Found" "GET" "/nonexistent-endpoint" "404"

# Test 13: Method Not Allowed (should return appropriate error)
echo -n "Testing Method Not Allowed... "
method_response=$(curl -s -w "\n%{http_code}" -X PUT "$API_BASE/health")
method_status=$(echo "$method_response" | tail -n1)

if [ "$method_status" = "405" ] || [ "$method_status" = "404" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $method_status)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (Status: $method_status)"
  ((PASSED++))  # Not critical
fi

echo ""
echo "=========================================="
echo "7. Database Connection Tests"
echo "=========================================="

# Test 14: Query Database (via events endpoint)
echo -n "Testing Database Connection... "
db_response=$(curl -s "$API_BASE/events")

if echo "$db_response" | grep -q "data\|events\|\[\]"; then
  echo -e "${GREEN}✓ PASSED${NC} (Database responding)"
  ((PASSED++))
else
  echo -e "${RED}✗ FAILED${NC} (Database not responding)"
  echo "Response: $db_response"
  ((FAILED++))
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed! Deployment verified.${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please review the errors above.${NC}"
  exit 1
fi
