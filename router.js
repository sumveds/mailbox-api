const multer = require('multer');
const upload = multer();

const emailController = require('./controllers/emailController');
const userController = require('./controllers/userController');

const express = require('express');

module.exports = (app) => {
    const apiRoutes = express.Router();

    //= ================================================================================================
    // User Routes
    //= ================================================================================================
    const userRoutes = express.Router();
    apiRoutes.use('/users', userRoutes);

    userRoutes.post('/', userController.createUser);
    userRoutes.post('/login', userController.login);

    //= ================================================================================================
    // Email Routes
    //= ================================================================================================
    const emailRoutes = express.Router();
    apiRoutes.use('/emails', emailRoutes);

    emailRoutes.post('/', upload.single('attachment'), emailController.postEmail);
    emailRoutes.get('/:id/replies', emailController.getReplies);
    emailRoutes.get('/:id/mark-as-read', emailController.markEmailRead);
    emailRoutes.get('/drafts', emailController.getDrafts);
    emailRoutes.get('/received', emailController.getReceivedEmails);
    emailRoutes.get('/sent', emailController.getSentEmails);


    // Set url for API group routes
    app.use('/v1', apiRoutes);
};