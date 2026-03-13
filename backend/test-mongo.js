const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (err) {
        console.error('DIAGNOSTIC ERROR:', err.message);
        if (err.message.includes('authentication failed')) {
            console.log('HINT: Check your Atlas Database User username and password.');
        }
    } finally {
        await client.close();
    }
}

testConnection();
