import { Request, Response } from 'express';
import { addUser, getUsers } from '../database/database';

export class UserController {
    constructor() { };

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await getUsers(req.query.fullInfo === 'true');
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const payload = req.body;
        try {
            const users = await addUser(payload.name);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}