var Book = {};
Book.id = 'http://schema.org/Book';
Book.collectionUrl = '';  // autowired
Book.collectionButtonSelector = '.js-books-btn';


Book.propertiesMap = {
    'http://schema.org/headline': 'title',
    'http://schema.org/alternativeHeadline': 'alternativeTitle',
    'http://schema.org/description': 'description',
    'http://schema.org/copyrightYear': 'copyrightYear',
    'http://schema.org/bookEdition': 'bookEdition',
    'http://schema.org/numberOfPages': 'numberOfPages',
    'http://schema.org/isbn': 'isbn',
    'http://schema.org/Person': 'authors',
    'http://schema.org/Publisher': 'publisher'
};


Book.renderShortView = function (obj) {
    var res = '<li><a href="'+obj.url+'"><table>';

    res += Renderer.renderProperty('', obj['title']);

    // TODO add authors

    res += '</table></a></li>';
    return res;
};


Book.renderView = function (obj) {
    var res = '<div class="item-wrapper">';

    if (typeof obj['title'] !== 'undefined') {
        res += '<h2>' + obj['title'] + '</h2>';
    }

    res += '<table>';


    res += Renderer.renderProperty('Alt. title:', obj['alternativeHeadline']);
    res += Renderer.renderProperty('Description:', obj['description']);
    res += Renderer.renderProperty('Publish year:', obj['copyrightYear']);
    res += Renderer.renderProperty('Page count:', obj['numberOfPages']);
    res += Renderer.renderProperty('Edition:', obj['bookEdition']);
    res += Renderer.renderProperty('ISBN:', obj['isbn']);

    res += Renderer.renderProperty('Person:', obj['Person']);
    res += Renderer.renderProperty('Publisher:', obj['Publisher']);

    res += '</table></div>';
    return res;
};