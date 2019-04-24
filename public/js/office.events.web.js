function OfficeEvents(config){
	this.config = config;
	const user = JSON.stringify(config.currentUser);
	this.socketIo = io.connect(config.domain, {
      	query: `user=${user}&room=${config.currentRoom}`
    }); 
}

OfficeEvents.prototype.listenEvent = function(event,callback){
	this.socketIo.on(event, (userInRoom) => {
		callback(userInRoom.user,userInRoom.room);
	});
}

OfficeEvents.prototype.enterInRoom = function(roomId){
	this.socketIo.emit('enter-room', { room:roomId, user: this.config.currentUser });	
}

OfficeEvents.prototype.startMeet = function(){
	this.socketIo.emit('start-meet',this.config.currentUser.id);
}

OfficeEvents.prototype.leftMeet = function(){
	this.socketIo.emit('left-meet',this.config.currentUser.id);
}

OfficeEvents.prototype.callUserForMyRoom = function(userId,roomId){
	this.socketIo.emit('get-user-to-room', { room:roomId, user: userId});	
}

OfficeEvents.prototype.onParticipantJoined = function(callback){
	this.listenEvent('enter-room', callback);
}

OfficeEvents.prototype.onParticipantStartedMeet = function(callback){
	this.listenEvent('start-meet', callback);
}

OfficeEvents.prototype.onParticipantLeftMeet = function(callback){
	this.listenEvent('left-meet', callback);
}

OfficeEvents.prototype.onSyncOffice = function(callback){
	this.socketIo.on('sync-office', (usersInRoom) => {
		callback(usersInRoom);
	});
}

OfficeEvents.prototype.onParticipantIsCalled = function(callback){
	listenEvent('get-user-to-room', callback);
}

OfficeEvents.prototype.onDisconnect = function(callback){
	this.socketIo.on('disconnect', (userId) => {
		callback(userId);
	});
}

