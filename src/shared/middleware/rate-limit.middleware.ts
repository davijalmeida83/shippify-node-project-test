import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";
import { RATE_LIMIT_CONFIG } from "../config/rate-limit.config";

/**
 * Helper para gerar chave de rate limit baseada em IP (com suporte a IPv6)
 */
const getIpBasedKey = (req: Request, res: Response): string => {
  return ipKeyGenerator(req.ip || "") || "";
};

/**
 * Extrai o IP + User ID para limitadores sensíveis (suporta IPv6)
 */
export const extractClientIpWithUserId = (req: Request, res: Response): string => {
  const userId = (req as any).user?.id || "anonymous";
  const ip = ipKeyGenerator(req.ip || "") || "";
  return `${ip}:${userId}`;
};

/**
 * Verifica se deve pular o rate limit (health checks, etc)
 */
export const shouldSkipRateLimit = (req: Request): boolean => {
  return req.path === "/health";
};

/**
 * Rate limite global para todas as requisições
 * 100 requisições por 15 minutos por IP
 */
export const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.global.max,
  message: RATE_LIMIT_CONFIG.global.message,
  standardHeaders: true, // retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // desabilita os headers `X-RateLimit-*`
  skip: shouldSkipRateLimit,
  keyGenerator: getIpBasedKey,
});

/**
 * Rate limite para autenticação (login, register)
 * 5 requisições por 15 minutos por IP
 * Proteção contra força bruta
 */
export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.auth.max,
  message: RATE_LIMIT_CONFIG.auth.message,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: RATE_LIMIT_CONFIG.auth.skipSuccessfulRequests,
  keyGenerator: getIpBasedKey,
});

/**
 * Rate limite para endpoints de criação (POST)
 * 20 requisições por 15 minutos por IP
 */
export const creationRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.creation.max,
  message: RATE_LIMIT_CONFIG.creation.message,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getIpBasedKey,
});

/**
 * Rate limite para endpoints sensíveis (DELETE, PUT com autenticação)
 * 10 requisições por 15 minutos by IP e User ID combinados
 */
export const sensitiveRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.sensitive.max,
  message: RATE_LIMIT_CONFIG.sensitive.message,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: extractClientIpWithUserId,
});
