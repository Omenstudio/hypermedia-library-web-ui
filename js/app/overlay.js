
function showOverlay() {
    $('#overlay').css('display', 'grid');
}

function hideOverlay() {
    $('#overlay').css('display', 'none');
}

$(document).ready(function () {
    hideOverlay();
    // $('#overlay').click(function () {hideOverlay()});
});