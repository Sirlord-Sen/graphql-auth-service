export enum TokenType {
    BEARER = 'Bearer'
}

export interface CodeError extends Error {
    code?: string;
}