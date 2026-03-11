const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://janiharsh794_db_user:IdpVFUeqc6ebLpvL@school.xu8xklp.mongodb.net/?retryWrites=true&w=majority&appName=school";

async function run() {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected successfully to server");
        await client.db("school").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.error("Connection failed:", e.message);
    } finally {
        await client.close();
    }
}
run();
