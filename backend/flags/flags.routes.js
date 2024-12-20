import { Router } from 'express';
import { createFlag, getFlags, getFlagById } from './flags.controllers.js';

export const flagsRouter = Router();

flagsRouter.get('/', getFlags); // Fetch all flags
flagsRouter.get('/:id', getFlagById); // Fetch a flag by ID
flagsRouter.post('/', createFlag); // Add a new flag
