var Author = {};
Author.id = 'http://schema.org/Person';
Author.collectionUrl = '';  // autowired
Author.collectionButtonSelector = '.js-authors-btn';
Author.simpleName = 'Author';
Author.propertiesMap = {
    'http://schema.org/name': 'name',
    'http://schema.org/birthDate': 'birthDate'
};


Author.renderShortView = function (obj) {
    var res = '<li><a href="'+obj.url+'"><table>';

    res += Renderer.renderProperty('', obj['name']);

    res += '</table></a></li>';
    return res;
};


Author.renderView = function (obj) {
    var res = '';

    if (typeof obj['name'] !== 'undefined') {
        res += '<h2>' + obj['name'] + '</h2>';
    }

    res += '<table>';
    res += Renderer.renderProperty('Date of birth:', obj['birthDate']);
    res += '</table>';

    return res;
};