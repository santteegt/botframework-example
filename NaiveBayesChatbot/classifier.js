var natural = require('natural');

function getNewClassifier() {
    return new natural.BayesClassifier();
}

function loadClassifier(sourceFile) {
    return new Promise ((resolve, reject) => {
        natural.BayesClassifier.load(sourceFile, null, (err, loadedClassifier) => {
            if (loadedClassifier) {
                return resolve(loadedClassifier);
            } else {
                reject (err);
			} 
		});
	}); 
}

function saveClassifier(classifier, destinationFile) {
    return new Promise((resolve, reject) => {
        classifier.save(destinationFile, null, (err, savedClassifier) => {
           if (savedClassifier) {
               return resolve(savedClassifier);
           } else {
               return reject(err);
			} 
		});
	});
}

function addTraining(classifier, utterance, label) {
    classifier.addDocument(utterance, label);
}

function train(classifier) {
    return new Promise((resolve) => {
        classifier.train();
        return resolve();
    });
}

function predict(classifier, utterance) {
    return JSON.stringify(classifier.classify(utterance));
}

module.exports = {
    loadClassifier: loadClassifier,
    saveClassifier: saveClassifier,
    addTraining: addTraining,
    predict: predict,
    train: train,
    getNewClassifier: getNewClassifier
};