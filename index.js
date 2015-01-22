var traverse    = require('traverse');
var dottie      = require('dottie');
var _ 		= require('lodash');

module.exports = function transformJSONToTable(docs, defaultVal) {
  if(arguments.length === 1) {
    defaultVal = '';
  }

  // Go through each object, find the deepest path
  // Create an array of all of the possible paths
  var headers = _.keys(traverse(docs).reduce(
                      function(headers, value) {
                        if (this.isLeaf) {
                          // Make sure that we don't include empty objects as valid headers
                          // There are good reasons behind this that deal with projections, and non-homogenous objects in a collection.
                          if (!(_.isPlainObject(value) && _.keys(value).length === 0)) { // Check against empty objects. Don't treat these paths as a valid header value.
                            headers[_.rest(this.path).join('.')] = true;
                          }
                        }
                        return headers;
                      }, {})
                );
  // Go through each object again, this time, attempt to grab the value
  // At each possible path.
  var data = [headers];
  data = data.concat(_.map(docs, function(doc) {
                return _.map(headers, function(header) {
                  return dottie.get(doc, header, defaultVal);
                })
              }));

  return data;
};
