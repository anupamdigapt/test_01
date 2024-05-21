// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../config/response');

// Model
const { Op } = require('sequelize');
const { User } = require('../models/User');
const { Address } = require('../models/Address');
const { Friend } = require('../models/Friend');

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            userId: 'required',
            friendId: 'required',
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }
        let errors = {};

        const {
            userId,
            friendId,
            name
        } = req.body;

        const nameCount = await UserFriend.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }


        // Check if user exists
        const user = await User.findOne({
            where: { id: userId }
        });
        if (!user) {
            return response(res, { message: 'User not found' }, 'error', 404);
        }

        // Check if friend exists
        const friend = await User.findOne({
            where: { id: friendId }
        });
        if (!friend) {
            return response(res, { message: 'Friend not found' }, 'error', 404);
        }

        const userFriend = new Friend();
        userFriend.userId = userId
        userFriend.friendId = friendId
        userFriend.name = name

        await userFriend.save();

        return response(res, userFriend, 'new Address created successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    store,
};