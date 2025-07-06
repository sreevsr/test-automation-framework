const Helper = require('@codeceptjs/helper');

class DatabaseHelper extends Helper {
  
  constructor(config) {
    super(config);
    this.connection = null;
    this.dbType = config.type || 'postgresql'; // postgresql, mysql, sqlite
    this.config = config;
  }
  
  async _beforeSuite() {
    await this.connect();
  }
  
  async _afterSuite() {
    await this.disconnect();
  }
  
  async connect() {
    try {
      switch (this.dbType) {
        case 'postgresql':
          await this._connectPostgreSQL();
          break;
        case 'mysql':
          await this._connectMySQL();
          break;
        case 'sqlite':
          await this._connectSQLite();
          break;
        default:
          throw new Error(`Unsupported database type: ${this.dbType}`);
      }
      
      console.log(`✅ Connected to ${this.dbType} database`);
    } catch (error) {
      console.error(`❌ Database connection failed: ${error.message}`);
      throw error;
    }
  }
  
  async _connectPostgreSQL() {
    const { Client } = require('pg');
    
    this.connection = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'test_db',
      user: process.env.DB_USER || 'test_user',
      password: process.env.DB_PASSWORD || 'test_password'
    });
    
    await this.connection.connect();
  }
  
  async _connectMySQL() {
    const mysql = require('mysql2/promise');
    
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'test_db',
      user: process.env.DB_USER || 'test_user',
      password: process.env.DB_PASSWORD || 'test_password'
    });
  }
  
  async _connectSQLite() {
    const sqlite3 = require('sqlite3').verbose();
    const { promisify } = require('util');
    
    this.connection = new sqlite3.Database(process.env.DB_PATH || ':memory:');
    
    // Promisify sqlite methods
    this.connection.runAsync = promisify(this.connection.run).bind(this.connection);
    this.connection.getAsync = promisify(this.connection.get).bind(this.connection);
    this.connection.allAsync = promisify(this.connection.all).bind(this.connection);
  }
  
  async disconnect() {
    if (this.connection) {
      switch (this.dbType) {
        case 'postgresql':
          await this.connection.end();
          break;
        case 'mysql':
          await this.connection.end();
          break;
        case 'sqlite':
          await new Promise((resolve) => this.connection.close(resolve));
          break;
      }
      
      this.connection = null;
      console.log(`✅ Disconnected from ${this.dbType} database`);
    }
  }
  
  async queryDatabase(query, params = []) {
    if (!this.connection) {
      throw new Error('Database connection not established');
    }
    
    try {
      let result;
      
      switch (this.dbType) {
        case 'postgresql':
          result = await this.connection.query(query, params);
          return result.rows;
          
        case 'mysql':
          result = await this.connection.execute(query, params);
          return result[0];
          
        case 'sqlite':
          if (query.toLowerCase().startsWith('select')) {
            return await this.connection.allAsync(query, params);
          } else {
            await this.connection.runAsync(query, params);
            return { affectedRows: this.changes };
          }
          
        default:
          throw new Error(`Unsupported database type: ${this.dbType}`);
      }
    } catch (error) {
      console.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
  
  async insertRecord(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => {
      switch (this.dbType) {
        case 'postgresql':
          return `$${index + 1}`;
        case 'mysql':
        case 'sqlite':
          return '?';
      }
    }).join(', ');
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const values = Object.values(data);
    
    return await this.queryDatabase(query, values);
  }
  
  async updateRecord(table, data, whereClause, whereParams = []) {
    const setClause = Object.keys(data).map((key, index) => {
      switch (this.dbType) {
        case 'postgresql':
          return `${key} = $${index + 1}`;
        case 'mysql':
        case 'sqlite':
          return `${key} = ?`;
      }
    }).join(', ');
    
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(data), ...whereParams];
    
    return await this.queryDatabase(query, values);
  }
  
  async deleteRecord(table, whereClause, whereParams = []) {
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    return await this.queryDatabase(query, whereParams);
  }
  
  async selectRecord(table, whereClause = '', whereParams = []) {
    const query = whereClause 
      ? `SELECT * FROM ${table} WHERE ${whereClause}`
      : `SELECT * FROM ${table}`;
    
    return await this.queryDatabase(query, whereParams);
  }
  
  async truncateTable(table) {
    const query = `TRUNCATE TABLE ${table}`;
    return await this.queryDatabase(query);
  }
  
  async getRecordCount(table, whereClause = '', whereParams = []) {
    const query = whereClause 
      ? `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${table}`;
    
    const result = await this.queryDatabase(query, whereParams);
    return result[0].count;
  }
  
  // Test data setup helpers
  async setupTestData(testDataFile) {
    const fs = require('fs');
    const path = require('path');
    
    const dataPath = path.resolve(testDataFile);
    const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    for (const table in testData) {
      await this.truncateTable(table);
      
      for (const record of testData[table]) {
        await this.insertRecord(table, record);
      }
    }
    
    console.log(`✅ Test data loaded from ${testDataFile}`);
  }
  
  async cleanupTestData(tables = []) {
    for (const table of tables) {
      await this.truncateTable(table);
    }
    
    console.log(`✅ Cleaned up test data from tables: ${tables.join(', ')}`);
  }
}

module.exports = DatabaseHelper;