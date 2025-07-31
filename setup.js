#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up MERN Registration App...\n');

// Check if Node.js is installed
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
    console.error('❌ Node.js is not installed. Please install Node.js first.');
    process.exit(1);
}

// Check if npm is installed
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' });
    console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
    console.error('❌ npm is not installed. Please install npm first.');
    process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Backend dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install backend dependencies');
    process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
    execSync('cd client && npm install', { stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install frontend dependencies');
    process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('\n📝 Creating .env file...');
    try {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created successfully');
        console.log('⚠️  Please edit the .env file with your MongoDB connection string');
    } catch (error) {
        console.error('❌ Failed to create .env file');
    }
}

// Create data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    console.log('\n📁 Creating data directory...');
    try {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('✅ Data directory created successfully');
    } catch (error) {
        console.error('❌ Failed to create data directory');
    }
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit the .env file with your MongoDB connection string');
console.log('2. Start MongoDB (if using local installation)');
console.log('3. Run the application:');
console.log('   - For development: npm run dev:full');
console.log('   - Or separately: npm run dev (backend) and cd client && npm start (frontend)');
console.log('\n🌐 Application will be available at:');
console.log('   - Frontend: http://localhost:3000');
console.log('   - Backend API: http://localhost:5000');
console.log('\n📖 For more information, see README.md'); 