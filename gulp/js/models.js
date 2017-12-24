

var Article = {};
Article.id = 'http://schema.org/Article';
Article.collectionButtonSelector = '';

Article.mapped = false;  // autowired
Article.collectionUrl = '';  // autowired

Article.properties = [
    'http://schema.org/headline',
    'http://schema.org/description',
    'http://schema.org/pageStart',
    'http://schema.org/pageEnd',
    'http://schema.org/wordCount',
    'vocab:AuthorCollection',
    'http://schema.org/Book'
];


var Models = [Article];





