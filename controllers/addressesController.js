// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../config/response');

// Model
const { Op } = require('sequelize');
const { User } = require('../models/User');
const { Address } = require('../models/Address');
const { Friend } = require('../models/UserFriend');

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            userId: 'required',
            street: 'required',
            city: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};

        const {
            userId,
            street,
            city
        } = req.body;

        const userExist = await User.findOne({
            where: { id: userId }
        })

        if (!userExist) {
            return response(res, { userId: { message: 'User not found' } },'error', 404);
        }

        const streetCount = await Address.count({
            where: {
                street: { [Op.eq]: street }
            }
        });
        if (streetCount > 0) {
            errors['street'] = {
                message: 'this street is already exists.',
                rule: 'unique'
            }
        }

        const cityCount = await Address.count({
            where: {
                city: { [Op.eq]: city }
            }
        });
        if (cityCount > 0) {
            errors['city'] = {
                message: 'this city is already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const address = new Address();

        address.userId = userId;
        address.street = street;
        address.city = city;

        await address.save();

        return response(res, address, 'New Address Created Successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const show = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return response(res, { userId: { message: 'User Id Required.'} }, 'validation', 400)
    }

    try {
        const addresses = await Address.findAll({
            where: {userId}
        });


        if (!addresses.length) {
            return response(res, { message: 'No addresses found for this user' }, 'error', 404);
        }

        return response(res, addresses, 'Addresses retrieved successfully.');
    } catch (error) {
        return response (res, { message: error.message }, 'error', 500)
    }
};

module.exports = {
    store,
    show
};
