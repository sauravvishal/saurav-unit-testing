import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.service";
import { UserAuthRequest } from "../interfaces/authUser";
import User from "../models/user.model";

export const authenticateToken: any = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
    try {
        let tokenFromReq = req.body.token || req.query.token || req.headers['x-access-token'];

        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            if (!authHeader) return res.status(401).json({ status: 401, message: 'Access Denied token required', data: null });
            tokenFromReq = authHeader.split(" ")[1];
        }
        if (tokenFromReq == null) return res.status(401).json({ status: 401, message: 'Access Denied', data: null });

        const payload = verifyToken(tokenFromReq) as any;

        if (!payload) return res.status(401).json({ status: 401, message: 'Invalid token Access Denied', data: null })
        // const user = await User.findById(payload.id);
        req.user = {
            id: payload.id,
            // firstName: user?.first_name,
            // lastName: user?.last_name,
            // email: user?.email
        };
        next();
    } catch (error) {
        return res.status(400).json({ status: 401, message: 'Token expired.', data: null });
    }
}