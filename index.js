const traverse       = require('traverse');
const _tail          = require('lodash.tail');
const _map           = require('lodash.map');
const _has           = require('lodash.has');
const _flatten       = require('lodash.flatten');
const _isPlainObject = require('lodash.isplainobject');
const _keys          = require('lodash.keys');
const _isArray       = require('lodash.isarray');
const _get           = require('lodash.get');

module.exports = function transformJSONToTable(docs, options = {}) {
  options.defaultVal = _has(options, 'defaultVal') ? options.defaultVal : '';

  if (_isPlainObject(docs)) {
    docs = _flatten([docs]);
  }

  // Go through each object, find the deepest path
  // Create an array of all of the possible paths
  let allHeaders = _keys(traverse(docs).reduce(
    function (headers, value) {
      const self = this;
      if (this.notRoot && _isArray(value)) {
        if (options.includeCollectionLength) {
          headers[`${_tail(this.path).join('.')}.length`] = true;
        }
        if (options.excludeSubArrays) {
          this.update(value, true);
        }
      }
      if (this.isLeaf) {
        this.path = _map(this.path, level => {
          if (level.indexOf('.') > -1 && self.level > 2) { // If a leaf contains a dot in it, then surround the whole path with ticks
            level = `\`${level}\``;
          }
          return level;
        });
        if (!(_isPlainObject(value) && _keys(value).length === 0)) { // Check against empty objects. Don't treat these paths as a valid header value.
          headers[_tail(this.path).join('.')] = true;
        }
      }
      return headers;
    }, {})
  );
  // Go through each object again, this time, attempt to grab the value
  // At each possible path.
  let tableData = [allHeaders];
  tableData     = tableData.concat(_map(docs, doc => {
    return _map(allHeaders, header => {
      if (options.checkKeyBeforePath && doc[header]) {
        return doc[header];
      }
      if (header.indexOf('.`') > -1) { // One of those special cases where a path is nested, AND has a dot in the name.
        const parts = header.split('.`');
        const head  = parts[0].replace(/\`/g, '');
        const tail  = parts[1].replace(/\`/g, '');

        return _get(doc, head, {})[tail];
      }

      return _get(doc, header, options.defaultVal);
    });
  }));

  return tableData;
};
