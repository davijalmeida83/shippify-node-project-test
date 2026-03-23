/**
 * Interface para o serviço de cache
 */
export interface ICacheService {
  /**
   * Obter um valor do cache
   * @param key Chave do cache
   * @returns Valor armazenado ou null se não encontrado
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Definir um valor no cache
   * @param key Chave do cache
   * @param value Valor a armazenar
   * @param ttl TTL em segundos (opcional, usa padrão se não fornecido)
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Deletar uma chave do cache
   * @param key Chave a deletar
   */
  del(key: string | string[]): Promise<void>;

  /**
   * Deletar múltiplas chaves que combinam com um padrão
   * @param pattern Padrão glob (ex: "user:*")
   */
  delByPattern(pattern: string): Promise<void>;

  /**
   * Verificar se uma chave existe
   * @param key Chave a verificar
   */
  exists(key: string): Promise<boolean>;

  /**
   * Obter TTL restante de uma chave
   * @param key Chave a verificar
   * @returns TTL em segundos, -1 se sem expiração, -2 se não existe
   */
  ttl(key: string): Promise<number>;

  /**
   * Limpar toda a base de dados
   */
  flush(): Promise<void>;
}
