const path = require('path');
const express = require ('express');
const http = require('http');
const socketIO = require('socket.io');

var {generateMsg, generateLocMsg} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT||3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
	console.log('new user connected');

	socket.on('disconnect', ()=>{
		console.log('User disconected');
	})

	//emiting a msg for welcoming users to the app
		socket.emit('newMessage', generateMsg('Admin', 'Welcome to the Sosiot App'));
	//broadcasting of msg	
		socket.broadcast.emit('newMessage', generateMsg('Admin', 'New user Connected'));
	//listening to the text event then emiting it to the client again
		socket.on('createMsg', (msg,callback)=>{
		io.emit('newMessage', generateMsg(msg.from, msg.text));
		callback();
	})
	//listening to the location event and emitting to the client again
		socket.on('createLocationMsg', (loc)=>{
		io.emit('newLocMsg', generateLocMsg('admin', loc.latitude,loc.longitude ));

})
	
// 	socket.on('createEmail', (email)=>{
// 		console.log('New email created',JSON.stringify(email, undefined, 2));
// 	})
// socket.emit('newEmail', {
// 	from : "Steve@kory.com",
// 	location : "Kakamega"
// });ocmmmsg
})



server.listen(3000, ()=>{
	console.log(`App starting in port ${port}`);
})