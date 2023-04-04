"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authToken_1 = __importDefault(require("../services/authToken"));
const userAuthentication = async (req, res, next) => {
    const { authorization } = req.headers;
    const auth = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
    if (!auth || auth === 'undefined') {
        return res.status(401).json({ message: 'Token inválido!' });
    }
    try {
        const tokenVerified = await jsonwebtoken_1.default.verify(auth, authToken_1.default);
        req.user = {
            userLoggedId: Number(tokenVerified.id)
        };
        next();
    }
    catch (error) {
        if (error.message === 'invalid token') {
            return res.status(401).json({ message: "Token inválido!" });
        }
        return res.status(500).json('Token fornecido gerando erro inesperado do servidor.');
    }
};
exports.userAuthentication = userAuthentication;
//# sourceMappingURL=userAuthentication.js.map