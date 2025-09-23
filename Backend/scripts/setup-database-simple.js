const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Try different common passwords
const passwords = ['postgres', 'admin', 'password', '123456', ''];

async function tryDatabaseSetup() {
    for (const password of passwords) {
        console.log(`🔍 Trying password: ${password || '(empty)'}`);
        
        try {
            // Test connection with this password
            const testPool = new Pool({
                host: 'localhost',
                port: 5432,
                database: 'postgres',
                user: 'postgres',
                password: password,
            });
            
            await testPool.query('SELECT NOW()');
            console.log(`✅ Connection successful with password: ${password || '(empty)'}`);
            
            // If connection works, proceed with setup
            await setupDatabase(password);
            await testPool.end();
            return;
            
        } catch (error) {
            console.log(`❌ Failed with password: ${password || '(empty)'} - ${error.message}`);
            continue;
        }
    }
    
    console.log('\n❌ Could not connect with any common password');
    console.log('💡 Please manually create a .env file with the correct password');
}

async function setupDatabase(password) {
    const setupPool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: password,
    });
    
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
            host: 'localhost',
            port: 5432,
            database: 'AISecure_auth',
            user: 'postgres',
            password: password,
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
        console.log('1. Create a .env file with the working password');
        console.log('2. Run: npm start');
        console.log('3. Test the application');
        
        await appPool.end();
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        throw error;
    } finally {
        await setupPool.end();
    }
}

tryDatabaseSetup();


