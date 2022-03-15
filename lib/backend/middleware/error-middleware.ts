import { NextApiRequest, NextApiResponse } from "next";
import { shouldMiddlewareSkip, TargetedApiMiddleware } from "./middleware-utils";

const errorMiddleware: TargetedApiMiddleware = (...methods) => (handler) => async (req: NextApiRequest, res: NextApiResponse) => 
{
    if (shouldMiddlewareSkip(methods, req.method))
    {
        return await handler(req, res);
    }
    try
    {
        return await handler(req, res);
    } catch (error: any)
    {
        res.status(500).send({ error: typeof error === 'string' ? error : (error as Error).message });
    }
};

export default errorMiddleware;