var Book = {};
Book.id = 'http://schema.org/Book';
Book.collectionUrl = '';  // autowired
Book.collectionButtonSelector = '.js-books-btn';
Book.simpleName = 'Book';
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


Book.renderLinkView = function (book, customTitle) {
    if (typeof customTitle === 'undefined') {
        customTitle = 'Book';
    }

    return '<tr><th>' + customTitle + ':</th><td><a href="' + book.url + '" class="popup" data-model-id="http://schema.org/Book">' +
        book.title +
        '</a></td></tr>'
};


Book.renderShortView = function (obj) {
    var res = '<li><a href="' + obj.url + '">';

    res += Renderer.renderProperty('', obj.title);

    res += '<div class="additional-book-info">';
    // Authors
    if (typeof obj.authors !== 'undefined') {
        var add_info_str = '';

        if ($.isArray(obj.authors)) {
            for (var i in obj.authors) {
                add_info_str += obj.authors[i].name + ', ';
            }
        }
        else {
            add_info_str += obj.authors.name + ', ';
        }

        add_info_str = add_info_str.substr(0, add_info_str.length - 2);

        res += '<div class="short-book-authors">written by ' + add_info_str + '</div>';
    }

    // Publisher
    if (typeof obj.publisher !== 'undefined') {
        res += '<div class="short-book-publisher">published by ' + obj.publisher.name + '</div>';
    }

    res += '</div>';

    res += '</a></li>';
    return res;
};


Book.renderView = function (obj) {
    var res = '';

    if (typeof obj['title'] !== 'undefined') {
        res += '<h2>' + obj['title'] + '</h2>';
    }

    res += '<table>';

    // Authors
    if (typeof obj.authors !== 'undefined') {
        res += '<tr><th>Written by:</th><td>';
        if ($.isArray(obj.authors)) {
            for (var i in obj.authors) {
                res += Author.renderLinkView(obj.authors[i]);
            }
        }
        else {
            res += Author.renderLinkView(obj.authors);
        }
        res += '</td></tr>';
    }

    // Magazine
    if (typeof obj.publisher !== 'undefined') {
        res += '<tr><th>Published by:</th><td>' + Publisher.renderLinkView(obj.publisher) + '</td></tr>';
    }

    res += Renderer.renderProperty('Alt. title:', obj['alternativeTitle']);
    res += Renderer.renderProperty('Description:', obj['description']);
    res += Renderer.renderProperty('Publish year:', obj['copyrightYear']);
    res += Renderer.renderProperty('Page count:', obj['numberOfPages']);
    res += Renderer.renderProperty('Edition:', obj['bookEdition']);
    res += Renderer.renderProperty('ISBN:', obj['isbn']);

    // res += Renderer.renderProperty('Person:', obj['Person']);
    // res += Renderer.renderProperty('Publisher:', obj['Publisher']);

    res += '</table>';
    return res;
};