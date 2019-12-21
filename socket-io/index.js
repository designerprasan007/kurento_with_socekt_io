let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var phpServer = require('node-php-server')

users = [];
connections = [];

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


http.listen(3000, () => {
	console.log('listenig on port https://178.128.5.79:3000')
});


io.sockets.on('connection',(socket) => {
	connections.push(socket);
	console.log('connected: %s connected successfully', connections.length);
	

	socket.on('disconnect', (data) => {
		// if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('disconnected :%s disconnected successfully', connections.length)
	});


	socket.on('send message', (data) => {
		// console.log(data);
		io.sockets.emit('new message', {text:data})
	});
	socket.on('new user', (data, callback) => {
		// console.log(data);
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
		// io.sockets.emit('new user', {name:data})
	});
	function updateUsernames(){
		io.sockets.emit('get users', users)
	}
});