const traverse = require('traverse');

const _4_17_11 = require("lodash-4.17.11");
const _4_17_10 = require("lodash-4.17.10");
const _4_17_9 = require("lodash-4.17.9");
const _4_17_5 = require("lodash-4.17.5");
const _4_17_4 = require("lodash-4.17.4");
const _4_17_3 = require("lodash-4.17.3");
const _4_17_2 = require("lodash-4.17.2");
const _4_17_1 = require("lodash-4.17.1");

module.exports = function transformJSONToTable(docs, options = {}) {
  options.defaultVal = _4_17_11.has(options, 'defaultVal') ? options.defaultVal : '';

  if (_4_17_9.isPlainObject(docs)) {
    docs = _4_17_5.flatten([docs]);
  }

  // Go through each object, find the deepest path
  // Create an array of all of the possible paths
  let allHeaders = _4_17_5.keys(traverse(docs).reduce(
    function (headers, value) {
      const self = this;
      if (this.notRoot && _4_17_4.isArray(value)) {
        if (options.includeCollectionLength) {
          headers[`${_4_17_3.tail(this.path).join('.')}.length`] = true;
        }
        if (options.excludeSubArrays) {
          this.update(value, true);
        }
        if (options.listSubArrays && !_4_17_9.isPlainObject(value[0])) {
          headers[_4_17_3.tail(this.path).join('.')] = true;
          this.update(value, true)
        }
      }
      if (this.isLeaf) {
        this.path = _4_17_2.map(this.path, level => {
          if (level.indexOf('.') > -1 && self.level > 2) { // If a leaf contains a dot in it, then surround the whole path with ticks
            level = `\`${level}\``;
          }
          return level;
        });
        if (!(_4_17_9.isPlainObject(value) && _4_17_5.keys(value).length === 0)) { // Check against empty objects. Don't treat these paths as a valid header value.
          headers[_4_17_3.tail(this.path).join('.')] = true;
        }
      }
      return headers;
    }, {})
  );
  // Go through each object again, this time, attempt to grab the value
  // At each possible path.
  let tableData = [allHeaders];
  tableData     = tableData.concat(_4_17_2.map(docs, doc => {
    return _4_17_2.map(allHeaders, header => {
      if (options.checkKeyBeforePath && doc[header]) {
        return doc[header];
      }
      if (header.indexOf('.`') > -1) { // One of those special cases where a path is nested, AND has a dot in the name.
        const parts = header.split('.`');
        const head  = parts[0].replace(/\`/g, '');
        const tail  = parts[1].replace(/\`/g, '');

        return _4_17_1.get(doc, head, {})[tail];
      }

      return _4_17_1.get(doc, header, options.defaultVal);
    });
  }));

  return tableData;
};
