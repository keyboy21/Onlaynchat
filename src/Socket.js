const socketio = require('socket.io');
const randomColor = require('../helper/randomColor');
const io = socketio();

const SocketApi = {}
SocketApi.io = io
const users = {}

// Connection
io.on("connection", (socket) => {
    // console.log("User online");

    socket.on('newUser', (data) => {
        // console.log(data);
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },

            color: randomColor()
        };

        const userData = Object.assign(data, defaultData)
        users[socket.id] = userData


        socket.broadcast.emit('newuser', users[socket.id])
        socket.emit('initPlayer', users)


        socket.on('disconnect', () => {
            socket.broadcast.emit('userdis', users[socket.id])
            delete users[socket.id]

        })


        socket.on('position', data => {
            users[socket.id].position.x = data.x
            users[socket.id].position.y = data.y

            socket.broadcast.emit('animate', {
                socketID: socket.id,
                x: data.x,
                y: data.y

            })

        })

        socket.on('newMessage', data => {
            socket.broadcast.emit('newmessage', data)

        })

    })


})


module.exports = SocketApi