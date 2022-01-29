import jwt from 'jsonwebtoken';
interface Data {
    [key: string]: any;
}
declare class Token {
    static sign(data: Data, subject: string, expiresIn: number, key?: string): string;
    static read(token: string, key?: string): string | jwt.JwtPayload | null;
}
export default Token;
//# sourceMappingURL=Token.d.ts.map