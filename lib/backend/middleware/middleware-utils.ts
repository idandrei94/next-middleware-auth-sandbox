import { NextApiRequest, NextApiResponse } from "next";

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export type ApiMiddleware = (handler: ApiHandler, methods?: string[]) => ApiHandler;
export type TargetedApiMiddleware = (...methods: string[]) => ApiMiddleware;

export const combineMiddleware = (handler: ApiHandler, ...middleware: ApiMiddleware[]) =>
{
    let result: ApiHandler | undefined = undefined;
    for (let m of middleware.reverse())
    {
        if (!result)
        {
            result = m(handler);
        } else
        {
            result = m(result);
        }
    }
    return async (req: NextApiRequest, res: NextApiResponse) =>
    {
        return await result!(req, res);
    };
};

export const shouldMiddlewareSkip = (methods: string[], method: string | undefined) => methods && !methods.find(m => m === method);