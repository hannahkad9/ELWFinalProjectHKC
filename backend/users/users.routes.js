import {Router} from 'express';
import { handleGetUsers,handleGetUserById ,createUser} from './users.controllers.js';
import { checkSecretMiddleware } from '../middlewares/check-secret.middleware.js';



export const usersRouter = Router();

usersRouter.get('/', handleGetUsers);
usersRouter.get('/:id', checkSecretMiddleware, handleGetUserById);
usersRouter.post('/', createUser);
usersRouter.post('/login', checkSecretMiddleware, handleGetUserById);
