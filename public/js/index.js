var socket = io();

socket.on('connect', function(){
console.log('connected to server');


})

socket.on('disconnect',function(){
console.log('Disconnected from the server');
})



//event listening for the test sockets
socket.on('newMessage', function(msg){
	var formattedTime = moment(msg.createdAt).format('h:mm a');
	console.log(formattedTime);

var template = jQuery('#message-template').html();
var html = Mustache.render(template, {
		text : msg.text,
		from : msg.from,
		createdAt : formattedTime
	});
	
	

	// var  li = jQuery('<li></li>');
	// li.text(`${msg.from} ${formattedTime}: ${msg.text} `);
	jQuery('#messages').append(html);
})
//event listening for the location sending sockets

socket.on('newLocMsg', function(locMsg){
	var formattedTime = moment(locMsg.createdAt).format('h:mm a');
	console.log(locMsg.url);

var template = jQuery('#message-location-template').html();
var html=Mustache.render(template, {
	from :locMsg.from,
	url: locMsg.url,
	createdAt:formattedTime

})
	jQuery("#messages").append(html);
	// var li = jQuery('<li></li>').text(`${locMsg.from} ${formattedTime}:`);;
	// var a =jQuery('<a target=_blank> My current location </a>').attr('href', locMsg.url);;

	// li.append(a);

})

//event emiting from the client side for the text

jQuery("#message-form").on('submit', function(e){
	e.preventDefault();
	var msgTextBox = jQuery('[name=message]');

	socket.emit('createMsg', {
		from : 'User:',
		text : msgTextBox.val()
	}, function(){

		msgTextBox.val('');

	});

})

//event emiting for the location from the form and clicking events
var locationB = jQuery('#send-location');

locationB.on('click', function(){
	if(!navigator.geolocation){
		return alert('Geolocation API not found');
	}
	navigator.geolocation.getCurrentPosition(function(position){
		console.log(position);
		socket.emit('createLocationMsg', {
			latitude : position.coords.latitude,
			longitude : position.coords.longitude
		})

	}, function(){
		alert('Unable to fetcch the location')
	})
})