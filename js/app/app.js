var Service = {};

Service.entities = ['http://schema.org/Person'];

Service.doc = 'nothing';

Service.load = function (url) {
    showOverlay();

    // Make async call to  show overlay in window
    setTimeout(function () {
        Service._findLinksToEntities(url);
        hideOverlay();
    }, 1);
};


Service._findLinksToEntities = function (url) {
    // Make request and waiting for result
    invokeRequest("GET", url).done(function (resource, textStatus, jqXHR) {

        // Firstly we need to parse documentation
        if (Service.doc === 'nothing') {
            Service.doc = parseDocumentationUrlAndLoad(jqXHR);
        }

        // Do something, man! Don't procrastinate
        resource = JSON.parse(resource);
        var currentUrlId = resource['@type'].__value.__value['@id'];

        // Iterate over given response
        // and try to find Entity collection
        for(var key in resource) {
            // skip if this is not regular field
            if (key[0] === '@') {
                continue;
            }

            // TODO add support for arrays, now it fails
            var value = resource[key];
            var elemUrl = value.__value.__value['@id'];
            var elemType = Service.doc[value.__iri]['range'];
            var memberOf = Service.doc[elemType]['member_of'];
            console.log(memberOf + " : " + elemUrl + " : " + elemType);




        }

        // console.log(resource);
        // console.log(t1);
        // console.log(Service.doc);
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




