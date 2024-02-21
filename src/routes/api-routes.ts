// src/routes/apiRoutes.ts
import express, { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user-controller';

// Create an Express router
const router: Router = express.Router();

// Define your API routes
router.get('/', (req: Request, res: Response) => {
    res.send('API is running');
});
const userController: UserController = new UserController();
router.get('/users', userController.getUsers);

router.post('/users', userController.createUser);

// Export the router to be used in other files
export default router;