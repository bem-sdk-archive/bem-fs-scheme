var path = require('path'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});
        var naming = bemNaming(options.naming);

        return naming.stringify(entity) + '.' + tech;
    },
    parse: function(str, options) {
        if (path.basename(str) !== str) {
            return;
        }

        options || (options = {});
        var naming = bemNaming(options.naming),
            splittedPath = str.split('.');

        return {
            entity: naming.parse(splittedPath[0]),
            tech: splittedPath.slice(1).join('.')
        };
    }
};
