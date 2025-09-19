const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'create-tables.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('Database schema created successfully!');
        
        // Test connection
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection test:', result.rows[0]);
        
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        await pool.end();
    }
}

initializeDatabase();


