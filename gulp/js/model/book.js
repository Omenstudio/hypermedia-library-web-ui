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