require('dotenv').config()
var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var search  = require('./search');
var model = require('./model');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

if(process.env.BOT_LANG == '') {
    console.warn('Language not set. See .env file');
    process.exit(-1);
}

const BOT_LANG = process.env.BOT_LANG;

if(process.env['APPLICATION_ID_' + BOT_LANG] == '' || 
    process.env['APPLICATION_PASSWORD_' + BOT_LANG] == '' ||
    process.env['LUIS_APPLICATION_ID_' + BOT_LANG] == '' || process.env.LUIS_SUBSCRIPTION_KEY == '') {

    console.warn('Environment variables are not properly set. See .env file');
    process.exit(-1);
}

// Create chat connector for communicating with the Bot Framework Service
var APPLICATION_ID = process.env['APPLICATION_ID_' + BOT_LANG];
var APPLICATION_PASSWORD = process.env['APPLICATION_PASSWORD_' + BOT_LANG];
var LUIS_APPLICATION_ID = process.env['LUIS_APPLICATION_ID_' + BOT_LANG];
var LUIS_SUBSCRIPTION_KEY = process.env.LUIS_SUBSCRIPTION_KEY;
LUIS_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/'+ LUIS_APPLICATION_ID;

function getIntentFromLuis(text, callback) {
    request.get({
        url: LUIS_URL,
        qs: {
	        'subscription-key': LUIS_SUBSCRIPTION_KEY,
	        'timezoneOffset':0,
	        'verbose':true,
	        'q': text
		},
        json: true
    }, (error, response, data) => {
        console.log(response);
        if(error) {
            callback(error);
        } else {
        	callback(null, data);
        }
	});
}


var connector = new builder.ChatConnector({
    appId: APPLICATION_ID,
    appPassword: APPLICATION_PASSWORD
});
var inMemoryStorage = new builder.MemoryBotStorage();

// Listen for messages from users
const API_URL = '/api/messages/' + BOT_LANG.toLowerCase();
console.log('API_URL: ', API_URL);

server.post(API_URL, connector.listen());
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, (session, args, next) => {

    // session.send("You said: %s", session.message.text);
    getIntentFromLuis(session.message.text, (error, luisData) => {
    	var intent = luisData.topScoringIntent.intent;
    	var score = luisData.topScoringIntent.score;
    	var entities = luisData.entities;
    	if (score > 0.3 && intent != 'None') {
	        if(intent == 'product lookup') {

	        	if(entities.length > 0) {
		            // session.send("Sure I will show you all the products!");
		            var products = [];
	                for (var productIterator in entities) {
	                        products.push(entities[productIterator].entity);
	                }
	                var message = "Sure I will show you " + products.join(', ');
	                session.send(message);

	                session.conversationData.products = products;
					session.save();

	                search.searchByProduct(products, (error, productResult) => {
    	    			sendProductInformation(session, productResult);
    	    			if (session.message.source == 'facebook') {
    	    				sendColorSuggestionFB(session, productResult);
    	    			} else {
    	    				sendColorSuggestion(session, productResult);
    	    			}
			      	});
	            } else {
	                session.send("Sure I will show you all the products!");
	                search.showAllProducts(products, (error, productResult) => {
					    sendProductInformation(session, productResult);
					});
	            }
	        } else if(intent == 'location lookup') {
	            // session.send("We have 10 stores across the country");
	            // considering only first location
                if (entities.length > 0) {
                	// var location = entities[0].entity;
                	let cities = [];
                	for (var locationIterator = 0; locationIterator < entities.length;++locationIterator) {
			            var entityObject = entities[locationIterator];
			            // session.send(entityObject.type);
			            if (entityObject.type == 'Places.AbsoluteLocation') {
			                cities.push(entityObject.entity);
			            }
					}
					if(cities.length > 0) {
						session.send("Let me look that for you");
						sendStoreList(session, cities);	
					} else {
						sendCitySuggestions(session);
					}
                } else {
                    // session.send("We have 50 stores across the country.");
                    sendCitySuggestions(session);
                }
	        } else if (intent == 'greetings') {
				session.send("Hi! I can help you find products and locate our stores. What would you like me to do?");
			} else if (intent == 'color filter') {
			    var colors = [];
			    for (var colorIterator in entities) {
			        if (entities[colorIterator].type == 'color') {
			           colors.push(entities[colorIterator].entity);
					} 
				}
			    var productsFromContext = session.conversationData.products;
			    session.send("Sure I will show you " +
			        productsFromContext.join(', ') +
			        ' in ' +
			        colors.join(' '));
			    search.searchByProductFilterByColor(
			        productsFromContext,
			        colors,
			        function (error, productResult) {
			            sendProductInformation(session, productResult);
			        }
				); 
			} else {
                session.send("I did not understand you. I am still learning! Can you rephrase?");    
            }
	    } else {
    		session.send("I did not understand you. I am still learning! Can you rephrase?");
		}
    });
}).set('storage', inMemoryStorage);

bot.on('incoming', (data) => {
        model.saveIncomingMessage(data);
        console.log ('—incoming message-');
});

bot.on('outgoing', (data) => {
        model.saveSentMessage(data);
        console.log ('—outgoing message-');
});


//This function sends the user information about the products in carousels
function sendProductInformation(session, products) {
    // Create a message object
    var message = new builder.Message(session);
    message.attachmentLayout(builder.AttachmentLayout.carousel);
    var cards = [];
    // For each product create a carousel element
    for (var productIterator = 0; productIterator < products.length;++productIterator) {
        var product = products[productIterator];
        // Create a carousel element (Knows as HeroCard in Botframework)
        var heroCard = new builder.HeroCard(session);
        // Add product name as the carousel title
        heroCard.title(product.product_name);
        // Add the product brand as the carousel subtitle
        heroCard.subtitle(product.brand);
        // Use the carousel text element for showing price
        heroCard.text("Price is " + product.price);
        // Add product image to the carousel by creating CardImage Object with the image URL
        heroCard.images([builder.CardImage.create(session, product.image)]);
        heroCard.buttons([builder.CardAction.imBack(session, "i want to buy " + product.category, "Buy")]);
        cards.push(heroCard);
    }
    message.attachments(cards);
    session.send(message);
}

function sendColorSuggestion(session, products) {
    var colors = [];
    for (var productIterator = 0; productIterator < products.length; ++productIterator) {
        var product = products[productIterator];
        if (colors.indexOf(color) == -1) {
            colors.push(product.color);
        }
	}
    var message = new builder.Message(session);
    message.attachmentLayout(builder.AttachmentLayout.carousel);
    var heroCard = new builder.HeroCard(session);
    var buttons = [];
	for (var colorIteraror = 0; colorIteraror < colors.length; ++colorIteraror) { 
		var color = colors[colorIteraror];
        // To make sure the buttons are not duplicated
        var button_text = "Do you have this in " + color;
        var button = builder.CardAction.imBack(session, button_text, color);
        buttons.push(button);
    }
    heroCard.title('Here are some colors I suggest.');
    heroCard.buttons(buttons);
    message.attachments([heroCard]);
    session.send(message);
}

function sendColorSuggestionFB(session, products){ 
    var colors = [];
    for (var productIterator = 0; productIterator < products.length; ++productIterator) {
        var product = products[productIterator];
        colors.push(product.color);
    }
    var message = new builder.Message(session);
    var quicReplies = [];
    // Limit the maximum number of quick replies to 10 (10 is the limit set by messenger
    for (var colorIteraror = 0; colorIteraror < 10 && colorIterator < colors.length; ++colorIteraror) {
        var color = colors[colorIteraror];
        var quickReply = {
            "content_type":"text",
            "title": color,
            "payload":"do you have this in " + color
        }
        quicReplies.push(quickReply)
	}
    message.sourceEvent({
        facebook: {
            text: 'Here are some colors I suggest.',
            quick_replies: quicReplies
        }
	});
    session.send(message);
}

function sendStoreList(session, cities) {
    var message = new builder.Message(session);
    message.attachmentLayout(builder.AttachmentLayout.carousel);
    var cards = [];
    search.searchStoreByCity(cities, function(err, stores) {
        if (stores.length > 0){
            session.send('Sure we have got stores in '+ cities.join(', '));
            for (var storeIterator=0; storeIterator < stores.length;++storeIterator) {
                var store = stores[storeIterator];
                var heroCard = new builder.HeroCard(session);
                heroCard.title(store.city);
                heroCard.text(store.street);
                cards.push(heroCard);
            }
            message.attachments(cards);
            session.send(message);
        }else{
            session.send('Sorry we do not have any stores in '+ cities.
            join(', '));
		}
	});
}

function sendCitySuggestions(session) {
    session.send('No city found in your query to look up our stores! But these are the cities where our stores are most popular.');
    var cityList = [
        "London",
        "Bangkok",
        "Singapore",
        "New York",
        "Kuala Lumpur",
        "Hong Kong",
        "Dubai"
	];	
    var message = new builder.Message(session);
    message.attachmentLayout(builder.AttachmentLayout.carousel);
    var heroCard = new builder.HeroCard(session);
    var buttons = [];
    for (var cityIterator = 0; cityIterator < cityList.length; ++cityIterator) {
        var city = cityList[cityIterator];
        // To make sure the buttons are not duplicated
        var button_text = "Do you have stores in " + city + '?';
        var button = builder.CardAction.imBack(session, button_text, city);
        buttons.push(button);
    }
    heroCard.title('Cities');
    heroCard.buttons(buttons);
    message.attachments([heroCard]);
    session.send(message);
}

