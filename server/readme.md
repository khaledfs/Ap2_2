change this line in server.js:
mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully!");
});
change this url mongodb://localhost:27017/chatapp according to your mongodb
open terminal in server directory

npm install 
node server.js
