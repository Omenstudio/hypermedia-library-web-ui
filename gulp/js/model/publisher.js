var Publisher = {};
Publisher.id = 'http://schema.org/Publisher';
Publisher.collectionUrl = '';  // autowired
Publisher.collectionButtonSelector = '.js-publishers-btn';
Publisher.simpleName = 'Publisher';
Publisher.propertiesMap = {
    'http://schema.org/name': 'name',
    'http://schema.org/foundingDate': 'foundingDate',
    'http://schema.org/location': 'location'
};


Publisher.renderShortView = function (obj) {
    var res = '<li><a href="'+obj.url+'"><table>';

    res += Renderer.renderProperty('', obj['name']);

    res += '</table></a></li>';
    return res;
};


Publisher.renderView = function (obj) {
    var res = '';

    if (typeof obj['name'] !== 'undefined') {
        res += '<h2>' + obj['name'] + '</h2>';
    }

    res += '<table>';

    res += Renderer.renderProperty('Founding date:', obj['foundingDate']);
    res += Renderer.renderProperty('Current location:', obj['location']);

    res += '</table>';
    return res;
};