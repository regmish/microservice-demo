export interface ICacheRepository {
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
}