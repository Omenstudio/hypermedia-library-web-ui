var Service = {};

Service.doc = 'nothing';

Service.load = function (url) {
    showOverlay();
    // We need to make async call
    setTimeout(function () {
        Service._parseEntryPointAndDocumentation(url);
        hideOverlay();
    }, 1);
};

Service._parseEntryPointAndDocumentation = function (url) {
    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", url).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (Service.doc === 'nothing') {
            Service.doc = parseDocumentationUrlAndLoad(jqXHR);
        }

        // From proxy.php we get JSON response, which is already converted from JSON-LD
        resource = JSON.parse(resource);

        // Iterate over given response
        // and try to find Entity collection
        // For instance, EntryPoint returned response:
        //      books: /api/books_list
        //      authors: /api/authors_management
        //      publishers: /api/publishers
        // We need to iterate over books, authors and publishers and
        // detect which type of Entity they contain
        for(var entryPointItemKey in resource) {
            // skip if this is not regular field
            if (entryPointItemKey[0] === '@') {
                continue;
            }

            // Detect url, type, and collection item

            var item = resource[entryPointItemKey];
            var itemUrl = item.__value.__value['@id'];
            var itemType = Service.doc[item.__iri]['range'];
            var memberOf = Service.doc[itemType]['member_of'];
            var description = Service.doc[itemType]['description'];

            for (var i=0, model = Models[i]; i<Models.length; ++i, model = Models[i]) {
                if (model.id === memberOf) {
                    model.collectionUrl = itemUrl;
                    model.mapped = true;
                }
            }}
    });
};







