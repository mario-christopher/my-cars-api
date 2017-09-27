import express from 'express';

import { router as apiUsers } from './users';
import { router as apiCars } from './cars';
import { notFound } from '../middleware/not-found';
import { resetDB } from '../db/util';

export const router = express.Router();

router.get('/ping', (req, res, next) => {
    res.status(200).json('Ok');
});

router.post('/resetdb', (req, res, next) => {
    resetDB();
    res.status(200).json('DB Reset.');
});

router.use('/users', apiUsers);
router.use('/cars', apiCars);

router.use(notFound);