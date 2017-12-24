var Article = {};
Article.id = 'http://schema.org/Article';
Article.mapped = false;  // autowired
Article.collectionUrl = '';  // autowired
Article.collectionButtonSelector = '.js-articles-btn';

Article.shortProperties = [
    'http://schema.org/headline',
    'http://schema.org/description',
    'http://schema.org/pageStart',
    'http://schema.org/pageEnd',
    'http://schema.org/wordCount',
    'vocab:AuthorCollection',
    'http://schema.org/Book'
];


Article.__shortViewTemplate = _.template(
    "<li><a href=\"javascript:App.showElement(0)\">" +
        "<table>" +
            "<tr><th>Title:</th><td><%= title %></td></tr>" +
            "<tr><th>Authors:</th><td><%= authors %></td></tr>" +
        "</table>" +
    "</a></li>"
);

Article.renderShortView = function (index, obj) {
    var authorsStr = 'authors';


    return Article.__shortViewTemplate({
        title: obj['title'].__value.__value['@value'],
        authors: authorsStr
    });
};