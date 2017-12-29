function showOverlay() {
    $('#overlay').css('display', 'grid');
}

function hideOverlay() {
    $('#overlay').css('display', 'none');
}

function showDialog(title, content, callbackFunc) {
    closeDialog();

    var wrap = '<div class="center-point">' +
        '<div class="dialog">' +
        '<h2>' + title + '</h2>' +
        '<div class="dialog-content">' + content + '</div>' +
        '<button class="btn btn-danger btn-close-dialog">Cancel</button>' +
        '</div>' +
        '</div>';


    $('body').append(wrap);
    showOverlay();

    // Cancel button handler
    $('.btn-close-dialog').click(function (e) {
        e.preventDefault();
        closeDialog();
    });

    // Callback on
    $('.dialog-content a').click(function (e) {
        e.preventDefault();
        var htmlNode = $(this).closest('a');
        var url = htmlNode.attr('href');
        callbackFunc(url, htmlNode.parent().clone().wrap('<div></div>').parent().html());
        closeDialog();
    });
}

function closeDialog() {
    $('.dialog').remove();
    hideOverlay();
}