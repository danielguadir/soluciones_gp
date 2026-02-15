import { Request, Response } from 'express';
import { getAllServices, createService, updateService, deleteService } from '../services/service.service';

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await getAllServices();
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { title, description, price } = req.body;
        const service = await createService(title, description, price);
        res.json(service);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await updateService(id as string, req.body);
        res.json(service);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteService(id as string);
        res.json({ message: 'Service deleted' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
