function renderPageAfterServiceLoaded() {
    renderMainButtons();
}


function renderMainButtons() {

    for (var i = 0, model = Models[i]; i < Models.length; ++i, model = Models[i]) {
        var btn = $(model.collectionButtonSelector);
        btn.removeAttr('disabled');
        btn.removeAttr('title');
        if (!model.mapped) {
            btn.attr('disabled', 'disabled');
            btn.attr('title', 'Not mapped in current service!');
        }
    }
}




