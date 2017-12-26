var DataController = {};
DataController.doc = '';


DataController.loadEntryPointAndDoc = function (entryPointUrl) {
    var foundCollections = [];

    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", entryPointUrl).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (DataController.vocab === '') {
            DataController.vocab = parseDocumentationUrlAndLoad(jqXHR);
        }

        // From proxy.php we get JSON response, which is already converted from JSON-LD to usual json
        resource = JSON.parse(resource);

        // Parse entrypoint to link collections and urls
        foundCollections =  DataController._parseEntryPoint(resource);
    });

    return foundCollections;
};


DataController._parseEntryPoint = function (resource) {
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
        var itemType = DataProcessor.currentDoc[item.__iri]['range'];
        var memberOf = DataProcessor.currentDoc[itemType]['member_of'];
        var description = DataProcessor.currentDoc[itemType]['description'];

        foundCollections.push({itemId: memberOf, url: itemUrl});
    }

    return foundCollections;
};