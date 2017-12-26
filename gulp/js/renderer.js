var Renderer = {};

Renderer.updateMenu = function (collections) {
    for (var modelKey in Models) {
        var model = Models[modelKey];
        var btn = $(model.collectionButtonSelector);
        btn.removeAttr('disabled');
        btn.removeAttr('title');
        if (model.collectionUrl === '') {
            btn.attr('disabled', 'disabled');
            btn.attr('title', 'Not mapped in current service');
        }
    }
};


Renderer.resetContentAreas = function () {
    Renderer.resetCollectionArea();
    Renderer.resetItemArea();
};


Renderer.resetCollectionArea = function () {
    $('.service-item-list').html('<p class="tip">Please, select the menu item from top part of the screen</p>');
};


Renderer.resetItemArea = function () {
    $('.service-item-content').html('<p class="tip">Please, select the item to show from list in left part of the screen</p>');
};


Renderer.renderCollection = function (collection, model) {
    var res = '<ul>';

    for (var i in collection) {
        var item = collection[i];
        res += model.renderShortView(item);
    }

    res += '</ul>';

    $('.service-item-list').html(res);
};



Renderer.renderItem = function (item, model) {
    $('.service-item-content').html(model.renderView(item));
};





Renderer.renderProperty = function (title, prop) {
    if (typeof prop !== 'undefined') {
        return '<tr><th>' + title + '</th><td>' + prop + '</td></tr>';
    }
    return '';
};