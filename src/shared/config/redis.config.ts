/**
 * Configuração do Redis
 * Define parâmetros de conexão e comportamento do cache
 */

export const REDIS_CONFIG = {
  /**
   * Configuração de conexão
   */
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0", 10),
  },

  /**
   * TTL padrão para chaves de cache (em segundos)
   * 1 hora = 3600 segundos
   */
  defaultTTL: 3600,

  /**
   * TTL para diferentes tipos de dados (em segundos)
   */
  ttl: {
    /**
     * TTL para dados de usuários
     * 30 minutos
     */
    user: 30 * 60,

    /**
     * TTL para listagem de usuários
     * 15 minutos
     */
    userList: 15 * 60,

    /**
     * TTL para tokens JWT
     * 24 horas (deve ser igual ao JWT_EXPIRATION)
     */
    token: 24 * 60 * 60,

    /**
     * TTL para dados sensíveis (temporário)
     * 5 minutos
     */
    sensitive: 5 * 60,

    /**
     * TTL para contadores de rate limit (deve ser igual à janela de rate limit)
     * 15 minutos
     */
    rateLimit: 15 * 60,
  },

  /**
   * Prefixos para chaves de cache
   */
  keyPrefix: {
    user: "user:",
    userList: "user:list",
    token: "token:",
    auth: "auth:",
  },

  /**
   * Configuração de conexão e reconexão
   */
  retry: {
    maxRetries: 5,
    retryDelayBase: 1000, // 1 segundo
    retryDelayMax: 30000, // 30 segundos
  },

  /**
   * Ativar ou desativar cache globalmente
   */
  enabled: process.env.REDIS_ENABLED !== "false",
};
