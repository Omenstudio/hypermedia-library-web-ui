var Service = {};

Service.entities = [];

Service.doc = 'nothing';

Service.load = function (url) {
    showOverlay();
    // We need to make async call
    setTimeout(function () {
        Service._buildEntityModels();
        Service._findLinksToCollections(url);
        hideOverlay();
    }, 1);
};


Service._buildEntityModels = function () {
    Service.entities = [];

    $('.control-buttons').find('.btn').each(function () {
        var obj = $(this);
        var iri = obj.attr('data-iri');
        Service.entities[iri] = obj;

        obj.attr('disabled', 'disabled');
        obj.attr('title', 'Not mapped in current service');
    });

};

Service._findLinksToCollections = function (url) {
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

            // Detect url, type, and
            var item = resource[entryPointItemKey];
            var itemUrl = item.__value.__value['@id'];
            var itemType = Service.doc[item.__iri]['range'];
            var memberOf = Service.doc[itemType]['member_of'];
            var description = Service.doc[itemType]['description'];

            for (var entityKey in Service.entities) {
                if (entityKey === memberOf) {
                    var obj = Service.entities[entityKey];
                    obj.attr('data-url', itemUrl);
                    obj.removeAttr('disabled');
                    obj.attr('title', description ? description : '');
                }
            }

            //
            if (memberOf !== 'undefined') {

            }


            console.log(memberOf + " : " + itemUrl + " : " + itemType);




        }



        // console.log(resource);
        // console.log(t1);
        console.log(Service.doc);
        // console.log(Service.doc[t1]);


        // Then run dfs on service's URLs to find available collections
        //

        //


        // if (resource.trim().length > 0) {
        //     resource = JSON.parse(resource);
        //
        //     self.response.model.set({
        //         data: resource,
        //         headers: self.getHeaders(jqXHR)
        //     });
        //
        //     if (_.isObject(resource) && ('@type' in resource)) {
        //         self.showDocumentation(resource['@type'].__value.__value['@id']);
        //     }
        // } else {
        //     self.response.model.set({
        //         data: null,
        //         headers: self.getHeaders(jqXHR)
        //     });
        // }
        //
        // if (jqXHR.getResponseHeader('Content-Location')) {
        //     self.addressbar.setUrl(jqXHR.getResponseHeader('Content-Location'));
        // } else {
        //     self.addressbar.setUrl(url);
        // }
    });



};




