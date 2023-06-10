const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
// Use cors middleware and allow all origins
app.use(cors());
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'API for a Chat Application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully!");
});

app.use('/api/Users', userRoutes);
app.use('/api/Chats', chatRoutes);
app.use('/api/Tokens', tokenRoutes);

const server = http.createServer(app);

// Bind Socket.IO to the server and handle CORS
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log(`Message Received: ${message}`);
    io.sockets.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => console.log('Server started on port 3000'));
