var App = {};

App.doc = '';


App.connectToService = function (service_url) {
    // Enable visual styles
    showOverlay();
    $('#first-screen').css('display', 'none');

    // Get data from server
    // We need to make async call not to freeze the screen
    setTimeout(function () {
        // first of all - parse entrypoint
        var foundCollections = ServiceConnector.loadEntryPointAndDoc(service_url);
        for (var i in foundCollections) {
            Models[foundCollections[i].itemId].collectionUrl = foundCollections[i].url;
        }

        // Link to buttons
        Renderer.updateMenu(foundCollections);

        // Update list and item areas
        Renderer.resetContentAreas();

        // Update
        $('#service-screen').css('display', 'block');

        // End
        hideOverlay();


        // Scroll then fix feature
        var fixmeTop = $('.fixme').offset().top;
        var fixmeLeft = $('.fixme').offset().left - 8;
        var fixmeWidth = $('.fixme').width();

        $(window).scroll(function () {                  // assign scroll event listener
            var currentScroll = $(window).scrollTop(); // get current position
            if (currentScroll >= fixmeTop) {           // apply position: fixed if you
                $('.fixme').css({                      // scroll to that element or below it
                    position: 'fixed',
                    top: '0',
                    left: fixmeLeft,
                    width: fixmeWidth,
                    height: screen.height
                });
            } else {                                   // apply position: static
                $('.fixme').css({                      // if you scroll above it
                    position: 'static',
                    height: 'auto'
                });
            }

        });

    }, 1);


    // Info about current service
    $('#current-service-url-info').text(service_url);
};


App.showCollectionForModel = function (model, sync) {
    showOverlay();

    var doit = function () {
        // first of all - parse entrypoint
        var collectionItems = ServiceConnector.loadCollection(model, model.collectionUrl);

        // Update list and item areas
        Renderer.renderCollection(collectionItems, model);

        Renderer.resetItemArea();

        $('.service-item-list li a').click(function (e) {
            e.preventDefault();

            $('.service-item-list li').removeClass('active');
            $(this).parent().addClass('active');

            App.showItemForModel($(this).attr('href'), model);
        });

        // End
        hideOverlay();
    };

    if (typeof sync !== 'undefined') {
        doit();
    }
    else {
        // Get data from server
        // We need to make async call not to freeze the screen
        setTimeout(doit, 1);
    }
};


App.showItemForModel = function (itemUrl, model) {
    showOverlay();

    var doit = function () {
        // first of all - parse EntryPoint
        var item = ServiceConnector.loadItem(model, itemUrl);

        // Update list and item areas
        Renderer.renderItem(item, model);

        // Bind links to entities
        $('.popup').click(function (e) {
            e.preventDefault();

            var model = Models[$(this).attr('data-model-id')];
            var itemUrl = $(this).attr('href');

            // Menu reset
            $('.control-buttons .btn').removeClass('btn-primary');
            $(model.collectionButtonSelector).addClass('btn-primary');

            // Load list of model entities
            App.showCollectionForModel(model, true);
            $('.service-item-list a').each(function () {
                if ($(this).attr('href') === itemUrl) {
                    $(this).parent().addClass('active');
                    return 0;
                }
            });

            // Load entity
            App.showItemForModel(itemUrl, model);
        });

        // Bind Edit button
        $('.btn-edit').click(function () {
            Renderer.renderItemChange(model, item);

            // Remove links
            $('#save-form .items a td').each(function () {
                var val = $(this).html();
                $(this).closest('a').parent().html(val);
            });

            // Buttons to select, add ot clear link to other entities
            $('.btn-select-item').click(function (e) {
                e.preventDefault();
                var itemsDiv = $(this).closest('.form-row').find('.items');
                var model = Models[itemsDiv.attr('data-type')];
                App.showSelectDialog(model, function (url, content) {
                    itemsDiv.html('<div class="item" data-url="' + url + '">' + content + '</div>');
                    itemsDiv.find('a td').each(function () {
                        var oldHtml = $(this).html();
                        $(this).closest('a').parent().html(oldHtml);
                    });
                });
            });
            $('.btn-add-item').click(function (e) {
                e.preventDefault();
                var itemsDiv = $(this).closest('.form-row').find('.items');
                var model = Models[itemsDiv.attr('data-type')];
                App.showSelectDialog(model, function (url, content) {
                    var isFound = false;
                    itemsDiv.find('.item').each(function () {
                        if ($(this).attr('data-url') === url) {
                            isFound = true;
                            return 0;
                        }
                    });
                    if (isFound) {
                        return;
                    }

                    itemsDiv.append('<div class="item" data-url="' + url + '">' + content + '</div>');
                    itemsDiv.find('a td').each(function () {
                        var oldHtml = $(this).html();
                        $(this).closest('a').parent().html(oldHtml);
                    });
                });
            });
            $('.btn-clear-items').click(function (e) {
                e.preventDefault();
                $(this).closest('.form-row').find('.item').remove();
            });

            // Buttons to control saving / cancelling
            $('.btn-cancel').click(function () {
                App.showItemForModel(item.url, model);
            });
            $('.btn-save').click(function () {
                App.saveItemForModel($('#save-form'));
                App.showItemForModel(item.url, model);
            });


        });

        // Bind Remove button
        $('.btn-remove').click(function () {
            ServiceConnector.removeItem($(this).attr('href'));
            App.showCollectionForModel(model);
        });


        // End
        hideOverlay();
    };

    // Get data from server
    // We need to make async call not to freeze the screen
    setTimeout(doit, 1);
};


App.saveItemForModel = function (formNode) {
    // First of all - collect linked Entities to field values
    formNode.find('.item-select').each(function () {
        var inputValue = '';
        $(this).find('.item').each(function () {
            var itemValueArr = $(this).attr('data-url').replace(new RegExp('-', 'g'), '/').split('/');
            inputValue += itemValueArr[itemValueArr.length - 1] + ', ';
        });
        if (inputValue !== '') {
            inputValue = inputValue.substr(0, inputValue.length - 2);
        }

        $(this).find('input').val(inputValue);
    });


    var data = {};
    formNode.find('input').each(function () {
        data[$(this).attr('name')] = $(this).val();
    });

    var url = formNode.attr('data-url');
    data = JSON.stringify(data);
    console.log(data);
    ServiceConnector.saveItem(url, data);
};


App.showSelectDialog = function (model, callbackFunc) {
    var itemsList = ServiceConnector.loadCollection(model, model.collectionUrl);
    var itemsListHtml = Renderer.buildCollectionHtml(itemsList, model);
    showDialog('Select the ' + model.simpleName, itemsListHtml, callbackFunc);
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

    // Button group switching
    $('.control-buttons .btn').click(function () {
        $('.control-buttons .btn').removeClass('btn-primary');
        $(this).addClass('btn-primary');
        for (var i in Models) {
            if ($(this).is(Models[i].collectionButtonSelector)) {
                App.showCollectionForModel(Models[i]);
            }
        }
    });

    // Links on first screen
    $('.first-screen-wrapper a').click(function (e) {
        e.preventDefault();
        App.connectToService($(this).attr('href'));
    });

    $('#service-screen').css('display', 'none');
};


$(document).ready(function () {
    hideOverlay();
    App.initialize();
});




