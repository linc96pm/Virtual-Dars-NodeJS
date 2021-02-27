const express = require('express');
const router = express.Router();
const { Course, validate } = require('../models/course');
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
    const courses = await Course
        .find()
        .sort('title');
    res.send(courses);
});

router.post('/', async (req, res) => {
    const body = req.body;
    const { error } = validate(body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    const category = await Category.findById(body.categoryId);
    if (!category)
        return res.status(404).send(`The category with this id ${req.params.id} not found in DB`);

    let course = new Course({
        tags: body.tags,
        title: body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        trainer: body.trainer,
        status: body.status,
        fee: body.fee
    });
    course = await course.save();

    res.status(201).send(course);
});

router.get('/:id', async (req, res) => {
    await Course
        .findById(req.params.id, (err, result) => {
            if (err || !result)
                return res.status(404).send(`The course with this id ${req.params.id} not found in DB`);

            res.send(result);
        });
});

router.put('/:id', async (req, res) => {
    // const { error } = validate(req.body);
    // if (error)
    //     return res.status(400).send(error.details[0].message);

    let course = await Course
    .findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!course)
        return res.status(404).send(`The course with this id ${req.params.id} not found in DB`);

    res.send(course);
});

router.delete('/:id', async (req, res) => {
    let course = await Course.findByIdAndRemove(req.params.id);
    if (!course)
        return res.status(404).send(`The course with this id ${req.params.id} not found in DB`);

    res.send(course);
});

module.exports = router;