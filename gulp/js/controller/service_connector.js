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
        foundCollections =  ServiceConnector._parseEntryPoint(resource);
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

    for(var entryPointItemKey in resource) {
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


ServiceConnector.loadCollection = function (collectionUrl, callbackFunc) {
    var items = [];

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", collectionUrl).done(function (resource, textStatus, jqXHR) {
        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);
        var membersArray = resource.members.__value;

        for (var elemId in membersArray) {
            items.push(callbackFunc(membersArray[elemId]));
            // break;
        }
    });

    return items;
};


ServiceConnector.loadItem = function (itemUrl, callbackFunc) {
    var res = {};

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", itemUrl).done(function (resource, textStatus, jqXHR) {
        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);
        res = callbackFunc(resource);
    });

    return res;
};