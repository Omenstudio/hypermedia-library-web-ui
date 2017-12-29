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


Renderer.buildCollectionHtml = function(collection, model) {
    var res = '<ul>';

    if (collection.length !== 0) {
        for (var i in collection) {
            var item = collection[i];
            res += model.renderShortView(item);
        }
    }
    else {
        res += '<p class="tip">There are no ' + model.simpleName + 's on the service</p>';
    }

    res += '</ul>';
    return res;
};


Renderer.renderCollection = function (collection, model) {
    $('.service-item-list').html(Renderer.buildCollectionHtml(collection, model));
};


Renderer.renderItem = function (item, model) {
    var renderedData = model.renderView(item);

    // Edit and Remove buttons
    var buttons = '';
    if (ServiceConnector.isModelSupportOperation(model, "PUT")) {
        buttons += '<button class="btn btn-warning btn-edit" href="' + item.url + '">Edit ' + model.simpleName.toLowerCase() + '</button>';
    }
    if (ServiceConnector.isModelSupportOperation(model, "DELETE")) {
        buttons += '<button class="btn btn-danger btn-remove" href="' + item.url + '">Delete ' + model.simpleName.toLowerCase() + '</button>';
    }
    buttons = '<div class="item-control-buttons">' + buttons + '</div>';

    // setting content
    $('.service-item-content').html('<div class="item-wrapper">' + renderedData + buttons + '</div>');
};


Renderer.renderItemChange = function (model, item) {
    // Title
    var action = 'Edit';
    if (typeof item === 'undefined') {
        action = 'Save';
    }
    var title = '<h2>' + action + ' ' + model.simpleName + '</h2>';


    // Form
    var formData = '<form id="save-form">';

    var properties = ServiceConnector.vocab[model.id].supportedProperties;
    for (var i in properties) {
        formData += Renderer.renderPropertyInput(properties[i], model, item);
    }

    formData += '</form>';


    // Save and Cancel buttons
    var saveUrl = model.collectionUrl;
    if (typeof item !== 'undefined') {
        saveUrl = item.url;
    }
    var cancelUrl = model.collectionUrl;
    if (typeof item !== 'undefined') {
        cancelUrl = item.url;
    }
    var buttons = '<div class="item-control-buttons">' +
        '<button class="btn btn-success btn-save href="' + saveUrl + '">Save</button>' +
        '<button class="btn btn-danger btn-cancel" href="' + cancelUrl + '">Cancel</button>' +
        '</div>';


    // Build
    $('.service-item-content').html('<div class="item-wrapper">' + title + formData + buttons + '</div>');
};


Renderer.renderProperty = function (title, prop) {
    if (typeof prop !== 'undefined') {
        return '<tr><th>' + title + '</th><td>' + prop + '</td></tr>';
    }
    return '';
};


Renderer.renderPropertyInput = function (propertyObject, model, item) {
    var type = propertyObject.property;
    var modelPropertyName = model.propertiesMap[type];


    // If field is link to other Service entity ->
    //      we need to render it properly
    if (typeof Models[type] !== 'undefined') {
        var linkModel = Models[type];
        var linkItem = item[modelPropertyName];

        return '<div class="form-row item-select">' +
            '<label>' + propertyObject.hydra_description + '</label>' +
            '<input name="' + propertyObject.hydra_title + '" hidden="hidden"/>' +
            '<div class="items" data-url="' + linkModel.collectionUrl + '" data-type="' + linkModel.id + '">' +
            '<div class="item" data-url="' + linkItem.url + '">' + linkModel.renderShortView(linkItem) + '</div>' +
            '</div>' +
            '<div class="select-btns"><button class="btn btn-info btn-select-item">Select</button></div>' +
            '</div>';
    }

    // If it is collection -> output as collection
    if (typeof ServiceConnector.collectionsMap[type] !== 'undefined') {
        type = ServiceConnector.collectionsMap[type];
        modelPropertyName = model.propertiesMap[type];

        if (typeof Models[type] !== 'undefined') {
            var linkItemsHtml = '';
            var linkModel = Models[type];

            for (var i in item[modelPropertyName]) {
                var linkItem = item[modelPropertyName][i];

                linkItemsHtml += '<div class="item" data-url="' + linkItem.url + '">' +
                    linkModel.renderShortView(linkItem) +
                    '</div>';
            }

            return '<div class="form-row item-select">' +
                '<label>' + propertyObject.hydra_description + '</label>' +
                '<input name="' + propertyObject.hydra_title + '" hidden="hidden"/>' +
                '<div class="items" data-url="' + linkModel.collectionUrl + '" data-type="' + linkModel.id + '">' + linkItemsHtml + '</div>' +
                '<div class="select-btns">' +
                '<button class="btn btn-info btn-add-item">Add</button>' +
                '<button class="btn btn-info btn-clear-items">Clear</button>' +
                '</div>' +
                '</div>';
        }
    }


    // If it is usual field
    return '<div class="form-row">' +
        '<label>' + propertyObject.hydra_description + '</label>' +
        '<input name="' + propertyObject.hydra_title + '" ' +
        'placeholder="' + modelPropertyName + '" ' +
        'value="' + item[modelPropertyName] + '" />' +
        '</div>';
};
