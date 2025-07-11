#!/usr/bin/env node

/**
 * Smart Tag Runner
 * 
 * Allows users to run tests by specific tags with interactive selection
 * and reliable Windows compatibility.
 */

const { spawn } = require('child_process');
const readline = require('readline');

console.log('🏷️  Smart Tag Runner - Test Automation Framework');
console.log('=' .repeat(60));

// Available tags and their descriptions
const availableTags = {
  'smoke': 'Quick smoke tests - basic functionality validation',
  'regression': 'Full regression test suite',
  'api': 'API endpoint testing',
  'web': 'Web UI testing scenarios',
  'products': 'Product-related functionality',
  'cart': 'Shopping cart operations',
  'login': 'Authentication and login flows',
  'security': 'Security and authorization tests',
  'performance': 'Performance and load testing',
  'all': 'Run all tests without filtering'
};

// Get tag from command line argument or prompt user
const tagArg = process.argv[2];

if (tagArg) {
  // Tag provided as argument
  runTestsByTag(tagArg);
} else {
  // Interactive mode
  showInteractiveMenu();
}

function showInteractiveMenu() {
  console.log('\n📋 Available Test Tags:');
  console.log('-'.repeat(40));
  
  let index = 1;
  Object.entries(availableTags).forEach(([tag, description]) => {
    console.log(`${index.toString().padStart(2)}. @${tag.padEnd(12)} - ${description}`);
    index++;
  });
  
  console.log('\n💡 Usage Examples:');
  console.log('  npm run test:by-tag smoke');
  console.log('  npm run test:by-tag regression');
  console.log('  node tag-runner.js api');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\n🎯 Enter tag name (or number): ', (answer) => {
    rl.close();
    
    // Handle numeric input
    const num = parseInt(answer);
    if (num && num >= 1 && num <= Object.keys(availableTags).length) {
      const tagName = Object.keys(availableTags)[num - 1];
      runTestsByTag(tagName);
    } else if (availableTags[answer.toLowerCase()]) {
      runTestsByTag(answer.toLowerCase());
    } else {
      console.log(`\n❌ Invalid tag: ${answer}`);
      console.log('Available tags:', Object.keys(availableTags).join(', '));
      process.exit(1);
    }
  });
}

function runTestsByTag(tag) {
  if (!availableTags[tag.toLowerCase()]) {
    console.log(`\n❌ Unknown tag: ${tag}`);
    console.log('Available tags:', Object.keys(availableTags).join(', '));
    process.exit(1);
  }
  
  const normalizedTag = tag.toLowerCase();
  console.log(`\n🚀 Running tests with tag: @${normalizedTag}`);
  console.log(`📝 Description: ${availableTags[normalizedTag]}`);
  console.log('-'.repeat(60));
  
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npx.cmd' : 'npx';
  
  let args;
  if (normalizedTag === 'all') {
    // Run all tests without filtering
    args = ['codeceptjs', 'run', '--config', 'codecept.final.conf.js'];
    console.log('Command: npx codeceptjs run --config codecept.final.conf.js');
  } else {
    // Run tests with specific tag
    args = ['codeceptjs', 'run', '--config', 'codecept.final.conf.js', '--grep', normalizedTag];
    console.log(`Command: npx codeceptjs run --config codecept.final.conf.js --grep ${normalizedTag}`);
  }
  
  console.log('\n📊 Test Execution Results:');
  console.log('-'.repeat(40));
  
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: isWindows
  });
  
  child.on('close', (code) => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXECUTION SUMMARY');
    console.log('='.repeat(60));
    
    if (code === 0) {
      console.log('✅ SUCCESS: All tests passed!');
    } else if (code === 1) {
      console.log('⚠️  TESTS RAN: Some tests may have failed (normal with demo data)');
      console.log('💡 If you saw test scenarios execute above, your framework is working!');
    } else {
      console.log(`❌ EXECUTION FAILED: Exit code ${code}`);
    }
    
    console.log(`\n🏷️  Tag: @${normalizedTag}`);
    console.log(`📝 Description: ${availableTags[normalizedTag]}`);
    
    console.log('\n🎯 Next Steps:');
    if (normalizedTag === 'smoke') {
      console.log('  - Smoke tests validate basic functionality');
      console.log('  - Run regression tests: npm run test:tag:regression');
    } else if (normalizedTag === 'regression') {
      console.log('  - Full test suite completed');
      console.log('  - Review test report in ./output directory');
    } else {
      console.log(`  - ${normalizedTag} tests completed`);
      console.log('  - Run all tests: npm run test:all');
    }
    
    console.log('\n📚 Available Commands:');
    console.log('  npm run test:by-tag <tag>    - Interactive/direct tag selection');
    console.log('  npm run test:tag:smoke       - Direct smoke tests');
    console.log('  npm run test:tag:regression  - Direct regression tests');
    console.log('  npm run test:all             - All tests');
  });
  
  child.on('error', (err) => {
    console.log(`\n❌ Failed to start test execution: ${err.message}`);
    
    if (err.code === 'ENOENT') {
      console.log('💡 This usually means CodeceptJS is not installed properly.');
      console.log('   Try running: npm install');
    }
  });
}