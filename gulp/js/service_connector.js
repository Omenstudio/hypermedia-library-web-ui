var ServiceConnector = {};
ServiceConnector.vocab = '';


ServiceConnector.loadEntryPointAndDoc = function (entryPointUrl) {
    var foundCollections = [];

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", entryPointUrl).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (ServiceConnector.vocab === '') {
            ServiceConnector.vocab = parseDocumentationUrlAndLoad(jqXHR);
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
    var foundCollections = [];

    for (var entryPointItemKey in resource) {
        // skip if this is not regular field
        if (entryPointItemKey[0] === '@') {
            continue;
        }

        // Detect url, type, and collection item
        var item = resource[entryPointItemKey];
        var itemUrl = item.__value.__value['@id'];
        var itemType = ServiceConnector.vocab[item.__iri]['range'];
        var memberOf = ServiceConnector.vocab[itemType]['member_of'];
        // var description = ServiceConnector.vocab[itemType]['description'];

        foundCollections.push({itemId: memberOf, url: itemUrl});
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
        var membersArray = resource.members.__value;

        for (var elemId in membersArray) {
            items.push(ServiceConnector.parseResponseAsModelObject(model, membersArray[elemId]));
            // break;
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
            if (typeof potentialCollection !== 'undefined' && $.isArray(potentialCollection)) {
                // parse all objects
                for (var i in potentialCollection) {
                    if (currentFieldArray.length === 0) {
                        propType = ServiceConnector.parseToId(potentialCollection[i]['@type']);
                    }

                    currentFieldArray.push(ServiceConnector.parseResponseAsModelObject(Models[propType], potentialCollection[i]));
                }
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
            else {
                propValue = ServiceConnector.parseToValue(prop);
            }
        }
        catch (err) {
            propValue = ServiceConnector.parseResponseAsModelObject(model, prop.__value);
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