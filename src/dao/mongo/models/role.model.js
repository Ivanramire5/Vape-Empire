
import mongoose from "mongoose";
export const ROLES = ["user", "admin", "moderator"];

const roleCollection = "Role";
const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const roleModel = mongoose.model(roleCollection, roleSchema);
export default roleModel;