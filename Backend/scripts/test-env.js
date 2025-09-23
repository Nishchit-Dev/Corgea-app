require('dotenv').config();

console.log('🔍 Testing environment variables...');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

if (!process.env.DB_PASSWORD) {
    console.log('\n❌ DB_PASSWORD is not set!');
    console.log('💡 Please create a .env file in the Backend folder with:');
    console.log('DB_PASSWORD=your_postgres_password');
} else {
    console.log('\n✅ Environment variables loaded successfully');
}


