require('dotenv').config();
const pool = require('../config/database');

async function createTables() {
    try {
        console.log('Creating database tables...');
        
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created');

        // Create user_sessions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token_hash VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ User sessions table created');

        // Create indexes
        await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at)');
        console.log('✅ Indexes created');

        // Test the tables
        const result = await pool.query('SELECT COUNT(*) FROM users');
        console.log('✅ Tables created successfully!');
        console.log('Users table has', result.rows[0].count, 'records');

    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    } finally {
        await pool.end();
    }
}

createTables();
