# Botframework-example: An intent-aware AI powered bot

This repository implements a clothing e-commerce chatbot assistant using Botframework NodeJS API and two approaches: a cloud-based machine learning framework LUIS.ai, and a custom Naive Bayes classifier. Examples are inspired on the book [Build Better Chatbots](http://a.co/1FB75o2) written by Rashid Khan. Source code was corrected on certain scenarios where features are deprecated in current API versions.

[Botframework](https://dev.botframework.com/) provides a simple-to-use interface through a NodeJS SDK, and REST APIs to be integrated by your chatbot application. In order to reduce some of the hassle of building intelligent bots. this example uses [LUIS.ai](https://www.luis.ai/), which is already integrated with Botframework, however, a custom ML model was also implemented to showcase diffenent solution approaches.

To run one of the examples, you will need a **Microsoft Live ID** to sign up for Botframework services. Botframework services are **free to use**, and you do not need to enter your credit card information.

### Chatbot features

* Intent-aware chatbot.
* Connection with external APIs for product information retrieval.
* Omnichannel communication framework, so you can plug-in your chatbot implementation on any messaging platform.
* Messaging logging storage for analytics.
* Chatbot implementation examples using a both a cloud-based ML service and a custom model.
* Support for english and spanish (**under construction**) audiences.

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

* Environment configuration must be set by modifying the [LuisChatbot/.env](LuisChatbot/.env) & [NaiveBayesChatbot/.env](NaiveBayesChatbot/.env) files. Here you can configure your bot based on a specific language (English or Spanish (under construction)).
* Go to [LUIS.ai](https://www.luis.ai/) and create an account.
* Create a new App and configure the corresponding intents & entities for your bot. Examples can be found in files [Bot_en.md](Bot_en.md) & [Bot_es.md](Bot_es.md).
* Train & Test your bot app under LUIS web environment.
* Publish your app and copy its ${ENDPOINT_URL}. It is defined as `/luis/v2.0/apps/${LUIS_APPLICATION_ID}?subscription-key=${LUIS_SUBSCRIPTION_KEY}&timezoneOffset=0&verbose=true&q=`. You should copy the application values and set the corresponding environment variables on the [LuisChatbot/.env](LuisChatbot/.env) file.
* Go to [Microsoft's BotFramework](https://dev.botframework.com/) and create your account.
* Create a new bot in the *My bots* section. It will redirect you to the Azure cloud Platform.
* Select Bot Channels Registration option.
* When Configuring your bot, you need to set the *Messaging endpoint* property to your chatbot public URL assigned by ngrok (see instructions below)
* Create and ${APPLICATION_iD} & ${APPLICATION_PASSWORD} in the Microsoft Application Registration Portal and set this properties both on your new bot configuration in Azure, and on the [LuisChatbot/.env](LuisChatbot/.env) & [NaiveBayesChatbot/.env](NaiveBayesChatbot/.env) files.

### Chatbot examples

In order to test your chatbot locally, you need to open a tunnel using ngrok. To do so, run the follwing command in another terminal:

```bash
~ $ ngrok http 3978
```

Then, enter to the web inspector [localhost:4040](localhost:4040) and copy the assigned HTTPS URL to the ${MESSAGING_ENDPOINT} property in the dev.botframework app you created.

Additionally, you need to deploy a mongodb instance, for example, in another terminal you can run the following:

```bash
~ $ mongod --dbpath ./db/
```

#### LUIS.ai powered chatbot

Intent-aware chatbot definition can be replicated using intents & entities definitons in [Bot_en.md](Bot_en.md). To run the example, run the following on a terminal:

```bash
~ $ cd LuisChatbot
~ $ node app.js
```

Now You can test some interactions using the *Test in Web Chat* option in your Microsoft Botframework instance.

#### Chatbot with custom Naive Bayes intent classifier

To run the example, you first need to train your model by running the following command:

```bash
~ $ cd NaiveBayesChatbot
~ $ node app.js
```

Model will be saved on the `classifier.json` file. To deploy your model, just re-run the `node app.js` command.


