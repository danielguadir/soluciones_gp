import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import inquiryRoutes from './routes/inquiry.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/api', (req, res) => {
    res.send('API de Servicios Personal esta corriendo en Vercel');
});

// Para local
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

export default app;
