import express from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../middleware/authenticate';
import { addCar, updateCar, deleteCar, getCars } from '../db/car';

export const router = express.Router();

//  Protect all routes from here.
router.use(authenticate);

//  Add New Car
router.post('/', bodyParser.json(), (req, res, next) => {

    try {
        if (req.authenticated) {
            let newCar = req.body;
            if (newCar) {
                let result = addCar(newCar.make, newCar.model, newCar.year, req.currentUser.id);
                if (result.outcome) {
                    res.status(200).json(result.body);
                }
                else {
                    res.status(400).json(result.body);
                }
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Update Car
router.put('/:id', bodyParser.json(), (req, res, next) => {

    try {
        if (req.authenticated) {
            let car = req.body;
            let carId = req.params['id'];
            if (carId) {
                let result = updateCar(carId, car.make, car.model, car.year, req.currentUser.id);
                if (result.outcome) {
                    res.status(200).json(result.body);
                }
                else {
                    res.status(400).json(result.body);
                }
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Delete Car
router.delete('/:id', (req, res, next) => {

    try {
        if (req.authenticated) {
            let carId = req.params['id'];
            if (carId) {
                let result = deleteCar(carId, req.currentUser.id);
                if (result.outcome) {
                    res.status(200).json(result.body);
                }
                else {
                    res.status(400).json(result.body);
                }
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})

//  Get Cars
router.get('/', (req, res, next) => {

    try {
        if (req.authenticated) {
            let result = getCars(req.currentUser.id);
            if (result.outcome) {
                res.status(200).json(result.body);
            }
            else {
                res.status(400).json(result.body);
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
})