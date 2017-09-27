import { decodeToken } from '../jwt';

export const authenticate = (req, res, next) => {

    let token = req.headers['x-access-token'];
    if (token) {
        try {
            let user = decodeToken(token);
            req.authenticated = true;
            req.currentUser = user;
            next();
        }
        catch (err) {
            res.status(401).json(err.message);      //Failed on decoding token.
        }
    }
    else {
        res.status(401).json('Unauthorized access.');
    }
}