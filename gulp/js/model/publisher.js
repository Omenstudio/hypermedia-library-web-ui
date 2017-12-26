var Publisher = {};
Publisher.id = 'http://schema.org/Publisher';
Publisher.collectionUrl = '';  // autowired
Publisher.collectionButtonSelector = '.js-publishers-btn';


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
    var res = '<div class="item-wrapper">';

    if (typeof obj['title'] !== 'undefined') {
        res += '<h2>' + obj['title'] + '</h2>';
    }

    res += '<table>';

    //     'http://schema.org/Person': 'authors',
    //     'http://schema.org/Book': 'magazine'
    res += Renderer.renderProperty('Description:', obj['description']);

    var pages = '';
    if (typeof obj['start page'] !== 'undefined') {
        pages += obj['start page']
    }
    if (typeof obj['end page'] !== 'undefined') {
        pages += obj['end page']
    }
    res += Renderer.renderProperty('Pages:', pages);
    res += Renderer.renderProperty('Number of words:', obj['number of words']);

    res += '</table>';



    res += '</div>';
    return res;
};