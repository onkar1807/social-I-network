require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const SocketServer = require('./socketServer');
const { ExpressPeerServer } = require('peer');
const path = require('path');


// Database connection
const url = process.env.MONGO_URI
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected');
}).catch(err => console.log(err))


// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    SocketServer(socket)
})


// Peer Server
ExpressPeerServer(http, { path: '/' })

// Route middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// Listening port
const PORT = process.env.PORT
http.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));



// https://i-network-onkar.herokuapp.com/