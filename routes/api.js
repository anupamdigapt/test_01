const express = require('express');
const group = require('express-group-routes');

// Router
var router = express.Router();

// Common Response
const { response } = require('../config/response');

// Import Controllers
const usersController = require('../controllers/usersController');
const addressesController = require('../controllers/addressesController');
const userFriendsController = require('../controllers/userFriendsController');

router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.group('/users', (router) => {
    // router.get('/', usersController.index);
    router.post('/store', usersController.store);
    router.get('/show/:username', usersController.show);
    // router.put('/update/:id', usersController.update);
    // router.delete('/destroy/:id', usersController.destroy);
});

router.group('/addresses', (router) => {
    // router.get('/', addressesController.index);
    router.post('/store', addressesController.store);
    router.get('/show/:userId', addressesController.show);
    // router.put('/update/:id', addressesController.update);
    // router.delete('/destroy/:id', addressesController.destroy);
});

router.group('/userFriends', (router) => {
    // router.get('/', userFriendsController.index);
    router.post('/store', userFriendsController.store);
    // router.get('/show/:id', userFriendsController.show);
    // router.put('/update/:id', userFriendsController.update);
    // router.delete('/destroy/:id', userFriendsController.destroy);
});

module.exports = router;