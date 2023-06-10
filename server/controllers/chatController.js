const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path according to your project structure
exports.getChats = async (req, res) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');
      
      // Using populate to get the user details and excluding the password field
      const chats = await Chat.find({ users: { $in: [userId] } })
        .populate('users', '-password');

      // Change the name of the chat to the other user's name
      const modifiedChats = chats.map(chat => {
        const otherUser = chat.users.find(user => user._id.toString() !== userId);
        return {
          ...chat._doc,
          name: otherUser.username
        };
      });
        
      res.send(modifiedChats);
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.sendStatus(403);
  }
};



exports.createChat = async (req, res) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');

      // Fetch the contact user directly from the database
      const contact = await User.findOne({ username: req.body.username }).select('-password');
      if (!contact) throw new Error("Contact not found");

      // Fetch the authenticated user directly from the database
      const user = await User.findById(userId).select('-password');
      if (!user) throw new Error("User not found");

      // Create the chat
      const chat = new Chat({
        name: contact.username,
        users: [contact, user]
      });

      await chat.save();
      res.send(chat);

    } catch (error) {
      res.status(401).json({ error: 'Failed to create chat: ' + error.message });
    }
  } else {
    res.sendStatus(403);
  }
};




exports.getChat = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');
      const chat = await Chat.findOne({ id: req.params.id });
      if (!chat) {
        res.status(404).json({ error: 'Chat not found'});
      } else {
        res.send(chat);
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.sendStatus(403);
  }
};

exports.deleteChat = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');
      await Chat.deleteOne({ id: req.params.id });
      res.sendStatus(200);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token or Failed to delete chat' });
    }
  } else {
    res.sendStatus(403);
  }
};
exports.getChatMessages = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');
      
      // Populating 'messages.sender' with all fields except 'password'
      const chat = await Chat.findOne({ _id: req.params.id }).populate('messages.sender', '-password');
      console.log(Chat);
      if (!chat) {
        res.status(404).json({ error: 'Chat not found'+req.params.id });
      } else {
        // Changing the format of messages to match the provided example
        const messages = chat.messages.map(msg => {
          return {
            id: msg._id, // Using MongoDB's generated id for the message
            created: msg.created,
            sender: {
              username: msg.sender.username,
              displayName: msg.sender.displayName,
              profilePic: msg.sender.profilePic,
            },
            content: msg.content
          };
        });

        res.send(messages);
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid token'+error });
    }
  } else {
    res.sendStatus(403);
  }
};

exports.createChatMessage = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    try {
      const { userId } = jwt.verify(token, 'SECRET_KEY');

      // Fetch the user from the database
      const user = await User.findById(userId).select('-password');
      if (!user) throw new Error("User not found");

      const chat = await Chat.findOne({ _id: req.params.id });
      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
      } else {
        // Create a new message object
        const message = {
          sender: user,
          content: req.body.content,
          created: new Date() // set the creation date to current date
        };

        // Push the message to chat's messages array
        chat.messages.push(message);
        
        await chat.save();
        req.app.get('socketio').emit('message', message); 

        // Return only the added message instead of whole chat
        res.send(message);
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid token or Failed to create chat message' });
    }
  } else {
    res.sendStatus(403);
  }
};
