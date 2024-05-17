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
    const username = req.query.username || req.params.username;
    if (!username) {
        return response(res, { username: { message: 'Username is Required' } }, 'validation', 400);
    }

    try {
        // Find the user by username
        const user = await User.findOne({
            where: { username },
            include: {
                model: User,
                as: 'friends',
                through: { attributes: [] },
                include: {
                    model: User,
                    as: 'friends',
                    through: { attributes: [] }
                }
            }
        });

        if (!user) {
            return response(res, { message: 'User not found' }, 'error', 404);
        }

        // Check if user has friends
        if (!user.friends || !Array.isArray(user.friends)) {
            return response(res, { message: 'User has no friends' }, 'error', 404);
        }

        // Function to recursively find all friends
        const getAllFriends = (user) => {
            if (!user.friends || !Array.isArray(user.friends)) {
                return [];
            }
            const friends = user.friends.map(friend => ({
                id: friend.id,
                username: friend.username,
                friends: getAllFriends(friend)
            }));
            return friends;
        };

        // Get all friends including indirect relationships
        const allFriends = getAllFriends(user);

        return response(res, { user: { id: user.id, username: user.username }, friends: allFriends }, 'User fetched.');
    } catch (error) {
        return response(res, { message: error.message }, 'error', 500);
    }
};



module.exports = {
    store,
    show
};