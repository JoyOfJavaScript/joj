# Source code for Joy of JavaScript
The book uses two projects:

## Chapter-listings
Contains code for each code listing by name. Each one of them runs as its own, isolated unit test. 

~~~
npm test src/ch02/2-1.js
~~~

Or run all: 

~~~
npm test src/ch02/2-1.js
~~~

## Blockchain
Builds pieces of a simple blockchain, transaction management system. You can run each test individually:

~~~
npm test test/TransferFunds.spec.js 
~~~

Or run all: 
~~~
npm run test-all
~~~
