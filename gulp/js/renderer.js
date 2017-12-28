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

    $('.service-item-list').html(res);
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


Renderer.renderItemChange = function(model, item) {
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
        saveUrl  = item.url;
    }
    var cancelUrl = model.collectionUrl;
    if (typeof item !== 'undefined') {
        cancelUrl  = item.url;
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
    var modelPropertyName = model.propertiesMap[propertyObject.property];

    var value = item[modelPropertyName];
    if (typeof value === 'undefined') {
        value = '';
    }

    return '<div class="form-row">' +
               '<label>' + propertyObject.hydra_description + '</label>' +
               '<input name="' + propertyObject.hydra_title + '" ' +
                       'placeholder="' + modelPropertyName + '" ' +
                       'value="' + value + '" />' +
           '</div>';
};