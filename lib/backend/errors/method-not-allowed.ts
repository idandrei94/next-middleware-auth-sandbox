import { NextApiRequest, NextApiResponse } from "next";

export const methodNotAllowed = async (req: NextApiRequest, res: NextApiResponse<{ message: string; }>, allowed: string[]) =>
{
    res.setHeader('Access-Control-Allow-Methods', allowed.join(', '));
    res.status(405).send({ message: `Method ${req.method} is not allowed.` });
};