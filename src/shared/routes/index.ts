import { Router } from 'express';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import { userRoutes } from '../../modules/user/routes/user.routes';
import { globalRateLimiter, authRateLimiter } from '../middleware/rate-limit.middleware';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";

dotenv.config();

const routes = Router();

const apiPrefix = process.env.API_PREFIX || '/api';

// Aplicar rate limit global em todas as requisições
routes.use(globalRateLimiter);

// Registrar rotas de cada contexto com rate limits específicos
routes.use(`${apiPrefix}/auth`, authRateLimiter, authRoutes);
routes.use(`${apiPrefix}/user`, userRoutes);

export default routes;