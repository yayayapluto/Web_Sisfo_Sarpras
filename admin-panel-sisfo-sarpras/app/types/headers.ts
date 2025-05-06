export type Headers = Record<string, string>;

export type AuthHeaders = Headers & {
    Authorization?: string
};