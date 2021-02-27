const express = require('express');
const router = express.Router();
const { Category, validate } = require('../models/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Logger = require('../services/logger/logger');
const logger = new Logger('vd-logs');

router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
});

router.post('/', auth, async (req, res) => {

    logger.info('post request recieved', req.body);
    const { error } = validate(req.body);
    if (error) {
        logger.error(error.details[0].message, error);
        return res.status(400).send(error.details[0].message);
    }
    try {
        let category = new Category({
            name: req.body.name
        });
        category = await category.save();
        logger.info('new category created and saved', category);
        res.status(201).send(category);
    } catch (err) {
        logger.error(err.message, err);
        res.status(400).send({ success: false, error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    let category = await Category.findById(req.params.id);
    if (!category)
        return res.status(404).send(`The category with this id ${req.params.id} not found in DB`);

    res.send(category);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!category)
        return res.status(404).send(`The category with this id ${req.params.id} not found in DB`);

    res.send(category);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    let category = await Category.findByIdAndRemove(req.params.id);
    if (!category)
        return res.status(404).send(`The category with this id ${req.params.id} not found in DB`);

    res.send(category);
});

module.exports = router;