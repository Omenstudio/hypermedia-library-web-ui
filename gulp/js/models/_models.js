var Models = [
    Article,
    Book,
    Author,
    Publisher
];


function getModelPos(modelToFind) {
    for (var i=0, model = Models[i]; i<Models.length; ++i, model = Models[i]) {
        if (model == modelToFind) {
            return i;
        }
    }
    return -1;
}