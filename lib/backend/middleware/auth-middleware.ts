import { NextApiRequest, NextApiResponse } from "next";
import { shouldMiddlewareSkip, TargetedApiMiddleware } from "./middleware-utils";

const authMiddleware: TargetedApiMiddleware = (...methods) => (handler) => async (req: NextApiRequest, res: NextApiResponse) => 
{
    if (shouldMiddlewareSkip(methods, req.method))
    {
        return await handler(req, res);
    }
    const token = req.cookies['auth'];
    if (!token)
    {
        res.status(401).json({ message: 'Access denied.' });
    } else
    {
        return await handler(req, res);
    }
};

export default authMiddleware;