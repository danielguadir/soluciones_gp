import { Request, Response } from 'express';
import { loginUser, registerAdmin } from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const data = await loginUser(email, password);
        res.json(data);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        const user = await registerAdmin(email, password, name);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
