/**
 * Configurações de Rate Limiting
 * Centraliza todos os parâmetros de rate limiting da aplicação
 */

export const RATE_LIMIT_CONFIG = {
  /**
   * Janela de tempo padrão (em milissegundos)
   * 15 minutos = 15 * 60 * 1000 = 900000 ms
   */
  windowMs: 15 * 60 * 1000,

  /**
   * Rate limiter global
   * Aplica a todas as requisições
   */
  global: {
    max: 100, // 100 requisições por janela
    message:
      "Muitas requisições deste IP, tente novamente depois de 15 minutos",
  },

  /**
   * Rate limiter para autenticação (login, register)
   * Proteção contra força bruta
   */
  auth: {
    max: 5, // 5 tentativas por janela
    message:
      "Muitas tentativas de autenticação, tente novamente depois de 15 minutos",
    skipSuccessfulRequests: false, // Contar todas as requisições, mesmo as bem-sucedidas
  },

  /**
   * Rate limiter para endpoints de criação (POST)
   */
  creation: {
    max: 20, // 20 requisições por janela
    message:
      "Muitas requisições de criação, tente novamente depois de 15 minutos",
  },

  /**
   * Rate limiter para endpoints sensíveis (DELETE, PUT com autenticação)
   */
  sensitive: {
    max: 10, // 10 operações por janela
    message:
      "Muitas operações sensíveis, tente novamente depois de 15 minutos",
  },
};
