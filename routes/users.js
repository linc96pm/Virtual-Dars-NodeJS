const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    const user = await User
        .findById(req.user._id)
        .select('-password -__v');
    res.send(user);
})

router.post('/', async (req, res) => {
    const body = req.body;
    const { error } = validate(body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: body.email });
    if (user)
        return res.status(400).send('User already exists!');

    user = new User(_.pick(body, ['name', 'email', 'password', 'isAdmin']));

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

module.exports = router;