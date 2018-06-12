var schemes = require('./lib/schemes');

module.exports = function(name) {
    var scheme = schemes[(name || 'nested')];
    if (!scheme) {
        throw new Error('Scheme not found: ' + name);
    }
    return scheme;
};
