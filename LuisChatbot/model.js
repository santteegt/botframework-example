var mongoose = require ('mongoose');

var schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/buildbetterchatbots', { useNewUrlParser: true });

var BOT_NAME = 'shop_assistant';
var messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    createdTime: Date,
    source: String,
    payloadObject: schema.Types.Mixed
});

var messageModel = mongoose.model ('Messages', messageSchema);

function saveSentMessage (payload) {
    var sentMessage = new messageModel({
        from: BOT_NAME,
        to: payload.address.user.id,
        createdTime: new Date(),
        source: payload.source,
        payloadObject: payload
    });
    sentMessage.save((err) =>{
        if (err) {
            console.log (`Error saving message: Message to ${payload.user.id}`);
        } else {
            console.log (`Message saved successfully`);
		}
	});
}

function saveIncomingMessage (payload) {
    var incomingMessage = new messageModel ({
        from: payload.address.user.id,
        to: BOT_NAME,
        createdTime: new Date(),
        source: payload.source,
        payloadObject: payload
    });
    incomingMessage.save(function (err) {
        if (err) {
            console.log (`Error saving message: Message from ${payloaod.user.id}`);
        } else {
            console.log (`Message saved successfully`);
		} 
	});
}

module.exports = {
    saveSentMessage: saveSentMessage,
    saveIncomingMessage: saveIncomingMessage
};