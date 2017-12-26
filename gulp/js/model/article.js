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

// Need to transform json-ld response to normal model
Article.collectionParserCallback = function (jsonItem) {
    var answer = {};

    answer.url = jsonItem['@id'].__value.__value['@id'];
    answer.type = jsonItem['@type'].__value.__value['@id'];

    var vocabDefinedProperties = ServiceConnector.vocab[answer.type].supportedProperties;

    // console.log(vocabDefinedProperties);

    for (var propTitle in jsonItem) {
        if (propTitle[0] === '@') {
            continue;
        }

        var prop = jsonItem[propTitle];

        // Finding type of this property
        var propType = '';
        for (var vocabPropId in vocabDefinedProperties) {
            var vocabProp = vocabDefinedProperties[vocabPropId];
            if (vocabProp['hydra_title'] === propTitle) {
                propType = vocabProp['property'];
                break;
            }
        }


        // May be is it collection ?
        if (propType === '' || typeof Article.propertiesMap[propType] === 'undefined') {
            // TODO add handler
            continue;
        }


        var propKey = Article.propertiesMap[propType];
        var propValue = prop.__value;
        if (typeof propValue.__value !== 'undefined' && typeof propValue.__value['@value'] !== 'undefined') {
            propValue = propValue.__value['@value'];
        }

        answer[propKey] = propValue;
    }


    return answer;
};






Article.renderShortView = function (obj) {
    var res = '<li><a href="'+obj.url+'"><table>';

    res += Renderer.renderProperty('Title:', obj['title']);

    if (typeof obj['authors'] !== 'undefined') {
        res += '<tr><th>Title:</th><td>' + obj['authors'] + '</td></tr>';
    }

    res += '</table></a></li>';
    return res;
};


Article.renderView = function (obj) {
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

