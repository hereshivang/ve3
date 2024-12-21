import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true
    }

},{timestamps : true});


// Password hashing.
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10).then((hashPassword) => {
        this.password = hashPassword;
        next();
    }).catch((err) => {
        console.log(err)
        next();
    })
});

const User = mongoose.model('User', userSchema);
export default User;