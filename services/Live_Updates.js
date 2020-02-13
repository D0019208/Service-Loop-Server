class Live_Updates {
    constructor(server, app) {
        this.socket = require('socket.io').listen(server);
        this.socket.set("origins", "*:*");


        //server = require('http').Server(app);
        //this.socket = require('socket.io')(server); 
        //server.listen(80);

        this.users_connected = [];
    }

    connect() {
        this.socket.on('connection', (socket) => {
            if (!this.users_connected.filter((e) => { return e.email === socket.handshake.query.email; }).length > 0) {
                this.users_connected.push({ socket_id: socket.id, email: socket.handshake.query.email, modules: JSON.parse(socket.handshake.query.modules) });
            } else {

                for (let i = 0; i < this.users_connected.length; i++) {
                    if (socket.handshake.query.email === this.users_connected[i].email) {
                        this.users_connected[i].socket_id = socket.id;
                        this.users_connected[i].modules = JSON.parse(socket.handshake.query.modules);
                    }
                }
            }
            socket.emit('news', { hello: 'connected', users: this.users_connected });

            socket.on('send_notification', (data) => {
                this.send_notification(socket, data)
            });

            socket.on('new_tutorial', (data) => {
                this.send_tutorial(socket, data)
            });

            socket.on('tutorial_request_accepted', (data) => {
                this.sendTutorialAcceptedNotification(socket, data);
            });

            socket.on('agreement_rejected', (data) => {
                this.sendAgreementRejectedNotification(socket, data);
            });

            //Update the socket once a user becomes a tutor (add modules)
            socket.on('update_socket', (data) => {
                for (let i = 0; i < this.users_connected.length; i++) {
                    if (this.users_connected[i].email === data.user_email) {
                        this.users_connected[i].modules = data.user_modules;
                    }
                }
            });

            // socket.on('disconnect', (reason) => {
            //   socket.emit('news', { hello: reason});

            //   for(let i = 0; i < users_connected.length; i++) {
            //     if(users_connected[i])
            //   }
            //   if (users_connected.filter(function (e) { return e.email === socket.handshake.query.email; }).length > 0) {
            //     users_connected.remove('seven');
            //   } 
            // });
        });
    }

    send_notification(socket, data) {
        let elegible_users = [];
        console.log(data);
        for (let i = 0; i < this.users_connected.length; i++) {
            //some(..) checks each element of the array against a test function and returns true if any element of the array passes the test function, otherwise, it returns false. 
            //indexOf(..) >= 0 and includes(..) both return true if the given argument is present in the array.
            console.log(this.users_connected[i].modules);

            for (let j = 0; j < this.users_connected[i].modules.length; j++) {
                if (this.users_connected[i].modules[j] === data.notification_modules[0]) {
                    elegible_users.push(this.users_connected[i]);
                }
            }
        }

        console.log("Elegible users");
        console.log(elegible_users);

        for (let i = 0; i < elegible_users.length; i++) {
            //socket.emit('news', { hello: elegible_users, socket_id: elegible_users[i].socket_id });
            socket.to(elegible_users[i].socket_id).emit("new_notification", { response: data });
        }

        //socket.emit('news', { hello: elegible_users });
    }

    send_tutorial(socket, data) {
        let elegible_users = [];
        console.log(data);
        for (let i = 0; i < this.users_connected.length; i++) {
            for (let j = 0; j < this.users_connected[i].modules.length; j++) {
                if (this.users_connected[i].modules[j] === data.response[0].post_modules[0]) {
                    elegible_users.push(this.users_connected[i]);
                }
            }
        }

        for (let i = 0; i < elegible_users.length; i++) {
            //socket.emit('news', { hello: elegible_users, socket_id: elegible_users[i].socket_id });
            socket.to(elegible_users[i].socket_id).emit("new_tutorial_request", { response: data.response[0] });
        }
    }

    sendTutorialAcceptedNotification(socket, data) {
        console.log("Unique 2")
        console.log(this.users_connected)
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_notification.response.std_email) {
                console.log("work")
                socket.to(this.users_connected[i].socket_id).emit("add_tutorial_request_accepted_notification", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }

    sendAgreementRejectedNotification(socket, data) {
        console.log("Rejected")
        console.log(this.users_connected)
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_post.post_tutor_email) {
                console.log("Send rejected")
                socket.to(this.users_connected[i].socket_id).emit("agreement_rejected_tutor", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }
}

module.exports = Live_Updates;