const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * @swagger
 * /api/Chats:
 *   get:
 *     summary: Retrieve a list of chats
 *     responses:
 *       200:
 *         description: A list of chats.
 */
router.get('/', chatController.getChats);

/**
 * @swagger
 * /api/Chats:
 *   post:
 *     summary: Create a new chat
 *     responses:
 *       200:
 *         description: The created chat.
 */
router.post('/', chatController.createChat);

/**
 * @swagger
 * /api/Chats/{id}:
 *   get:
 *     summary: Retrieve a specific chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the chat to retrieve
 *     responses:
 *       200:
 *         description: The requested chat.
 */
router.get('/:id', chatController.getChat);

/**
 * @swagger
 * /api/Chats/{id}:
 *   delete:
 *     summary: Delete a specific chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the chat to delete
 *     responses:
 *       200:
 *         description: Chat deleted.
 */
router.delete('/:id', chatController.deleteChat);

/**
 * @swagger
 * /api/Chats/{id}/messages:
 *   get:
 *     summary: Retrieve messages of a specific chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the chat to retrieve messages from
 *     responses:
 *       200:
 *         description: List of messages in the chat.
 */
router.get('/:id/messages', chatController.getChatMessages);

/**
 * @swagger
 * /api/Chats/{id}/messages:
 *   post:
 *     summary: Create a new message in a specific chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the chat to add a message to
 *     responses:
 *       200:
 *         description: The created message.
 */
router.post('/:id/messages', chatController.createChatMessage);

module.exports = router;
