import { Router } from 'express';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import dotenv from 'dotenv';

dotenv.config();

const routes = Router();

// Prefixo API versionado parametrizado
const apiPrefix = process.env.API_PREFIX || '/api';

// Registrar rotas de cada contexto
routes.use(`${apiPrefix}/auth`, authRoutes);

export default routes;