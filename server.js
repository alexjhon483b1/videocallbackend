const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser');
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://hw3952877:thisismyhutum@cluster0.tvzq0fp.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose model
const DataModel = mongoose.model("Data", {
  ip: String, // Adjust this based on the structure of your data
});

app.get('/api/users', async(req, res) => {
  const users = await DataModel.find();
// Send the data as JSON
    res.json(users);
});

app.get('/', async(req, res) => {
      res.sendFile('test.html', { root: __dirname });
  });
app.get('/data', async(req, res) => {
    res.sendFile('fetch.html', { root: __dirname });
}); 
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/delete', async (req, res) => {
    console.log(req.body)
    const { ip } = req.body;
    try {
    const deletedUser = await DataModel.findOneAndDelete({ ip });
    if (!deletedUser) {
    console.log('No user found with the given first name.');
    return res.status(404).json({ message: 'No user found with the given first name.' });
    }
    console.log('User deleted successfully:', deletedUser);
    res.redirect('/data');
    } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
    }
})

server.listen(process.env.PORT || 3345, () => {
  console.log("server running");
});

io.on("connection", (socket) => {
  socket.on("IP2", (data) => {
    console.log(data);

    // Save data to MongoDB
    const newData = new DataModel({ ip: data });
    newData.save()
      .then(() => {
        console.log("Data saved to MongoDB");
        io.emit('liveresponse', data);
      })
      .catch((error) => {
        console.error("Error saving data to MongoDB:", error);
      });
  });
});
