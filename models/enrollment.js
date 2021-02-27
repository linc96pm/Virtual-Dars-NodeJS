const mongoose = require('mongoose');
const Joi = require('joi');
const { Customer } = require('./customer');
const { Course } = require('./course');

const enrollmentSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            }
        }),
        required: true
    },
    course: {
        type: new mongoose.Schema({
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 260
            }
        }),
        required: true
    },
    courseFee: {
        type: Number,
        required: true,
        min: 0
    },
    dateStart: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

function validateEnrollment(enrollment) {
    const schema = {
        customerId: Joi.string().required(),
        courseId: Joi.string().required(),
    }

    return Joi.validate(enrollment, schema)
}

exports.Enrollment = Enrollment;
exports.validate = validateEnrollment;