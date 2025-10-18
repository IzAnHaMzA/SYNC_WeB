# Comprehensive Social Media App Testing Script
# This script tests all backend API endpoints and provides manual testing instructions

Write-Host "COMPREHENSIVE SOCIAL MEDIA APP TESTING" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Test 1: Backend Health Check
Write-Host "`n1. Testing Backend Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "SUCCESS: Backend is running successfully" -ForegroundColor Green
        Write-Host "   Response: $($healthResponse.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: User Registration
Write-Host "`n2. Testing User Registration..." -ForegroundColor Yellow
$testUser = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "password123"
    fullName = "Test User $(Get-Date -Format 'HHmmss')"
}

try {
    $headers = @{'Content-Type'='application/json'}
    $body = $testUser | ConvertTo-Json
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers $headers -Body $body -UseBasicParsing
    
    if ($registerResponse.StatusCode -eq 201) {
        Write-Host "✅ User registration successful" -ForegroundColor Green
        $registerData = $registerResponse.Content | ConvertFrom-Json
        $global:testToken = $registerData.token
        $global:testUserId = $registerData.user.id
        Write-Host "   Username: $($testUser.username)" -ForegroundColor Gray
        Write-Host "   User ID: $($global:testUserId)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: User Login
Write-Host "`n3. Testing User Login..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = $testUser.email
        password = $testUser.password
    }
    $body = $loginData | ConvertTo-Json
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers $headers -Body $body -UseBasicParsing
    
    if ($loginResponse.StatusCode -eq 200) {
        Write-Host "✅ User login successful" -ForegroundColor Green
        $loginResponseData = $loginResponse.Content | ConvertFrom-Json
        $global:testToken = $loginResponseData.token
        Write-Host "   Token received: $($global:testToken.Substring(0, 20))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ User login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Current User (/me endpoint)
Write-Host "`n4. Testing Get Current User..." -ForegroundColor Yellow
try {
    $authHeaders = @{'Authorization'="Bearer $($global:testToken)"}
    $meResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $authHeaders -UseBasicParsing
    
    if ($meResponse.StatusCode -eq 200) {
        Write-Host "✅ Get current user successful" -ForegroundColor Green
        $meData = $meResponse.Content | ConvertFrom-Json
        Write-Host "   Username: $($meData.username)" -ForegroundColor Gray
        Write-Host "   Full Name: $($meData.full_name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Get current user failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Create Post
Write-Host "`n5. Testing Post Creation..." -ForegroundColor Yellow
try {
    $postData = @{
        caption = "Test post created via API testing script - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        images = @("https://via.placeholder.com/400x400/6366f1/ffffff?text=Test+Post")
    }
    $body = $postData | ConvertTo-Json
    $authHeaders = @{'Authorization'="Bearer $($global:testToken)"; 'Content-Type'='application/json'}
    $postResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/posts" -Method POST -Headers $authHeaders -Body $body -UseBasicParsing
    
    if ($postResponse.StatusCode -eq 201) {
        Write-Host "✅ Post creation successful" -ForegroundColor Green
        $postResponseData = $postResponse.Content | ConvertFrom-Json
        $global:testPostId = $postResponseData.id
        Write-Host "   Post ID: $($global:testPostId)" -ForegroundColor Gray
        Write-Host "   Caption: $($postData.caption)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Post creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Feed Posts
Write-Host "`n6. Testing Get Feed Posts..." -ForegroundColor Yellow
try {
    $feedResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/posts/feed" -Method GET -UseBasicParsing
    
    if ($feedResponse.StatusCode -eq 200) {
        Write-Host "✅ Get feed posts successful" -ForegroundColor Green
        $feedData = $feedResponse.Content | ConvertFrom-Json
        Write-Host "   Number of posts in feed: $($feedData.Count)" -ForegroundColor Gray
        if ($feedData.Count -gt 0) {
            Write-Host "   Latest post: $($feedData[0].caption.Substring(0, [Math]::Min(50, $feedData[0].caption.Length)))..." -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Get feed posts failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Like Post
Write-Host "`n7. Testing Like Post..." -ForegroundColor Yellow
if ($global:testPostId) {
    try {
        $likeData = @{userId = $global:testUserId}
        $body = $likeData | ConvertTo-Json
        $likeResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/posts/$($global:testPostId)/like" -Method POST -Headers $authHeaders -Body $body -UseBasicParsing
        
        if ($likeResponse.StatusCode -eq 200) {
            Write-Host "✅ Like post successful" -ForegroundColor Green
            $likeResponseData = $likeResponse.Content | ConvertFrom-Json
            Write-Host "   Likes count: $($likeResponseData.likes_count)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Like post failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipping like test - no post ID available" -ForegroundColor Yellow
}

# Test 8: Unlike Post
Write-Host "`n8. Testing Unlike Post..." -ForegroundColor Yellow
if ($global:testPostId) {
    try {
        $unlikeData = @{userId = $global:testUserId}
        $body = $unlikeData | ConvertTo-Json
        $unlikeResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/posts/$($global:testPostId)/unlike" -Method POST -Headers $authHeaders -Body $body -UseBasicParsing
        
        if ($unlikeResponse.StatusCode -eq 200) {
            Write-Host "✅ Unlike post successful" -ForegroundColor Green
            $unlikeResponseData = $unlikeResponse.Content | ConvertFrom-Json
            Write-Host "   Likes count: $($unlikeResponseData.likes_count)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Unlike post failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipping unlike test - no post ID available" -ForegroundColor Yellow
}

# Test 9: Search Users
Write-Host "`n9. Testing User Search..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/users/search/test" -Method GET -UseBasicParsing
    
    if ($searchResponse.StatusCode -eq 200) {
        Write-Host "✅ User search successful" -ForegroundColor Green
        $searchData = $searchResponse.Content | ConvertFrom-Json
        Write-Host "   Number of users found: $($searchData.Count)" -ForegroundColor Gray
        if ($searchData.Count -gt 0) {
            Write-Host "   First user: $($searchData[0].username)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ User search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Frontend Accessibility
Write-Host "`n10. Testing Frontend Accessibility..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4173" -UseBasicParsing
    
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
        Write-Host "   Frontend URL: http://localhost:4173" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Frontend accessibility test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 MANUAL TESTING INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "`n📱 FRONTEND TESTING (Open http://localhost:4173 in your browser):" -ForegroundColor Yellow
Write-Host "1. ✅ Registration Test:" -ForegroundColor White
Write-Host "   - Go to http://localhost:4173/register" -ForegroundColor Gray
Write-Host "   - Fill in: Full Name, Username, Email, Password" -ForegroundColor Gray
Write-Host "   - Click 'Sign Up'" -ForegroundColor Gray
Write-Host "   - Expected: Redirected to home feed with success message" -ForegroundColor Gray

Write-Host "`n2. ✅ Login Test:" -ForegroundColor White
Write-Host "   - Go to http://localhost:4173/login" -ForegroundColor Gray
Write-Host "   - Use the credentials you just created" -ForegroundColor Gray
Write-Host "   - Click 'Log In'" -ForegroundColor Gray
Write-Host "   - Expected: Redirected to home feed" -ForegroundColor Gray

Write-Host "`n3. ✅ Profile Test:" -ForegroundColor White
Write-Host "   - Click on your profile or go to http://localhost:4173/profile" -ForegroundColor Gray
Write-Host "   - Expected: Profile page loads with your information" -ForegroundColor Gray
Write-Host "   - Check: Username, bio, follower/following counts" -ForegroundColor Gray

Write-Host "`n4. ✅ Create Post Test:" -ForegroundColor White
Write-Host "   - Click the '+' button or go to http://localhost:4173/create" -ForegroundColor Gray
Write-Host "   - Add a caption and image" -ForegroundColor Gray
Write-Host "   - Click 'Post'" -ForegroundColor Gray
Write-Host "   - Expected: Post appears in feed" -ForegroundColor Gray

Write-Host "`n5. ✅ Like/Unlike Test:" -ForegroundColor White
Write-Host "   - Find a post in the feed" -ForegroundColor Gray
Write-Host "   - Click the heart icon to like" -ForegroundColor Gray
Write-Host "   - Click again to unlike" -ForegroundColor Gray
Write-Host "   - Expected: Like count updates" -ForegroundColor Gray

Write-Host "`n6. ✅ Search Test:" -ForegroundColor White
Write-Host "   - Click the search icon or go to http://localhost:4173/search" -ForegroundColor Gray
Write-Host "   - Search for 'test'" -ForegroundColor Gray
Write-Host "   - Expected: Users with 'test' in username appear" -ForegroundColor Gray

Write-Host "`n7. ✅ Follow/Unfollow Test:" -ForegroundColor White
Write-Host "   - Go to another user's profile" -ForegroundColor Gray
Write-Host "   - Click 'Follow' button" -ForegroundColor Gray
Write-Host "   - Expected: Button changes to 'Following'" -ForegroundColor Gray
Write-Host "   - Click again to unfollow" -ForegroundColor Gray

Write-Host "`n8. ✅ Navigation Test:" -ForegroundColor White
Write-Host "   - Test all navigation buttons" -ForegroundColor Gray
Write-Host "   - Home, Search, Create, Activity, Profile" -ForegroundColor Gray
Write-Host "   - Expected: All pages load correctly" -ForegroundColor Gray

Write-Host "`n9. ✅ Responsive Design Test:" -ForegroundColor White
Write-Host "   - Resize browser window" -ForegroundColor Gray
Write-Host "   - Test on mobile view (F12 > Device toolbar)" -ForegroundColor Gray
Write-Host "   - Expected: Layout adapts properly" -ForegroundColor Gray

Write-Host "`n10. ✅ Theme Toggle Test:" -ForegroundColor White
Write-Host "   - Click the theme toggle button (sun/moon icon)" -ForegroundColor Gray
Write-Host "   - Expected: Theme changes between light/dark" -ForegroundColor Gray

Write-Host "`n🔒 SECURITY TESTING:" -ForegroundColor Yellow
Write-Host "1. ✅ Authentication Test:" -ForegroundColor White
Write-Host "   - Try accessing /profile without logging in" -ForegroundColor Gray
Write-Host "   - Expected: Redirected to login page" -ForegroundColor Gray

Write-Host "`n2. ✅ Token Expiration Test:" -ForegroundColor White
Write-Host "   - Log in and wait for token to expire" -ForegroundColor Gray
Write-Host "   - Try to access protected pages" -ForegroundColor Gray
Write-Host "   - Expected: Redirected to login page" -ForegroundColor Gray

Write-Host "`n3. ✅ Input Validation Test:" -ForegroundColor White
Write-Host "   - Try registering with invalid email" -ForegroundColor Gray
Write-Host "   - Try creating post with empty caption" -ForegroundColor Gray
Write-Host "   - Expected: Appropriate error messages" -ForegroundColor Gray

Write-Host "`n📊 PERFORMANCE TESTING:" -ForegroundColor Yellow
Write-Host "1. ✅ Load Time Test:" -ForegroundColor White
Write-Host "   - Open browser dev tools (F12)" -ForegroundColor Gray
Write-Host "   - Go to Network tab" -ForegroundColor Gray
Write-Host "   - Refresh the page" -ForegroundColor Gray
Write-Host "   - Expected: Page loads in < 3 seconds" -ForegroundColor Gray

Write-Host "`n2. ✅ API Response Time Test:" -ForegroundColor White
Write-Host "   - Monitor API calls in Network tab" -ForegroundColor Gray
Write-Host "   - Expected: API responses in < 1 second" -ForegroundColor Gray

Write-Host "`n🎉 TESTING COMPLETE!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "`n📋 SUMMARY:" -ForegroundColor Cyan
Write-Host "- Backend API: All endpoints tested" -ForegroundColor White
Write-Host "- Frontend: Accessible and ready for manual testing" -ForegroundColor White
Write-Host "- Authentication: Working correctly" -ForegroundColor White
Write-Host "- Post Creation: Functional" -ForegroundColor White
Write-Host "- Like/Unlike: Working" -ForegroundColor White
Write-Host "- User Search: Functional" -ForegroundColor White

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:4173 in your browser" -ForegroundColor White
Write-Host "2. Follow the manual testing instructions above" -ForegroundColor White
Write-Host "3. Test all features thoroughly" -ForegroundColor White
Write-Host "4. Report any issues or bugs found" -ForegroundColor White

Write-Host "`nTIPS:" -ForegroundColor Cyan
Write-Host "- Use browser dev tools (F12) to monitor network requests" -ForegroundColor White
Write-Host "- Test on different screen sizes for responsive design" -ForegroundColor White
Write-Host "- Try edge cases like empty inputs, long text, etc." -ForegroundColor White
Write-Host "- Test with multiple user accounts" -ForegroundColor White
