import { Router } from 'express';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import { userRoutes } from '../../modules/user/routes/user.routes';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";

dotenv.config();

const routes = Router();

const apiPrefix = process.env.API_PREFIX || '/api';

// Registrar rotas de cada contexto
routes.use(`${apiPrefix}/auth`, authRoutes);
routes.use(`${apiPrefix}/user`, userRoutes);

export default routes;