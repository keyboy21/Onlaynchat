
app.controller("indexController", ["$scope", 'indexFactory', "configFactory", ($scope, indexFactory, configFactory) => {

    $scope.messages = []
    $scope.players = {}

    function scroll() {
        setTimeout(() => {
            const a = document.querySelector("#chat-area");
            a.scrollTop = a.scrollHeight
        })

    }


    $scope.init = () => {
        const username = prompt('Please fill your name')
        if (username) {
            initSocket(username)

        }
        else {
            return false
        }
    }

    async function initSocket(username) {
        const connectionOptions = {
            reconnectionAttemps: 3,
            reconnectionDelay: 600,
        }

        const socketUrl = await configFactory.getConfig()
        console.log(socketUrl.data.socketUrl);

        indexFactory.connectsocket(socketUrl.data.socketUrl, { connectionOptions })

            .then((socket) => {
                // console.log('Connect succesfuly', socket); 
                socket.emit('newUser', { username })

                socket.on('initPlayer', (players) => {
                    $scope.players = players
                    $scope.$apply();

                })

                socket.on('newuser', (data) => {
                    // console.log(data);
                    const messageData = {
                        type: {
                            code: 0,
                            message: 1
                        },
                        username: data.username
                    }
                    $scope.messages.push(messageData)
                    $scope.players[data.id] = data
                    $scope.$apply();
                })

                socket.on('userdis', (users) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 0
                        },
                        username: users.username
                    }
                    $scope.messages.push(messageData)
                    delete $scope.players[users.id]
                    $scope.$apply();


                })

                socket.on('animate', data => {
                    $('#' + data.socketID).animate({ 'left': data.x, 'top': data.y }, () => {
                        animate = false
                    })
                })
                //  

                socket.on('newmessage', message => {
                    $scope.messages.push(message)
                    $scope.$apply()
                })

                // CLick ball
                let animate = false
                $scope.onClickPlayer = ($event) => {
                    if (!animate) {

                        let x = $event.offsetX
                        let y = $event.offsetY

                        socket.emit('position', { x, y });

                        animate = true
                        $('#' + socket.id).animate({ 'left': x, 'top': y }, () => {
                            animate = false
                        })
                    }

                    // console.log($event.offsetX, $event.offsetY);
                }

                $scope.newMessage = () => {
                    let message = $scope.message
                    const messageData = {
                        type: {
                            code: 1,
                        },
                        username: username,
                        text: message
                    }
                    $scope.messages.push(messageData)
                    $scope.message = '';
                    scroll()
                    socket.emit('newMessage', messageData)




                }


            }).catch((err) => {
                console.log(err)
            })



    }

}])