// This class perform data loading and parsing from server

var DataProcessor = {};

// Autowired
DataProcessor.currentEntryPoint = '';
DataProcessor.currentDoc = '';

DataProcessor.objects = [];


/**
 * Clears all parameters. Useful, when loading new entrypoint
 */
DataProcessor.clear = function () {
    DataProcessor.currentEntryPoint = '';
    DataProcessor.currentDoc = '';

    DataProcessor.objects = [];
    for (var i=0; i<Models.length; ++i) {
        DataProcessor.objects.push([]);
    }
};


DataProcessor.load = function (url) {
    // if we load the same server - just skip. Unnecessary calls
    if (DataProcessor.currentEntryPoint === url) {
        return;
    }

    // Clear old parameters
    DataProcessor.clear();

    // Store new entrypoint url ...
    DataProcessor.currentEntryPoint = url;

    // ... and perform full data loading
    //
    // Suppose, that links to collections located in EntryPoint
    // So, we need to get EntryPoint items
    // and find which of they are hyperlinks to our collections
    invokeRequest("GET", DataProcessor.currentEntryPoint).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (DataProcessor.currentDoc === '') {
            DataProcessor.currentDoc = parseDocumentationUrlAndLoad(jqXHR);
        }

        // From proxy.php we get JSON response, which is already converted from JSON-LD
        resource = JSON.parse(resource);

        // Parse entrypoint to link collections and urls
        DataProcessor._parseEntryPoint(resource);

        // We need to figure out, which model's fields supported
        // by the server and which are not
        DataProcessor._parseInfoAboutModels();

        // Load all dataset in memory.
        // Stupid solution, but I guess that's not important in my case
        DataProcessor._loadAllData();
    });
};


DataProcessor._parseEntryPoint = function (resource) {
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
        var itemType = DataProcessor.currentDoc[item.__iri]['range'];
        var memberOf = DataProcessor.currentDoc[itemType]['member_of'];
        var description = DataProcessor.currentDoc[itemType]['description'];

        for (var i=0, model = Models[i]; i<Models.length; ++i, model = Models[i]) {
            if (model.id === memberOf) {
                model.collectionUrl = itemUrl;
                model.mapped = true;
            }
        }
    }
};


DataProcessor._parseInfoAboutModels = function () {
    // We need to figure out, which model's fields supported
    // by the server and which are not
    for (var i=0, model = Models[i]; i<Models.length; ++i, model = Models[i]) {
        DataProcessor._parseInfoAboutModel(model);
    }
};


DataProcessor._parseInfoAboutModel = function (model) {
    // We need to figure out, which model's fields supported
    // by the server and which are not
    console.log(model);
};


DataProcessor._loadAllData = function () {
    // Load all dataset in memory.
    // Stupid solution, but I guess that's not important in my case
    for (var i=0, model = Models[i]; i<Models.length; ++i, model = Models[i]) {
        if (model.mapped) {
            DataProcessor._loadDataForModel(model);
        }
    }
};


DataProcessor._loadDataForModel = function (model) {
    var model_pos = getModelPos(model);
    var collection = loadRegularUrl(model.collectionUrl).members.__value;
    for (var i in collection) {
        // TODO remove from production
        if (i === 3) {
            break;
        }

        var itemUrl = collection[i]['@id'].__value.__value['@id'];
        DataProcessor.objects[model_pos].push(loadRegularUrl(itemUrl));
    }
};


