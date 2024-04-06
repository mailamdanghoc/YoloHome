import { connect } from "mongoose";

async function connectDB() {
  const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017/YoloHome";

  try {
    await connect(uri);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database error: ", err);
  }
}

export default connectDB;
