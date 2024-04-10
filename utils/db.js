const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://daiyuheng:nr4D7LDTfX83PiajBtAEBJ0FAaoDztOxpNQLf5ZpFHJmUBqfw26IwcRV82sUvve0C5NYZpM28BU6ACDbXvfHaQ%3D%3D@daiyuheng.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@daiyuheng@';

if (!process.env.MONGODB_URI) {
// throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };