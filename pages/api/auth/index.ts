import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/backend/persistence/db-connection';
import { UserModel, UserSchema } from '../../../models/user-model';
import bcrypt from 'bcrypt';
import { methodNotAllowed } from '../../../lib/backend/errors/method-not-allowed';
import cookie from 'cookie';

type Data = {
    success: boolean;
} | {
    message: string;
};

interface PostApiRequest extends NextApiRequest
{
    body: UserModel;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
)
{
    try
    {
        switch (req.method)
        {
            case 'POST':
                const { username, password } = req.body;
                await dbConnect();
                const user = await UserSchema.findOne({ username: username });
                if (!user)
                {
                    res.status(401).json({ success: false });
                } else
                {
                    try
                    {
                        const isMatch = await bcrypt.compare(password, user.password);
                        if (isMatch)
                        {
                            res.setHeader('Set-Cookie', cookie.serialize('auth', user.username, {
                                path: '/'
                            }));
                            res.status(200).json({ success: true });
                        } else
                        {
                            res.status(401).json({ success: false });
                        }
                    } catch {
                        res.status(401).json({ success: false });
                    }
                }
                return;
            default:
                methodNotAllowed(req, res, ['POST']);
                return;
        }
    } catch (err: any)
    {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
