#!/usr/bin/env node

/**
 * Debug Test Script
 * 
 * This script helps debug test execution issues on Windows and other platforms.
 * It checks the environment and runs basic validation tests.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🔍 Test Automation Framework - Debug Script');
console.log('='.repeat(50));

// Check Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Working directory: ${process.cwd()}`);
console.log('');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'codecept.conf.js',
  'codecept.simple.conf.js',
  'codecept.bdd.conf.js',
  'features/ecommerce_api.feature',
  'step_definitions/ecommerce_api_steps.js'
];

console.log('📁 Checking required files:');
const missingFiles = [];
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) missingFiles.push(file);
});

if (missingFiles.length > 0) {
  console.log('\n❌ Missing required files. Please ensure you have cloned the repository correctly.');
  process.exit(1);
}

// Check node_modules
console.log('\n📦 Checking dependencies:');
const nodeModulesExists = fs.existsSync('node_modules');
console.log(`  ${nodeModulesExists ? '✅' : '❌'} node_modules directory`);

if (!nodeModulesExists) {
  console.log('\n⚠️  Dependencies not installed. Please run: npm install');
  process.exit(1);
}

// Check CodeceptJS installation
const codeceptjsPath = path.join('node_modules', '.bin', process.platform === 'win32' ? 'codeceptjs.cmd' : 'codeceptjs');
const codeceptjsExists = fs.existsSync(codeceptjsPath);
console.log(`  ${codeceptjsExists ? '✅' : '❌'} CodeceptJS binary`);

// Check feature files
console.log('\n🥒 Checking feature files:');
if (fs.existsSync('features')) {
  const featureFiles = fs.readdirSync('features').filter(f => f.endsWith('.feature'));
  console.log(`  Found ${featureFiles.length} feature files:`);
  featureFiles.forEach(file => {
    const content = fs.readFileSync(path.join('features', file), 'utf8');
    const scenarios = (content.match(/@\w+/g) || []).length;
    console.log(`    📝 ${file} (${scenarios} tagged scenarios)`);
  });
}

// Check step definitions
console.log('\n🪜 Checking step definitions:');
if (fs.existsSync('step_definitions')) {
  const stepFiles = fs.readdirSync('step_definitions').filter(f => f.endsWith('_steps.js'));
  console.log(`  Found ${stepFiles.length} step definition files:`);
  stepFiles.forEach(file => {
    console.log(`    🔧 ${file}`);
  });
}

// Test simple API endpoint
console.log('\n🌐 Testing API endpoint:');
const https = require('https');
const testUrl = 'https://jsonplaceholder.typicode.com/posts/1';

https.get(testUrl, (res) => {
  console.log(`  ✅ API endpoint accessible (Status: ${res.statusCode})`);
  
  // Now try to run a simple test
  runSimpleTest();
}).on('error', (err) => {
  console.log(`  ❌ API endpoint not accessible: ${err.message}`);
  console.log('  ⚠️  You may be behind a firewall or proxy');
  
  // Still try to run tests
  runSimpleTest();
});

function runSimpleTest() {
  console.log('\n🧪 Running simple test:');
  console.log('Command: npx codeceptjs run --config codecept.simple.conf.js --grep "@api"');
  
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npx.cmd' : 'npx';
  const args = ['codeceptjs', 'run', '--config', 'codecept.simple.conf.js', '--grep', '@api'];
  
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: isWindows
  });
  
  child.on('close', (code) => {
    console.log(`\n📊 Test process exited with code: ${code}`);
    
    if (code === 0) {
      console.log('✅ Tests executed successfully!');
    } else {
      console.log('❌ Tests failed or encountered issues');
      console.log('\n🔧 Troubleshooting suggestions:');
      console.log('1. Try running: npm run test:simple:api');
      console.log('2. Check if browsers are installed: npx playwright install');
      console.log('3. Try BDD tests: npm run test:bdd:api');
      console.log('4. Check the Windows setup guide: WINDOWS_SETUP.md');
    }
    
    console.log('\n📋 Available commands:');
    console.log('  npm run test:simple:api    - Simple API tests');
    console.log('  npm run test:bdd:api       - BDD API tests');
    console.log('  npm run test:smoke         - Smoke tests');
    console.log('  npm run test:bdd           - All BDD tests');
  });
  
  child.on('error', (err) => {
    console.log(`❌ Failed to start test process: ${err.message}`);
    
    if (err.code === 'ENOENT') {
      console.log('💡 This usually means CodeceptJS is not installed properly.');
      console.log('   Try running: npm install');
    }
  });
}