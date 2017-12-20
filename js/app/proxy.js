
function invokeRequest(method, url, data, headers) {
    var self = this;

    var settings = {
        'type': method || 'GET',
        'headers': headers || { 'Accept': 'application/ld+json, application/json;q=0.1' },
        'processData': false,
        'data': data || null,
        'dataType': 'text',
        'async': false
    };

    return $.ajax('proxy.php?url=' + encodeURI(url), settings);
}

function getHeaders(jqXHR) {
    return 'HTTP/1.1 ' + jqXHR.status + ' ' + jqXHR.statusText + "\n" + jqXHR.getAllResponseHeaders();
}


function parseLinkHeader(header) {
    var links = {};

    if (!header || (0 === header.trim().length)) {
        return links;
    }

    var parts = header.split(',');

    for(var i = parts.length - 1; i >= 0; i--) {
        var params = parts[i].split(';');
        var url, rel;
        for (var j = params.length - 1; j >= 0; j--) {
            if ('<' === params[j].trim()[0]) {
                url = params[j].trim().slice(1, -1);
            } else {
                var p = params[j].split('=');
                if ((2 === p.length) && ('rel' === p[0].trim())) {
                    rel = p[1].trim().slice(1, -1);
                }
            }
        }
        if (url && rel) {
            links[rel] = url;
        }
    }

    return links;
}


function parseDocumentationUrlAndLoad(jqXHR) {
    var linkHeaders = parseLinkHeader(jqXHR.getResponseHeader('Link'));
    if (!linkHeaders['http://www.w3.org/ns/hydra/core#apiDocumentation']) {
        alert('Cannot find link to vocab header');
    }
    return loadDocumentation(linkHeaders['http://www.w3.org/ns/hydra/core#apiDocumentation']);
}

function loadDocumentation(apiDocUrl) {
    var result = {};

    $.ajax({
        url: 'proxy.php',
        dataType: 'json',
        async: false,
        data: { 'url': apiDocUrl, 'vocab': 1 },
        success: function(resource) {
            var tmp = resource['@graph'];

            for (var i in tmp) {
                result[tmp[i]['@id']] = tmp[i];
            }
        },
        error: function () {
            alert('Failed to parse vocab');
        }
    });

    return result;
}

function loadRegularUrl(url) {
    var result = [];

    invokeRequest('GET', url).done(function (data) {
        result = JSON.parse(data);
    });

    return result;
}
