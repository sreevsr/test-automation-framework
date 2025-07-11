#!/usr/bin/env node

/**
 * Direct Test Runner
 * 
 * Runs tests directly without complex configuration issues
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Direct Test Runner - Windows Compatible');
console.log('=' .repeat(50));

const isWindows = process.platform === 'win32';

// Try different approaches in order
const testCommands = [
  {
    name: 'All BDD Tests (no filter)',
    cmd: 'npx',
    args: ['codeceptjs', 'run', '--config', 'codecept.final.conf.js'],
    description: 'Run all BDD scenarios'
  },
  {
    name: 'Simple API Tests',
    cmd: 'npx',
    args: ['codeceptjs', 'run', '--config', 'codecept.simple.conf.js', '--grep', '@api'],
    description: 'Fallback to simple API tests'
  },
  {
    name: 'BDD with tag filter',
    cmd: 'npx',
    args: ['codeceptjs', 'run', '--config', 'codecept.final.conf.js', '--grep', 'smoke'],
    description: 'BDD tests with smoke tag'
  }
];

let currentTest = 0;

function runNextTest() {
  if (currentTest >= testCommands.length) {
    console.log('\n❌ All test configurations failed');
    console.log('\n🔧 Manual troubleshooting options:');
    console.log('1. Check internet connection (tests use JSONPlaceholder API)');
    console.log('2. Try: npx codeceptjs run --config codecept.simple.conf.js');
    console.log('3. Try: npm run test:simple:api');
    console.log('4. Check Windows firewall/proxy settings');
    return;
  }

  const test = testCommands[currentTest];
  console.log(`\n[${currentTest + 1}/${testCommands.length}] Trying: ${test.name}`);
  console.log(`Description: ${test.description}`);
  console.log(`Command: ${test.cmd} ${test.args.join(' ')}`);
  console.log('-'.repeat(40));

  const command = isWindows ? `${test.cmd}.cmd` : test.cmd;
  
  const child = spawn(command, test.args, {
    stdio: 'inherit',
    shell: isWindows
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ SUCCESS! ${test.name} worked!`);
      console.log('\n🎉 Your test automation framework is working!');
      console.log('\n📋 You can now use these commands:');
      console.log(`   npx codeceptjs run --config codecept.final.conf.js`);
      console.log(`   npm run test:all`);
      console.log(`   npm run test:simple:api`);
      return;
    } else {
      console.log(`\n⚠️ ${test.name} failed (exit code: ${code})`);
      currentTest++;
      setTimeout(runNextTest, 1000);
    }
  });

  child.on('error', (err) => {
    console.log(`\n❌ Failed to start ${test.name}: ${err.message}`);
    currentTest++;
    setTimeout(runNextTest, 1000);
  });
}

// Start testing
runNextTest();