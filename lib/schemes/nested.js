var path = require('path'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});
        var naming = bemNaming(options.naming),
            elemFolder = naming.elemDelim + entity.elem,
            modFolder = naming.modDelim + entity.modName,
            folder = path.join(entity.block,
                entity.elem ? elemFolder : '',
                entity.modName ? modFolder : '');

        return path.join(folder,
            naming.stringify(entity) + (tech ? '.' + tech : ''));
    },
    parse: function(str, options) {
        options || (options = {});
        var naming = bemNaming(options.naming),
            splittedPath = str.split(path.sep).filter(Boolean),
            file = splittedPath.pop(),
            splittedFile = file.split('.'),
            entity = naming.parse(splittedFile[0]),
            tech = splittedFile.slice(1).join('.');

        // support for paths without filename, e.g. 'b1/__e1/'
        if (!entity) {
            entity = naming.parse(splittedPath.join('') + splittedFile[0]);
        }

        if (splittedPath.length && entity.block !== splittedPath[0]) {
            return;
        }

        // check if path is valid
        for (var i = 1; i < splittedPath.length; i++) {
            var chunk = splittedPath[i];

            // __e1 or _m1
            if (i === 1 &&
                (chunk.indexOf(naming.elemDelim) !== 0 &&
                chunk.indexOf(naming.modDelim) !== 0)
            ) { return; }

            // __e1/_m1
            if (i === 2 &&
                (splittedPath[i - 1].indexOf(naming.elemDelim) !== 0 ||
                chunk.indexOf(naming.modDelim) !== 0)
            ) { return; }

            if (i > 2) { return; }
        }

        return {
            entity: entity,
            tech: tech
        };
    }
};
