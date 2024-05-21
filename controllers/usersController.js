// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../config/response');

// Model
const { Op } = require('sequelize');
const { User } = require('../models/User');
// const { Address } = require('../models/Address');
// const { Friend } = require('../models/Friend');

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            username: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            username
        } = req.body;

        const usernameCount = await User.count({
            where: {
                username: { [Op.eq]: username }
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const user = new User();

        user.username = username;

        await user.save();

        return response(res, user, 'User created successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    
};



module.exports = {
    store,
    show
};