const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbOptions = {
      dbName: "abhishek_sarraf_portfolio",
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, dbOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`⚠️  Server will continue running without database`);
    console.log(`💡 To fix: Install MongoDB locally OR use MongoDB Atlas`);
    console.log(
      `   - Local: Download from https://www.mongodb.com/try/download/community`
    );
    console.log(
      `   - Atlas: Get free cluster at https://www.mongodb.com/cloud/atlas`
    );
    // Don't exit - let server run without database
    // process.exit(1);
  }
};

module.exports = connectDB;
