var assert      = require('chai').assert,
    mocha       = require('mocha'),
    _           = require('lodash'),
    jsonToTable = require('../');

describe('Basic usage', function() {

  it('Should take a simple array of JSON objects and create a simple table', function() {
    var jsonData = [
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

    var tableData = jsonToTable(jsonData);
    var expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com' ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov' ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov' ] ];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take a array of JSON object with nested properties and create a table', function() {
    var jsonData = [
      {
        id: 1,
        occupation: 'web developer',
        contact : {
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
        },
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

    var tableData         = jsonToTable(jsonData),
        expectedTableData = [ [ 'id', 'occupation',          'contact.firstName', 'contact.lastName', 'contact.phoneNumber', 'contact.email' ],
                              [ 1,    'web developer',       'Scott',             'Hillman',          '801-555-5555',        'scott@grow.com' ],
                              [ 2,    'fbi agent',           'Burt',              'Macklin',          '801-555-5555',        'burt@fbi.gov' ],
                              [ 3,    'government employee', 'Ron',               'Swanson',          '801-555-5555',        'ron@pawnee.gov' ] ]

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array of non-homogenous JSON objects and create a table', function() {
    var jsonData = [
      {
        id: 1,
        occupation: 'web developer',
        contact : {
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
        },
      },
      {
        occupation: 'government employee',
        contact: {
          firstName: 'Ron',
          lastName: 'Swanson',
        }
      }
    ];

    var tableData         = jsonToTable(jsonData),
        expectedTableData = [ [ 'id', 'occupation',          'contact.firstName', 'contact.lastName', 'contact.phoneNumber', 'contact.email' ],
                              [ 1,    'web developer',       'Scott',             'Hillman',          '801-555-5555',        'scott@grow.com' ],
                              [ 2,    '',                    '',                  '',                 '801-555-5555',        'burt@fbi.gov' ],
                              [ '',   'government employee', 'Ron',               'Swanson',          '',                    '' ] ]

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array with sub-arrays and include the length of that array', function() {
     var jsonData = [
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

    var tableData = jsonToTable(jsonData, { includeCollectionLength: true });
        expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email',          'friends.length', 'friends.0', 'friends.1', 'friends.2', 'friends.3', 'friends.4', 'friends' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com', 5,                'Trent',     'Andrew',    'Joey',      'Ryan',      'Rob',       [ 'Trent',   'Andrew',     'Joey', 'Ryan', 'Rob' ] ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov',   2,                'April',     'Leslie',    '',          '',          '',          [ 'April',   'Leslie' ] ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov', 0,                '',          '',          '',          '',          '',          [] ] ];
    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take an array with sub-arrays and include the length of that array, but not include the array itself', function() {
     var jsonData = [
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

    var tableData = jsonToTable(jsonData, { includeCollectionLength: true, excludeSubArrays: true }),
        expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email',          'friends.length' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com', 5 ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov',   2 ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov', 1 ] ];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should properly handle a default value', function() {
     var jsonData = [
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
        email: 'burt@fbi.gov',
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
      }
    ];

    var tableData = jsonToTable(jsonData, { defaultVal: 'None' }),
        expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email',          'title' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com', 'Master runner' ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov',   'None' ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov', 'None' ] ];

    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should take undefined as a valid default value', function() {
     var jsonData = [
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
        email: 'burt@fbi.gov',
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
      }
    ];

    var tableData = jsonToTable(jsonData, { defaultVal: undefined }),
        expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email',          'title' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com', 'Master runner' ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov',   undefined ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov', undefined ] ];


    assert(_.isEqual(tableData, expectedTableData));
  });

  it('Should treat strings surround with tick marks as column name, not as a path', function() {
     var jsonData = [
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
        email: 'burt@fbi.gov',
      },
      {
        firstName: 'Ron',
        lastName: 'Swanson',
        phoneNumber: '801-555-5555',
        email: 'ron@pawnee.gov',
        'friends.length': 6
      }
    ];

    var tableData = jsonToTable(jsonData, { defaultVal: undefined, checkKeyBeforePath: true }),
        expectedTableData = [ [ 'firstName', 'lastName', 'phoneNumber',  'email',          'title',         'friends.length' ],
                              [ 'Scott',     'Hillman',  '801-555-5555', 'scott@grow.com', 'Master runner', 5 ],
                              [ 'Burt',      'Macklin',  '801-555-5555', 'burt@fbi.gov',   undefined,       undefined ],
                              [ 'Ron',       'Swanson',  '801-555-5555', 'ron@pawnee.gov', undefined,       6 ] ];

    assert(_.isEqual(tableData, expectedTableData));
  });
});
