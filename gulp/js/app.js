var App = {};

App.doc = '';


App.connectToService = function(service_url) {
    // Enable visual styles
    showOverlay();
    $('#first-screen').css('display', 'none');

    // Get data from server
    // We need to make async call not to freeze the screen
    setTimeout(function () {
        // first of all - parse entrypoint
        var foundCollections = DataProcessor.load(service_url);
        // Next - buttons
        // renderServicePage();
        $('#service-screen').css('display', 'block');
        hideOverlay();
    }, 1);


    // Info about current service
    $('#current-service-url-info').text(service_url);


    console.log(service_url);
};























App.initialize = function () {
    // Inject to page
    // $('#current-screen').html(data);

    // Fill url param
    var queryParams = {};
    if (window.location.search.length > 1) {
        for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
            aItKey = aCouples[nKeyId].split("=");
            queryParams[unescape(aItKey[0])] = aItKey.length > 1 ? unescape(aItKey[1]) : "";
        }
    }
    if ('url' in queryParams) {
        $('.addressbar .url').val(queryParams.url);
    }

    // "Load service" button
    $('.addressbar').submit(function (e) {
        e.preventDefault();

        var url = $(this).find('.url').val().trim();
        if (!url.length) {
            alert('Please, enter valid URL');
            return;
        }

        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        App.connectToService(url);

        return false;
    });

    // Button group visual switching
    $('.control-buttons .btn').click(function () {
        $('.control-buttons .btn').removeClass('btn-primary');
        $(this).addClass('btn-primary');
    });

    // Links on first screen
    $('.first-screen-wrapper a').click(function (e) {
        e.preventDefault();
        App.connectToService($(this).attr('href'));
    });

    $('#service-screen').css('display', 'none');
};


App.showArticles = function () {
    renderCollectionForModel(Article);
    // showOverlay();
    // // We need to make async call
    // setTimeout(function () {
    //     App.currentModel = Article;
    //     App.loadDataFromService(Article);
    //     App.buildCollectionView(Article);
    //
    //     hideOverlay();
    // }, 1);
};

App.showBooks = function () {
    $('.service-item-list').text('Books');
};

App.showAuthors = function () {
    $('.service-item-list').text('Authors');
};

App.showPublishers = function () {
    $('.service-item-list').text('showPublishers');
};


App.showForModel = function () {

};

App.loadDataFromService = function (obj) {
    App.currentObjects = [];

    var collection = loadRegularUrl(obj.collectionUrl).members.__value;
    for (var i in collection) {
        var itemUrl = collection[i]['@id'].__value.__value['@id'];
        App.currentObjects.push(loadRegularUrl(itemUrl));
    }
};


App.buildCollectionView = function(obj) {
    // Build html
    var listHtml = '<ul>';

    for(var i=0, cur = App.currentObjects[i]; i < App.currentObjects.length; ++i, cur = App.currentObjects[i]) {
        var itemHtml =
            '<li>' +
                '<a href="javascript:App.showElement(' + i + ')">' +
                    cur['title'].__value.__value['@value'] +
                '</a>' +
            '</li>';
        listHtml += itemHtml;
    }



    listHtml += '</ul>';
    $('.service-item-list').html(listHtml);
};


App.showElement = function (index) {
    var html = '<ul>';

    for (var i in App.currentObjects[index]) {
        var prop = App.currentObjects[index][i];
        var val = prop.__value.__orig_value;
        var iri = prop.__iri;
        html += '<li>' + val + '</li>';
    }

    html += '</ul>';
    $('.service-item-content').html(html);
};




$(document).ready(function () {
    hideOverlay();
    App.initialize();
});




