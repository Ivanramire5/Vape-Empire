
//Nuevo modelo de usuarios
import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name:{
        type: String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        default:'user'
    },
    pets:{
        type:[
            {
                _id:{
                    type:mongoose.SchemaTypes.ObjectId,
                    ref:'Pets'
                }
            }
        ],
        default:[]
    }
})

const userSchema = mongoose.model(collection,schema);

export default userSchema;

// import mongoose from "mongoose";

// const userCollection = "Users";

// const userSchema = new mongoose.Schema({
//     first_name: { type: String, required: true, max: 100 },
//     last_name: { type: String, required: true, max: 100 },
//     email: { type: String, required: true, max: 100, unique: true },
//     password: { type: String, required: true, max: 100 },
//     age: { type: Number, required: true, max: 100 },
//     role: { type: String, max: 100, default: "user" }
// });

// export default mongoose.model(userCollection, userSchema);