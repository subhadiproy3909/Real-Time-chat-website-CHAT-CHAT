require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

const { notFound, errorHandler } = require('./middlewares/errorHandlers');
const chats = require('./data/data');
const connectdb = require('./database/db/dbconn');
const userRoutes = require('./routes/uesrRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectdb();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
    res.send();
})

app.use('/api', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', require('./routes/messageRoutes'));

app.use(notFound);
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log("Server started on port :", PORT);
});

const io = require('socket.io')(server, {
    pignTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket");
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on('typing', (room) =>{
        socket.in(room).emit("typing");
    })

    socket.on('stop typing', (room) =>{
        socket.in(room).emit("stop typing");
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user == newMessageRecieved.sender._id) return;

            // console.log(user, " ", newMessageRecieved.sender._id);
            socket.in(user).emit("message recieved", newMessageRecieved);
        });
    });
});