var traverse = require('traverse'),
    dottie   = require('dottie'),
    _        = require('lodash');

module.exports = function transformJSONToTable(docs, options) {
  options            = options || {};
  options.defaultVal = _.has(options, 'defaultVal') ? options.defaultVal : '';

  // Go through each object, find the deepest path
  // Create an array of all of the possible paths
  var headers = _.keys(traverse(docs).reduce(
                      function(headers, value) {
                        if (this.notRoot && _.isArray(value)) {
                          if (options.includeCollectionLength) {
                            headers[_.rest(this.path).join('.') + '.length'] = true;
                          }
                          if (options.excludeSubArrays) {
                            this.update(value, true);
                          }
                        }
                        if (this.isLeaf) {
                          if (!(_.isPlainObject(value) && _.keys(value).length === 0)) { // Check against empty objects. Don't treat these paths as a valid header value.
                            headers[_.rest(this.path).join('.')] = true;
                          }
                          // Make sure that we don't include empty objects as valid headers
                          // There are good reasons behind this that deal with projections, and non-homogenous objects in a collection.

                        }
                        return headers;
                      }, {})
                );
  // Go through each object again, this time, attempt to grab the value
  // At each possible path.
  var data = [headers];
  data = data.concat(_.map(docs, function(doc) {
                return _.map(headers, function(header) {
                  if (options.checkKeyBeforePath && doc[header]) {
                    return doc[header];
                  }
                  return dottie.get(doc, header, options.defaultVal);
                })
              }));

  return data;
};
