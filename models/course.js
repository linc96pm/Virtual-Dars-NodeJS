const mongoose = require('mongoose');
const Joi = require('joi');
const { categorySchema } = require('./category');

const courseSchema = new mongoose.Schema({
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (val, callback) {
                setTimeout(() => {
                    const result = val && val.length > 0;
                    callback(result);
                }, 100);
            },
            message: 'Course must have at least one tag!'
        }
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    category: {
        type: categorySchema,
        required: true
    },
    trainer: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'no active'],
        lowercase: true,
        trim: true
    },
    fee: {
        type: Number,
        default: 0
    }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = {
        tags: Joi.array().required().items(Joi.string().min(1).max(10)),
        title: Joi.string().required().min(3).max(100),
        categoryId: Joi.string().required(),
        trainer: Joi.string().required().min(3).max(100),
        status: Joi.string().required().valid('active', 'no active').trim()
    }

    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.courseSchema = courseSchema;
exports.validate = validateCourse;