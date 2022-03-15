import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserModel
{
    username: string;
    password: string;
}

const schema = new mongoose.Schema<UserModel>({
    username: {
        type: String,
        required: true,
        maxlength: 8,
        minlength: 4,
        unique: true,
        match: [/^[a-zA-z0-9]+$/, 'Username must contain only alphanumeric characters.']
    },
    password: {
        type: String,
        required: true
    }
});

schema.pre('save', function (next)
{
    var user = this;
    if (!user.isModified('password'))
    {
        return next();
    } else
    {
        bcrypt.hash(user.password, 12, (err, hash) =>
        {
            if (err)
            {
                return next(err);
            } else
            {
                user.password = hash;
                next();
            }
        });
    }
});

export const UserSchema = mongoose.models.User || mongoose.model('User', schema);
