import express from 'express';
import bodyParser from 'body-parser';
import { addUser, getUser } from '../db/user';
import { encodeToken } from '../jwt';
import { createRefreshToken, getUserFromToken, deleteToken } from '../db/refresh-token';
import { authenticate } from '../middleware/authenticate';

export const router = express.Router();

//  New User SignUp
router.post('/', bodyParser.json(), (req, res, next) => {

    try {
        let newUser = req.body;
        let result = addUser(newUser.email, newUser.name, newUser.password, newUser.avatar_url);
        if (result.outcome) {
            let result1 = createRefreshToken(result.body.id);
            res.status(200).json(
                {
                    jwt: encodeToken(result.body),
                    refresh_token: result1.body
                }
            );
        }
        else
            res.status(400).json(result.body);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Login
router.post('/login', bodyParser.json(), (req, res, next) => {

    try {
        let cred = req.body;
        let result = getUser(cred.email, cred.password);
        if (result.outcome) {
            let result1 = createRefreshToken(result.body.id);
            res.status(200).json(
                {
                    jwt: encodeToken(result.body),
                    refresh_token: result1.body
                }
            );
        }
        else
            res.status(400).json(result.body);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Refresh JWT
router.post('/refresh', bodyParser.json(), (req, res, next) => {

    try {
        let refreshToken;
        if (req.body)
            refreshToken = req.body.refresh_token;

        if (refreshToken) {
            let result = getUserFromToken(refreshToken);
            if (result.outcome) {
                res.status(200).json({
                    jwt: encodeToken(result.body)
                });
            }
            else {
                res.status(400).json(result.body);
            }
        }
        else {
            res.status(400).json('Refresh token not present.');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Protect all routes from here.
router.use(authenticate);

//  Current User
router.get('/me', (req, res, next) => {

    try {
        if (req.authenticated) {
            res.status(200).json(req.currentUser);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Logout
router.post('/logout', bodyParser.json(), (req, res, next) => {

    try {
        if (req.authenticated) {
            let refreshToken;
            if (req.body) {
                refreshToken = req.body.refresh_token;
                let result = deleteToken(refreshToken);
                if (result.outcome)
                    res.status(200).json();
                else
                    res.status(400).json(result.body);
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})