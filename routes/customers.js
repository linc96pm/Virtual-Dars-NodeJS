const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    var id = req.params.id
    await Customer.findById(id).exec((err, result) => {
        if (err || !result)
            return res.status(404).send(`The category with this id ${id} not found in DB`);

        res.send(result);
    });

});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone,
        bonusPoints: req.body.bonusPoints
    });
    customer = await customer.save();

    res.status(201).send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const body = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!customer)
        return res.status(404).send(`The customer with this id ${req.params.id} not found in DB`);

    res.send(customer);

});

router.delete('/:id', async (req, res) => {
    await Customer.findByIdAndRemove(req.params.id).exec((err, result) => {
        if (err || !result)
            return res.status(404).send(`The category with this id ${req.params.id} not found in DB`);

        res.status(201).send(result);
    })
});

module.exports = router;