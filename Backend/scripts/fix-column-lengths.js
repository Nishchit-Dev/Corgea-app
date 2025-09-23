const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

async function fixColumnLengths() {
    try {
        console.log('Fixing column length constraints...');
        
        // Increase category column length
        await pool.query(`
            ALTER TABLE vulnerability_details 
            ALTER COLUMN category TYPE VARCHAR(100)
        `);
        console.log('✓ Increased category column length to 100');
        
        // Increase owasp_category column length
        await pool.query(`
            ALTER TABLE vulnerability_details 
            ALTER COLUMN owasp_category TYPE VARCHAR(100)
        `);
        console.log('✓ Increased owasp_category column length to 100');
        
        // Increase cwe_id column length (some CWE IDs can be longer)
        await pool.query(`
            ALTER TABLE vulnerability_details 
            ALTER COLUMN cwe_id TYPE VARCHAR(20)
        `);
        console.log('✓ Increased cwe_id column length to 20');
        
        console.log('✅ Column length fixes completed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing column lengths:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    fixColumnLengths()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { fixColumnLengths };
