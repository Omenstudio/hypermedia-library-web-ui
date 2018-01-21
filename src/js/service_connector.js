var ServiceConnector = {};
ServiceConnector.vocab = '';
ServiceConnector.collectionsMap = {}; // need to determine what's type of objects collection contains

ServiceConnector.loadEntryPointAndDoc = function (entryPointUrl) {
    var foundCollections = [];

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", entryPointUrl).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (ServiceConnector.vocab === '') {
            ServiceConnector.vocab = parseDocumentation(jqXHR);
        }

        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);

        // Parse entrypoint to link collections and urls
        foundCollections = ServiceConnector._parseEntryPoint(resource);
    });

    return foundCollections;
};


ServiceConnector._parseEntryPoint = function (resource) {
    // Iterate over given response
    // and try to find Entity collection
    // For instance, EntryPoint returned response:
    //      books: /api/books_list
    //      authors: /api/authors_management
    //      publishers: /api/publishers
    // We need to iterate over books, authors and publishers and
    // detect which type of Entity they contain
    // And additional checks if collection support GET operation
    var foundCollections = [];

    for (var entryPointPropertyKey in resource) {
        // skip if this is not regular field
        if (entryPointPropertyKey[0] === '@') {
            continue;
        }

        // Detect url, type, and collection item
        var entryPointProperty = resource[entryPointPropertyKey];
        var collectionUrl = entryPointProperty.__value.__value['@id'];
        var collectionType = ServiceConnector.vocab[entryPointProperty.__iri]['range']; // vocab:AuthorCollection
        var memberOf = ServiceConnector.vocab[collectionType]['member_of'];

        // Expect memberOf not null, elsewhere don't know what type collectioon contains
        if (typeof memberOf === 'undefined' || memberOf.trim().length === 0) {
            continue;
        }

        // Check if GET operation supported
        var getOperationSupported = false;
        if (collectionType in ServiceConnector.vocab) {
            var supportedOperations = ServiceConnector.vocab[collectionType].supportedOperations;
            for (var operationId in supportedOperations) {
                var operationMethod = supportedOperations[operationId].method;
                if (operationMethod.toLowerCase() === 'get') {
                    getOperationSupported = true;
                    break;
                }
            }
        }
        if (!getOperationSupported) {
            continue;
        }

        // Define collection found only if
        //  * we found type of the collection
        //  * collection supports GET operation
        foundCollections.push({itemId: memberOf, url: collectionUrl});
    }

    return foundCollections;
};


ServiceConnector.loadCollection = function (model, collectionUrl) {
    var items = [];

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", collectionUrl).done(function (resource, textStatus, jqXHR) {
        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);

        if (resource !== null) {
            var membersArray = resource.members.__value;

            for (var elemId in membersArray) {
                items.push(ServiceConnector.parseResponseAsModelObject(model, membersArray[elemId]));
            }
        }
    });

    return items;
};


ServiceConnector.loadItem = function (model, itemUrl) {
    var res = {};

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", itemUrl).done(function (resource, textStatus, jqXHR) {
        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);
        res = ServiceConnector.parseResponseAsModelObject(model, resource);
    });

    return res;
};


ServiceConnector.parseResponseAsModelObject = function (model, jsonItem) {
    var answer = {};

    answer.url = ServiceConnector.parseToId(jsonItem['@id']);
    answer.type = ServiceConnector.parseToId(jsonItem['@type']);

    var vocabDefinedProperties = ServiceConnector.vocab[answer.type].supportedProperties;

    for (var propTitle in jsonItem) {
        if (propTitle[0] === '@') {
            continue;
        }

        var prop = jsonItem[propTitle];

        // Finding type of this property
        var propType = '';
        for (var vocabPropId in vocabDefinedProperties) {
            var vocabProp = vocabDefinedProperties[vocabPropId];
            if (vocabProp['hydra_title'] === propTitle) {
                propType = vocabProp['property'];
                break;
            }
        }


        // May be it is a collection ?
        var currentFieldArray = [];
        if (propType === '' || typeof model.propertiesMap[propType] === 'undefined') {
            var potentialCollection = prop.__value;
            if (typeof potentialCollection !== 'undefined' && $.isArray(potentialCollection) &&
                potentialCollection.length > 0) {
                var collectionVocabType = propType;

                // parse all objects
                for (var i in potentialCollection) {
                    if (currentFieldArray.length === 0) {
                        propType = ServiceConnector.parseToId(potentialCollection[i]['@type']);
                    }

                    currentFieldArray.push(ServiceConnector.parseResponseAsModelObject(Models[propType], potentialCollection[i]));
                }

                ServiceConnector.collectionsMap[collectionVocabType] = propType
            }
            else {
                continue;
            }
        }

        // Forming key and value params
        var propKey = model.propertiesMap[propType];
        var propValue = '';
        try {
            if (currentFieldArray.length > 0) {
                propValue = currentFieldArray
            }
            else { //if (typeof prop !== 'object' || prop.length > 0) {
                propValue = ServiceConnector.parseToValue(prop);
            }
        }
        catch (err) {
            try {
                var newModel = Models[prop.__value['@type']];
                if (typeof newModel === 'undefined' && typeof prop.__iri !== 'undefined') {
                    newModel = Models[prop.__iri];
                }
                propValue = ServiceConnector.parseResponseAsModelObject(newModel, prop.__value);
            }
            catch(err) {
                return answer;
            }
        }

        answer[propKey] = propValue;
    }


    return answer;
};


ServiceConnector.parseToId = function (jsonItem) {
    while (typeof jsonItem !== 'string') {
        jsonItem = jsonItem.__value;
        if (typeof jsonItem['@id'] !== 'undefined') {
            jsonItem = jsonItem['@id'];
            break;
        }
    }
    return jsonItem;
};


ServiceConnector.parseToValue = function (jsonItem) {
    while (typeof jsonItem === 'object') {
        jsonItem = jsonItem.__value;
        if (typeof jsonItem['@value'] !== 'undefined') {
            jsonItem = jsonItem['@value'];
            break;
        }
    }
    return jsonItem;
};


ServiceConnector.isModelSupportOperation = function(model, operation) {
    var operations = ServiceConnector.vocab[model.id].supportedOperations;
    for (var i in operations) {
        if (operations[i].method.toLowerCase() === operation.toLowerCase()) {
            return true;
        }
    }

    return false;
};


ServiceConnector.removeItem = function(url) {
    return invokeRequest('DELETE', url);
};

ServiceConnector.saveItem = function(url, data) {
    return invokeJsonRequest('PUT', url, data);
};

ServiceConnector.addItem = function(url, data) {
    return invokeJsonRequest('POST', url, data);
};