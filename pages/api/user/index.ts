import { NextApiRequest, NextApiResponse } from 'next';
import usersController, { PatchApiRequest } from '../../../controllers/user/user-controller';
import { methodNotAllowed } from '../../../lib/backend/errors/method-not-allowed';
import authMiddleware from '../../../lib/backend/middleware/auth-middleware';
import errorMiddleware from '../../../lib/backend/middleware/error-middleware';
import { combineMiddleware } from '../../../lib/backend/middleware/middleware-utils';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => 
{
    switch (req.method)
    {
        case 'GET':
            await usersController.getUsers(req, res);
            return;
        case 'POST':
            await usersController.createUser(req, res);
            return;
        case 'PATCH':
            await usersController.updateUser(req as PatchApiRequest, res);
            return;
        default:
            methodNotAllowed(req, res, ['GET', 'POST', 'PATCH']);
            return;
    }
};

const middlewareChain = combineMiddleware(handler, errorMiddleware(), authMiddleware('PATCH'));

export default middlewareChain;
// export default errorMiddleware(authMiddleware(handler, ['PATCH']));