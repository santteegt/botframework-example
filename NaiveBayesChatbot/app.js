var mlModel = require('./classifier');

function trainModel() {
    var myClassifier = mlModel.getNewClassifier();
    mlModel.addTraining(myClassifier, "Hello! How are you?", "greeting");
    mlModel.addTraining(myClassifier, "Hi", "greeting");
    mlModel.addTraining(myClassifier, "Hey", "greeting");
    mlModel.addTraining(myClassifier, "What's up", "greeting");
    mlModel.addTraining(myClassifier, "How are you?", "greeting");
    mlModel.addTraining(myClassifier, "I want to buy a shirt", "buy-shirt");
    mlModel.addTraining(myClassifier, "I am looking for shirts", "buy-shirt");
    mlModel.addTraining(myClassifier, "Do you have any shirts?", "buy-shirt");
    mlModel.addTraining(myClassifier, "Help", "help");
    mlModel.addTraining(myClassifier, "Main Menu", "help");
    mlModel.saveClassifier(myClassifier, 'classifier.json');
}

function loadModel() {
    return new Promise(function(resolve, reject){
        mlModel.loadClassifier('classifier.json').then((classifier) => {
            console.log('Classifier Loaded');
            mlModel.train(classifier).then(() => {
                console.log('Model is trained');
                console.log(`Hey!: ${mlModel.predict(classifier,"Hey")}`);
                console.log(`I'm looking for t-shirts!: ${mlModel.predict(classifier,"I'm looking for t-shirts!")}`);
                console.log(`Do you have shirts?: ${mlModel.predict(classifier,"I need help looking for shirts")}`);
                return resolve();
            });
        }, (error) => {
            console.log ('Could not load the Model');
            return reject('no_train');
        });
    });
}

loadModel().then(() => {
   console.log ('Finished Execution');
}, (error) => {
    if(error == 'no_train') {
        trainModel();
        console.log('model has been created');
    } else {
        console.log ('Error with Execution');
    }
});