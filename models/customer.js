const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({

    isVip: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    bonusPoints: {
        type: Number,
        default: 0   
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50),
        isVip: Joi.boolean(),
        phone: Joi.string().min(5).max(50),
        bonusPoints: Joi.number().default(0)
    };

    return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;