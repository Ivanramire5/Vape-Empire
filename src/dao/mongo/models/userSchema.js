import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, max: 100 },
    last_name: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 100, unique: true },
    password: { type: String, required: true, max: 100 },
    age: { type: Number, required: true, max: 100 },
    role: { type: String, max: 100, default: "user" }
});

export default mongoose.model(userCollection, userSchema);