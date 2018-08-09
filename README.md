# botframework-example: An intent-aware AI powered bot

[Botframework](https://dev.botframework.com/) provides a simple-to-use interface through a NodeJS SDK, and REST APIs to be integrated by your chatbot application. In order to reduce some of the hassle of building intelligent bots. this example uses [LUIS.ai](https://www.luis.ai/), which is already integrated with Botframework.

To run one of the examples, you will need a **Microsoft Live ID** to sign up for Botframework services. Botframework services are **free to use**, and you do not need to enter your credit card information.

### Installation requirements

* NodeJS
* MongoDB
* [ngrok](https://ngrok.com/): public URL for testing your chatbot locally. You need to create an account

#### Configuring ngrok

* In case you did not configured yet, open a terminal & run the following commands:

```bash
~ $ npm install -g ngrok
~ $ ngrok authtoken <YOUR_NGROK_TOKEN>
```

#### Project installation

1. Clone this repo
1. Open a terminal and run the following commands:

```bash
~ $ cd <REPO_DIR>
~ $ npm install
```

### Project Setup

* Go to [LUIS.ai](https://www.luis.ai/) and create your account.
* Create a new App and register the corresponding intents & entities. Examples can be found in files [Bot_en.md](Bot_en.md) & [Bot_es.md](Bot_es.md).
* Train & Test your bot app.
* Publish your app and copy its ${ENDPOINT_URL}
* Go to [Microsoft's BotFramework](https://dev.botframework.com/) and create your account.
* Create a new bot in the *My bots* section. It will redirect you to the Azure cloud Platform.
* Select Bot Channels Registration option.
* When Configuring your bot, you need to set the *Messaging endpoint* property to your chatbot public URL assigned by ngrok (see instructions below)
* Create and AppID & password in the Microsoft Application Registration Portal and set this properties on your new bot configuration.

### Chatbot examples

In order to test your chatbot locally, you need to open a tunnel using ngrok. To do so, run the follwing command in another terminal:

```bash
~ $ ngrok http 3978
```

Then, enter to the web inspector [localhost:4040](localhost:4040) and copy the assigned HTTPS URL to the ${MESSAGING_ENDPOINT} property in the Botframework app you created.

#### LUIS.ai powered chatbot

Intent-aware chatbot definition can be replicated using intents & entities definitons in [Bot_en.md](Bot_en.md). To run the example, run the following on a terminal:

```bash
~ $ cd LuisChatbot
~ $ node app.js
```

Now You can test some interactions using the *Test in Web Chat* option in your Microsoft Botframework instance.

#### Chatbot with custom Naive Bayes intent classifier



