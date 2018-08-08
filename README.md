# botframework-example
Chatbot example using botframework

[Botframework](https://dev.botframework.com/) provides a simple-to-use interface through a NodeJS SDK, and REST APIs to be integrated by your chatbot application. In order to reduce some of the hassle of building intelligent bots. this example uses [LUIS.ai](https://www.luis.ai/), which is already integrated with Botframework.

To run this example, you will need a **Microsoft Live ID** to sign up for Botframework services. Botframework services are **free to use**, and you do not need to enter your credit card information.

### Installation requirements

* NodeJS
* MongoDB

### Setup instructions

* Go to [LUIS.ai](https://www.luis.ai/) and create your account.
* Create a new App and register the corresponding intents & entities. Examples can be found in files [Bot_en.md](Bot_en.md) & [Bot_es.md](Bot_es.md).
* Train & Test your bot app.
* Publish your app and copy its ${ENDPOINT_URL}
* Go to [Microsoft's BotFramework](https://dev.botframework.com/) and create your account.
* Create a new bot in the *My bots* section. It will redirect you to the Azure cloud Platform.
* Select Bot Channels Registration option.
* When Configuring your bot, set the *Messaging endpoint* property to the ${ENDPOINT_URL}
* Create and AppID & password in the Microsoft Application Registration Portal and set this properties on your new bot configuration.

