import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/backend/persistence/db-connection';
import { UserModel, UserSchema } from "../../models/user-model";
import bcrypt from 'bcrypt';

type UsersApiResponse = {
    name: string;
}[] | {
    message: string;
} | {
    error: string;
} | {};

export interface PostApiRequest extends NextApiRequest
{
    body: UserModel;
}

export interface PatchApiRequest extends NextApiRequest
{
    body: { oldPassword: string, newPassword: string; },
    auth: string;
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<UsersApiResponse>) =>
{
    await dbConnect();
    const users = (await UserSchema.find({})).map(r => ({ name: r.username }));
    res.status(200).json(users);
};

const createUser = async (req: PostApiRequest, res: NextApiResponse<UsersApiResponse>) =>
{
    const result = await UserSchema.create(req.body);
    res.status(201).json([{ name: result.username }]);
};

const updateUser = async (req: PatchApiRequest, res: NextApiResponse<UsersApiResponse>) =>
{
    const { oldPassword, newPassword } = req.body;
    await dbConnect();
    req.auth = 'bravo';
    const user = await UserSchema.findOne({ username: req.auth });
    if (!user)
    {
        res.status(401).json({});
    } else
    {
        try
        {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch)
            {
                const hashed = await bcrypt.hash(newPassword, 12);
                await UserSchema.updateOne({ username: req.auth }, { password: hashed });
                res.status(200).json({ success: true });
            } else
            {
                res.status(401).json({ success: false, message: "Your old password was incorrect." });
            }
        } catch (err)
        {
            console.log(err);
            res.status(401).json({ success: false });
        }
    }
};

const exp = { getUsers, createUser, updateUser };

export default exp;