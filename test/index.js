const assert      = require('chai').assert;
const    mocha       = require('mocha');
const    _           = require('lodash');
const jsonToTable = require('../');

describe('Basic usage', function () {

  it('Should take a simple array of JSON objects and create a simple table', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com'
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov'
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov'
      }
    ];

    const tableData         = jsonToTable(jsonData);
    const expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email'],
      ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com'],
      ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov'],
      ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take a array of JSON object with nested properties and create a table', function () {
    const jsonData = [
      {
        id: 1,
        occupation: 'web developer',
        contact: {
          firstName: 'Scott',
          lastName: 'Hillman',
          phoneNumber: '801-555-5555',
          email: 'scott@grow.com'
        }
      },
      {
        id: 2,
        occupation: 'fbi agent',
        contact: {
          firstName: 'Burt',
          lastName: 'Macklin',
          phoneNumber: '801-555-5555',
          email: 'burt@fbi.gov'
        }
      },
      {
        id: 3,
        occupation: 'government employee',
        contact: {
          firstName: 'Ron',
          lastName: 'Swanson',
          phoneNumber: '801-555-5555',
          email: 'ron@pawnee.gov'
        }
      }
    ];

    const tableData         = jsonToTable(jsonData),
        expectedTableData = [['id', 'occupation', 'contact.firstName', 'contact.lastName', 'contact.phoneNumber', 'contact.email'],
          [1, 'web developer', 'Scott', 'Hillman', '801-555-5555', 'scott@grow.com'],
          [2, 'fbi agent', 'Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov'],
          [3, 'government employee', 'Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array of non-homogenous JSON objects and create a table', function () {
    const jsonData = [
      {
        id: 1,
        occupation: 'web developer',
        contact: {
          firstName: 'Scott',
          lastName: 'Hillman',
          phoneNumber: '801-555-5555',
          email: 'scott@grow.com'
        }
      },
      {
        id: 2,
        contact: {
          phoneNumber: '801-555-5555',
          email: 'burt@fbi.gov'
        }
      },
      {
        occupation: 'government employee',
        contact: {
          firstName: 'Ron',
          lastName: 'Swanson'
        }
      }
    ];

    const tableData         = jsonToTable(jsonData),
        expectedTableData = [['id', 'occupation', 'contact.firstName', 'contact.lastName', 'contact.phoneNumber', 'contact.email'],
          [1, 'web developer', 'Scott', 'Hillman', '801-555-5555', 'scott@grow.com'],
          [2, '', '', '', '801-555-5555', 'burt@fbi.gov'],
          ['', 'government employee', 'Ron', 'Swanson', '', '']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array with sub-arrays and include the length of that array', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com',
        friends: ['Trent', 'Andrew', 'Joey', 'Ryan', 'Rob']
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov',
        friends: ['April', 'Leslie']
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
        friends: []
      }
    ];

    const tableData     = jsonToTable(jsonData, {includeCollectionLength: true});
    expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'friends.length', 'friends.0', 'friends.1', 'friends.2', 'friends.3', 'friends.4', 'friends'],
      ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 5, 'Trent', 'Andrew', 'Joey', 'Ryan', 'Rob', ['Trent', 'Andrew', 'Joey', 'Ryan', 'Rob']],
      ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov', 2, 'April', 'Leslie', '', '', '', ['April', 'Leslie']],
      ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov', 0, '', '', '', '', '', []]];
    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array with sub-arrays and include the length of that array, but not include the array itself', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com',
        friends: ['Trent', 'Andrew', 'Joey', 'Ryan', 'Rob']
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov',
        friends: ['April', 'Leslie']
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
        friends: ['test']
      }
    ];

    const tableData         = jsonToTable(jsonData, {includeCollectionLength: true, excludeSubArrays: true}),
        expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'friends.length'],
          ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 5],
          ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov', 2],
          ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov', 1]];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should properly handle a default value', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com',
        title: 'Master runner'
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov'
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov'
      }
    ];

    const tableData         = jsonToTable(jsonData, {defaultVal: 'None'}),
        expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'title'],
          ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 'Master runner'],
          ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov', 'None'],
          ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov', 'None']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take undefined as a valid default value', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com',
        title: 'Master runner'
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov'
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov'
      }
    ];

    const tableData         = jsonToTable(jsonData, {defaultVal: undefined}),
        expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'title'],
          ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 'Master runner'],
          ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov', undefined],
          ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov', undefined]];


    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should treat strings surround with tick marks as column name, not as a path', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        lastName: 'Hillman',
        phoneNumber: '801-555-5555',
        email: 'scott@grow.com',
        title: 'Master runner',
        'friends.length': 5
      },
      {
        firstName: 'Burt',
        lastName: 'Macklin',
        phoneNumber: '801-555-5555',
        email: 'burt@fbi.gov'
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
        'friends.length': 6
      }
    ];

    const tableData         = jsonToTable(jsonData, {defaultVal: undefined, checkKeyBeforePath: true}),
        expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'title', 'friends.length'],
          ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 'Master runner', 5],
          ['Burt', 'Macklin', '801-555-5555', 'burt@fbi.gov', undefined, undefined],
          ['Ron', 'Swanson', '801-555-5555', 'ron@pawnee.gov', undefined, 6]];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should work as you would expect on a plain object', function () {

    const jsonData = {
      firstName: 'Scott',
      lastName: 'Hillman',
      phoneNumber: '801-555-5555',
      email: 'scott@grow.com',
      title: 'Master runner'
    };

    const tableData         = jsonToTable(jsonData),
        expectedTableData = [['firstName', 'lastName', 'phoneNumber', 'email', 'title'],
          ['Scott', 'Hillman', '801-555-5555', 'scott@grow.com', 'Master runner']
        ];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should be able to resolve the path or key even with multiple dots in the name.', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        contact: {
          'phone.number': '801-999-8626'
        }
      },
      {
        firstName: 'Burt',
        contact: {
          'home.address': 'The Pentagon'
        }
      }
    ];

    const tableData         = jsonToTable(jsonData, {defaultVal: undefined, checkKeyBeforePath: true}),
        expectedTableData = [['firstName', 'contact.`phone.number`', 'contact.`home.address`'],
          ['Scott', '801-999-8626', undefined],
          ['Burt', undefined, 'The Pentagon']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should be able to resolve the path or key even with multiple dots in the name2.', function () {
    const jsonData = [
      {
        firstName: 'Scott',
        'phone.number': '801-999-8626'
      },
      {
        firstName: 'Burt',
        '.ba`d': 'The Pentagon'
      }
    ];

    const tableData         = jsonToTable(jsonData, {defaultVal: undefined, checkKeyBeforePath: true}),
        expectedTableData = [['firstName', 'phone.number', '.ba`d'],
          ['Scott', '801-999-8626', undefined],
          ['Burt', undefined, 'The Pentagon']];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should handle when a nested array has data for 1 object, but is null (which means is a leaf) in another object - keeping old behavior to not break the 80,000 existing metrics', function () {
    const jsonData = [
      {
        id: 1,
        occupation: 'web developer',
        contact: {
          firstName: 'Scott',
          lastName: 'Hillman',
          phoneNumber: '801-555-5555',
          email: 'scott@grow.com'
        }
      },
      {
        id: 2,
        contact: {
          phoneNumber: '801-555-5555',
          email: 'burt@fbi.gov',
          friends: ['joey']
        }
      },
      {
        occupation: 'government emp',
        contact: {
          firstName: 'Ron',
          lastName: 'Swanson',
          friends: null
        }
      }
    ];

    const tableData         = jsonToTable(jsonData, {excludeSubArrays: true}),
        expectedTableData = [['id', 'occupation',    'contact.firstName', 'contact.lastName', 'contact.phoneNumber',  'contact.email', 'contact.friends'],
                            [1,     'web developer', 'Scott',             'Hillman',          '801-555-5555',         'scott@grow.com',''],
                            [2,     '',              '',                  '',                 '801-555-5555',         'burt@fbi.gov',  ['joey']],
                            ['',    'government emp','Ron',               'Swanson',          '',                     '',              null]];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should handle when an array has data for 1 object, but is a primitive (which means is a leaf) in another object - keeping old behavior to not break the 80,000 existing metrics', function () {
    const jsonData = [
      {
        id: 1,
        friends: ['joey']
      },
      {
        id: 2,
        friends: true
      }
    ];

    const tableData1         = jsonToTable(jsonData, {excludeSubArrays: true});
    const expectedTableData1 = [['id', 'friends'], [1, ['joey']], [2, true]];

    const tableData2         = jsonToTable(jsonData);
    const expectedTableData2 = [['id', 'friends.0', 'friends'],
                                [1,    'joey',      ['joey']],
                                [2,    '',          true]];

    assert(_.isEqual(tableData1, expectedTableData1));
    assert(_.isEqual(tableData2, expectedTableData2));
  });

  it('Should handle when a nested object has data for 1 object, but is a primitive (which means is a leaf) in another object', function () {
    const jsonData = [
      {
        id: 1,
        friends: {name: 'joey'}
      },
      {
        id: 2,
        friends: 5
      }
    ];

    const tableData1         = jsonToTable(jsonData, {excludeSubArrays: true});
    const expectedTableData1 = [['id', 'friends.name', 'friends'],
      [1, 'joey', {name: 'joey'}],
      [2, '', 5]];

    const tableData2         = jsonToTable(jsonData);
    const expectedTableData2 = [['id', 'friends.name', 'friends'],
      [1, 'joey', {name: 'joey'}],
      [2, '', 5]];

    assert(_.isEqual(tableData1, expectedTableData1));
    assert(_.isEqual(tableData2, expectedTableData2));
  });


});
