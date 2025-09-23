const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Database connection for setup (using default postgres database)
const setupPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database first
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres', // You'll need to update this
});

async function setupDatabase() {
    try {
        console.log('🔧 Setting up AISecure database...');
        
        // Step 1: Create database
        console.log('📝 Creating database...');
        try {
            await setupPool.query('CREATE DATABASE AISecure_auth');
            console.log('✅ Database created successfully');
        } catch (error) {
            if (error.code === '42P04') {
                console.log('⚠️  Database already exists, continuing...');
            } else {
                throw error;
            }
        }
        
        // Step 2: Connect to the new database
        console.log('🔗 Connecting to AISecure_auth database...');
        const appPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'AISecure_auth',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        });
        
        // Step 3: Create basic tables
        console.log('📊 Creating basic tables...');
        const basicSchema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
        await appPool.query(basicSchema);
        console.log('✅ Basic tables created');
        
        // Step 4: Create GitHub tables
        console.log('🔗 Creating GitHub integration tables...');
        const githubSchema = fs.readFileSync(path.join(__dirname, '..', 'database', 'github-schema.sql'), 'utf8');
        await appPool.query(githubSchema);
        console.log('✅ GitHub tables created');
        
        // Step 5: Test the setup
        console.log('🧪 Testing database setup...');
        const result = await appPool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\'');
        console.log(`✅ Found ${result.rows[0].table_count} tables in database`);
        
        console.log('🎉 Database setup complete!');
        console.log('\n📋 Next steps:');
        console.log('1. Update your .env file with the correct database password');
        console.log('2. Run: npm start');
        console.log('3. Test the application');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        
        if (error.code === '28P01') {
            console.log('\n💡 Password authentication failed. Please:');
            console.log('1. Check your PostgreSQL password');
            console.log('2. Update the DB_PASSWORD in your .env file');
            console.log('3. Try again');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Connection refused. Please:');
            console.log('1. Make sure PostgreSQL is running');
            console.log('2. Check your DB_HOST and DB_PORT in .env file');
        }
        
        process.exit(1);
    } finally {
        await setupPool.end();
    }
}

// Load environment variables
require('dotenv').config();

setupDatabase();
