// Global cleanup after all tests
module.exports = async () => {
  console.log('🧹 Cleaning up after test execution...');
  
  // Close any open database connections
  if (global.dbConnection) {
    await global.dbConnection.close();
    console.log('✅ Database connections closed');
  }
  
  // Clean up temporary files
  const fs = require('fs');
  const path = require('path');
  
  // Clean up old screenshots (keep only last 10)
  const screenshotDir = './output/screenshots';
  if (fs.existsSync(screenshotDir)) {
    const files = fs.readdirSync(screenshotDir)
      .map(file => ({
        name: file,
        path: path.join(screenshotDir, file),
        time: fs.statSync(path.join(screenshotDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > 10) {
      files.slice(10).forEach(file => {
        fs.unlinkSync(file.path);
      });
      console.log(`✅ Cleaned up ${files.length - 10} old screenshots`);
    }
  }
  
  // Log test completion
  if (global.logger) {
    global.logger.info('Test execution completed');
  }
  
  console.log('✅ Cleanup completed');
};