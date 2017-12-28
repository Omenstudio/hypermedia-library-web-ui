var Models = {
    'http://schema.org/Article': Article,
    'http://schema.org/Person': Author,
    'http://schema.org/Book': Book,
    'http://schema.org/Publisher': Publisher
};



function findModelById(id_string) {
    for (var key in Models) {
        if (key === id_string) {
            return Models[key];
        }
    }
    return null;
}