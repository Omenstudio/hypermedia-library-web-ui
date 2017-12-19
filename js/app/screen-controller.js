


function buildFirstScreen() {
    // Inject to page
    $('#current-screen').html(data);

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

    // Listeners
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
        Service.load(url);
        return false;
    });
}






