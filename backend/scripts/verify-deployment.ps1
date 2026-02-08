# TechAssassin Backend - Deployment Verification Script (PowerShell)
# 
# This script verifies that the deployed backend is functioning correctly.
# Run this after deploying to production or staging.
#
# Usage:
#   .\scripts\verify-deployment.ps1 -ApiUrl "https://your-api-domain.com"
#
# Example:
#   .\scripts\verify-deployment.ps1 -ApiUrl "https://api.techassassin.com"
#   .\scripts\verify-deployment.ps1 -ApiUrl "https://your-deployment.vercel.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

$ApiBase = "$ApiUrl/api"
$Passed = 0
$Failed = 0

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TechAssassin Backend Deployment Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API URL: $ApiBase"
Write-Host ""

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [int]$ExpectedStatus,
        [string]$Data = $null
    )
    
    Write-Host -NoNewline "Testing $Name... "
    
    try {
        $uri = "$ApiBase$Endpoint"
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -UseBasicParsing -ErrorAction Stop
        } else {
            if ($Data) {
                $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $Data -UseBasicParsing -ErrorAction Stop
            } else {
                $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -UseBasicParsing -ErrorAction Stop
            }
        }
        
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✓ PASSED" -ForegroundColor $Green -NoNewline
            Write-Host " (Status: $statusCode)"
            $script:Passed++
            return $true
        } else {
            Write-Host "✗ FAILED" -ForegroundColor $Red -NoNewline
            Write-Host " (Expected: $ExpectedStatus, Got: $statusCode)"
            Write-Host "Response: $($response.Content)"
            $script:Failed++
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✓ PASSED" -ForegroundColor $Green -NoNewline
            Write-Host " (Status: $statusCode)"
            $script:Passed++
            return $true
        } else {
            Write-Host "✗ FAILED" -ForegroundColor $Red -NoNewline
            Write-Host " (Expected: $ExpectedStatus, Got: $statusCode)"
            Write-Host "Error: $($_.Exception.Message)"
            $script:Failed++
            return $false
        }
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "1. Core Functionality Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 1: Health Check
Test-Endpoint -Name "Health Check" -Method "GET" -Endpoint "/health" -ExpectedStatus 200

# Test 2: Events List (Public)
Test-Endpoint -Name "Events List" -Method "GET" -Endpoint "/events" -ExpectedStatus 200

# Test 3: Sponsors List (Public)
Test-Endpoint -Name "Sponsors List" -Method "GET" -Endpoint "/sponsors" -ExpectedStatus 200

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "2. Authentication Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 4: Sign In with Invalid Credentials
$invalidSignIn = @{
    email = "nonexistent@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

Test-Endpoint -Name "Sign In (Invalid)" -Method "POST" -Endpoint "/auth/signin" -ExpectedStatus 401 -Data $invalidSignIn

# Test 5: Sign Up with Invalid Data
$invalidSignUp = @{
    email = "invalid-email"
    password = "123"
} | ConvertTo-Json

Test-Endpoint -Name "Sign Up (Invalid)" -Method "POST" -Endpoint "/auth/signup" -ExpectedStatus 400 -Data $invalidSignUp

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "3. Authorization Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 6: Create Event without Auth
$eventData = @{
    title = "Test Event"
    description = "Test"
    start_date = "2026-03-01T00:00:00Z"
    end_date = "2026-03-02T00:00:00Z"
    location = "Test"
    max_participants = 100
} | ConvertTo-Json

Test-Endpoint -Name "Create Event (No Auth)" -Method "POST" -Endpoint "/events" -ExpectedStatus 401 -Data $eventData

# Test 7: Create Announcement without Auth
$announcementData = @{
    content = "Test announcement"
} | ConvertTo-Json

Test-Endpoint -Name "Create Announcement (No Auth)" -Method "POST" -Endpoint "/announcements" -ExpectedStatus 401 -Data $announcementData

# Test 8: Create Resource without Auth
$resourceData = @{
    title = "Test"
    description = "Test"
    content_url = "https://example.com"
    category = "test"
} | ConvertTo-Json

Test-Endpoint -Name "Create Resource (No Auth)" -Method "POST" -Endpoint "/resources" -ExpectedStatus 401 -Data $resourceData

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "4. Validation Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 9: Create Registration with Invalid Data
$invalidRegistration = @{
    event_id = "invalid-uuid"
    team_name = ""
    project_idea = ""
} | ConvertTo-Json

Test-Endpoint -Name "Registration (Invalid)" -Method "POST" -Endpoint "/registrations" -ExpectedStatus 400 -Data $invalidRegistration

# Test 10: Get Profile with Invalid ID
Test-Endpoint -Name "Profile (Invalid ID)" -Method "GET" -Endpoint "/profile/invalid-uuid" -ExpectedStatus 400

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "5. CORS Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 11: OPTIONS Request (Preflight)
Write-Host -NoNewline "Testing CORS Preflight... "
try {
    $corsHeaders = @{
        "Origin" = "https://example.com"
        "Access-Control-Request-Method" = "GET"
    }
    $corsResponse = Invoke-WebRequest -Uri "$ApiBase/events" -Method OPTIONS -Headers $corsHeaders -UseBasicParsing -ErrorAction Stop
    
    if ($corsResponse.Headers.ContainsKey("Access-Control-Allow-Origin")) {
        Write-Host "✓ PASSED" -ForegroundColor $Green -NoNewline
        Write-Host " (CORS headers present)"
        $script:Passed++
    } else {
        Write-Host "⚠ WARNING" -ForegroundColor $Yellow -NoNewline
        Write-Host " (CORS headers missing)"
        $script:Failed++
    }
} catch {
    Write-Host "✗ FAILED" -ForegroundColor $Red -NoNewline
    Write-Host " (Error: $($_.Exception.Message))"
    $script:Failed++
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "6. Error Handling Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 12: Not Found
Test-Endpoint -Name "Not Found" -Method "GET" -Endpoint "/nonexistent-endpoint" -ExpectedStatus 404

# Test 13: Method Not Allowed
Write-Host -NoNewline "Testing Method Not Allowed... "
try {
    $methodResponse = Invoke-WebRequest -Uri "$ApiBase/health" -Method PUT -UseBasicParsing -ErrorAction Stop
    $methodStatus = $methodResponse.StatusCode
} catch {
    $methodStatus = $_.Exception.Response.StatusCode.value__
}

if ($methodStatus -eq 405 -or $methodStatus -eq 404) {
    Write-Host "✓ PASSED" -ForegroundColor $Green -NoNewline
    Write-Host " (Status: $methodStatus)"
    $script:Passed++
} else {
    Write-Host "⚠ WARNING" -ForegroundColor $Yellow -NoNewline
    Write-Host " (Status: $methodStatus)"
    $script:Passed++  # Not critical
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "7. Database Connection Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 14: Query Database
Write-Host -NoNewline "Testing Database Connection... "
try {
    $dbResponse = Invoke-WebRequest -Uri "$ApiBase/events" -Method GET -UseBasicParsing -ErrorAction Stop
    $dbContent = $dbResponse.Content
    
    if ($dbContent -match "data|events|\[\]") {
        Write-Host "✓ PASSED" -ForegroundColor $Green -NoNewline
        Write-Host " (Database responding)"
        $script:Passed++
    } else {
        Write-Host "✗ FAILED" -ForegroundColor $Red -NoNewline
        Write-Host " (Database not responding)"
        Write-Host "Response: $dbContent"
        $script:Failed++
    }
} catch {
    Write-Host "✗ FAILED" -ForegroundColor $Red -NoNewline
    Write-Host " (Error: $($_.Exception.Message))"
    $script:Failed++
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($Passed + $Failed)"
Write-Host "Passed: $Passed" -ForegroundColor $Green
Write-Host "Failed: $Failed" -ForegroundColor $Red
Write-Host ""

if ($Failed -eq 0) {
    Write-Host "✓ All tests passed! Deployment verified." -ForegroundColor $Green
    exit 0
} else {
    Write-Host "✗ Some tests failed. Please review the errors above." -ForegroundColor $Red
    exit 1
}
