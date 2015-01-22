json-to-table converts an array of Javascript objects into a table format.

The column headers are all the possible "leaves" of the javascript objects.


##Install
```
npm install node-to-table
```

##Usage
```Javascript
var jsonToTable = require('json-to-table');

var myRecords = [
{
    name:'Bob',
    address:{zip:12345, state:'Euphoria'}
},
{
    name:'Jon',
    address:{street:'1234 Main St.', state:'Arizona'}
}];
var tabled = jsonToTable(myRecords);

//tabled will be an array of arrays like this
//[
//['name', 'address.zip', 'address.state', 'address.street'],
//['Bob', 12345, 'Euphoria', ''],
//['Jon', '', '1234 Main St.', 'Arizona']
//]
```

##Notes
If a particular object did not have the key/value that another one did, the default will be an empty string. 
You can change the default value by passing that in as the second parameter of the function call. 
If you explicitly pass ```Javascript undefined``` in as the second value, your defaults will be undefined.

```Javascript
var jsonToTable = require('json-to-table');

var myRecords = [
{
    name:'Bob',
    address:{zip:12345, state:'Euphoria'}
},
{
    name:'Jon',
    address:{street:'1234 Main St.', state:'Arizona'}
}];
var tabled = jsonToTable(myRecords, 'MY_DEFAULT_STR!!');

//tabled will be an array of arrays like this
//[
//['name', 'address.zip', 'address.state', 'address.street'],
//['Bob', 12345, 'Euphoria', 'MY_DEFAULT_STR!!'],
//['Jon', 'MY_DEFAULT_STR!!', '1234 Main St.', 'Arizona']
//]
```

Also note that in this example, the address.zip was a number, and stayed a number. 


## License (ISC)
Copyright (c) 2015, Scott Hillman <hillmanov@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
