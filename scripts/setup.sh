#!/bin/bash

# INSTOK Setup Script
# This script automates the initial setup process

echo "======================================"
echo "  INSTOK - Instagram Clone Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✓${NC} MongoDB installed"
else
    echo -e "${YELLOW}!${NC} MongoDB not found"
    echo "Please install MongoDB from https://www.mongodb.com/try/download/community"
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

echo ""
echo "Creating uploads directory..."
mkdir -p uploads

echo ""
echo "Checking environment file..."
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/instok

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=52428800
EOL
    echo -e "${GREEN}✓${NC} .env file created"
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

echo ""
echo "======================================"
echo "  Setup Complete! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start MongoDB:"
echo -e "   ${YELLOW}mongod${NC}"
echo ""
echo "2. Start the application:"
echo -e "   ${YELLOW}npm run dev:full${NC}"
echo ""
echo "3. Open your browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "For Android development, see ANDROID_SETUP.md"
echo ""
echo "Happy coding! 🚀"

