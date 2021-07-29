let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )

    return newData;
}

const socketServer = (socket) => {

    // Connect - Disconnect
    socket.on('joinUser', user => {
        users.push({id: user._id, socketId: socket.id, followers: user.followers})
    })

    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id)

        if(data) {
            const clients = users.filter(user => 
                data.followers.find(item => item._id === user.id)
            )

            if(clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
                })
            }

            if(data.call) {
                const callUser = users.find(user => user.id === data.call)
                if(callUser) {
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect', )
                }
            }
        }
        users = users.filter(user => user.socketId !== socket.id)
    })

    // Likes
    socket.on('likePost', newPost => {
        const ids = [...newPost.postBy.followers, newPost.postBy._id, ...users]
        const clients = users.filter(user => ids.includes(user.id))
       
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        } 
    })

    // Unlikes
    socket.on('unLikePost', newPost => {
        const ids = [...newPost.postBy.followers, newPost.postBy._id, users]
        const clients = users.filter(user => ids.includes(user.id))
       
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        } 
    })

    // Comments
    socket.on('createComment', newPost => {
        const ids = [...newPost.postBy.followers, newPost.postBy._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    // Delete Comments
    socket.on('deleteComment', newPost => {
        const ids = [...newPost.postBy.followers, newPost.postBy._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow user
    socket.on('FollowUser', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    // Unollow user
    socket.on('UnfollowUser', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unfollowToClient', newUser)
    })

    // Create Notify
    socket.on('createNoyify', notify => {
        const client = users.find(user => notify.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('createNoyifyToClient', notify)
    })

    // Remove Notify
    socket.on('removeNoyify', notify => {
        const client = users.find(user => notify.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNoyifyToClient', notify)
    })

    // Add Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })


    // Check User Online / Offline
    socket.on('checkUserOnline', data => {

        const following = users.filter(user => data.following.find(item => item._id === user.id))
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user => data.followers.find(item => item._id === user.id))
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
    })


    // Call
    socket.on('callUser', data => {
        users = EditData(users, data.sender, data.recipient)
        const client = users.find(user => user.id === data.recipient)
        
        if(client) {
            if(client.call) {
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            } else {
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })


    // End Call
    socket.on('endCall', data => {

        const client = users.find(user => user.id === data.sender)
        
        if(client) {
            socket.to(`${client.socketId}`).emit('endCallToClient', data)

            if(client.call) {
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${ clientCall.socketId}`).emit('endCallToClient', data)
            }
        }

        users = EditData(users, data.sender, null)
        users = EditData(users, data.recipient, null)
    })

 


}

module.exports = socketServer;