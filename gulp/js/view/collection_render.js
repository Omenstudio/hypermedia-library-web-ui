


function renderCollectionForModel(model) {
    var html = '<div>';


    html += '<ul>';
    var model_pos = getModelPos(model);
    for (var i in ServiceConnector.objects[model_pos]) {
        html += model.renderShortView(i, ServiceConnector.objects[model_pos][i]);
    }
    html += '</ul>'


    html += '</div>';
    $('.service-item-list').html(html);
}