var Article = {};
Article.id = 'http://schema.org/Article';
Article.collectionUrl = '';  // autowired
Article.collectionButtonSelector = '.js-articles-btn';

Article.propertiesMap = {
    'http://schema.org/headline': 'title',
    'http://schema.org/description': 'description',
    'http://schema.org/pageStart': 'start page',
    'http://schema.org/pageEnd': 'end page',
    'http://schema.org/wordCount': 'number of words',
    'http://schema.org/Person': 'authors',
    'http://schema.org/Book': 'magazine'
};


Article.renderShortView = function (curArticle) {
    var res = '<li><a href="'+curArticle.url+'">';

    if (typeof curArticle.title !== 'undefined') {
        res += '<div class="short-article-title">' + curArticle.title + '</div>';
    }

    if (typeof curArticle.authors !== 'undefined') {
        var authors_list_str = '';
        for (var i in curArticle.authors) {
            authors_list_str += curArticle.authors[i].name + ', ';
        }
        authors_list_str = authors_list_str.substr(0, authors_list_str.length-2);

        res += '<div class="short-article-authors">' + authors_list_str + '</div>';
    }

    res += '</a></li>';
    return res;
};


Article.renderView = function (obj) {
    var res = '<div class="item-wrapper">';

    // Title
    if (typeof obj.title !== 'undefined') {
        res += '<h2>' + obj.title + '</h2>';
    }

    res += '<table>';

    // Authors
    if (typeof obj.authors !== 'undefined') {
        res += '<tr><th>Authors:</th><td>';
        for (var i in obj.authors) {
            var author = obj.authors[i];
            res += '<li><a href="' + author.url + '" class="popup" data-model-id="http://schema.org/Person">' +
                    author.name  +
                '</a></li>';
        }
        res += '</td></tr>';
    }

    // Magazine
    if (typeof obj.magazine !== 'undefined') {
        res += '<tr><th>Magazine:</th><td><a href="' + obj.magazine.url + '" class="popup" data-model-id="http://schema.org/Book">' +
                obj.magazine.title +
            '</a></td></tr>';
    }

    // Description
    res += Renderer.renderProperty('Description:', obj['description']);

    // Pages
    var pages = '';
    if (typeof obj['start page'] !== 'undefined') {
        pages += obj['start page']
    }
    if (typeof obj['end page'] !== 'undefined') {
        pages += '-'+obj['end page']
    }
    res += Renderer.renderProperty('Pages:', pages);

    // Number of words
    res += Renderer.renderProperty('Number of words:', obj['number of words']);





    res += '</table>';
    res += '</div>';
    return res;
};

