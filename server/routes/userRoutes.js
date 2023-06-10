const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/Users:
 *   post:
 *     summary: Create a new user
 *     responses:
 *       200:
 *         description: The created user.
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/Users/{username}:
 *   get:
 *     summary: Retrieve a specific user
 *     parameters:
 *       - in: path
*         name: username
 *         required: true
 *         description: Username of the user to retrieve
 *     responses:
 *       200:
 *         description: The requested user.
 */
router.get('/:username', userController.getUser);
/**
 * @swagger
 * /api/Users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created user.
 */
router.post('/', userController.createUser);

module.exports = router;
