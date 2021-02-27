const express = require('express');
const router = express.Router();
const { Enrollment, validate } = require('../models/enrollment');
const { Course } = require('../models/course');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
    const enrollments = await Enrollment
        .find()
        .sort('-dateStart')
        .select('-__v');

    if (!enrollments || enrollments.length === 0)
        return res.status(404).send('No enrollment found!')

    res.send(enrollments);
});

router.get('/:id', async (req, res) => {
    await Enrollment
        .findById(req.params.id, (err, result) => {
            if (err || !result)
                return res.status(404).send(`The enrollment with this id ${req.params.id} not found in DB`);

            res.send(result);
        })
        .select('-__v');
});

router.post('/', async (req, res) => {
    const body = req.body;
    const { error } = validate(body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(body.customerId)
        .catch(err => {
            return res.status(404).send(`${body.customerId} not found`);
        });

    const course = await Course.findById(body.courseId)
        .catch(err => {
            return res.status(404).send(`${body.courseId} not found`);
        });

    let enrollment = new Enrollment({
        customer: {
            _id: customer._id,
            name: customer.name
        },
        course: {
            _id: course._id,
            title: course.title
        },
        courseFee: course.fee
    });
    if (customer.isVip) 
        enrollment.courseFee = course.fee - (0.2 * course.fee); // 20 % off for Vip customers
    
    enrollment = await enrollment.save();

    customer.bonusPoints++;
    customer.save(); 

    res.status(201).send(enrollment);
});

router.put('/:id', async(req, res) => {
    let enrollment = await Enrollment
    .findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!enrollment) 
        return res.status(404).send(`The enrollment with this id ${req.params.id} not found in DB`);

    res.send(enrollment);
});

router.delete('/:id', async (req, res) => {
    let enrollment = await Enrollment.findByIdAndRemove(req.params.id);
    if (!enrollment)
        return res.status(404).send(`The enrollment with this id ${req.params.id} not found in DB`);

    res.send(enrollment);
});

module.exports = router;