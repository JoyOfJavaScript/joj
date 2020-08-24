# Source code for Joy of JavaScript (JoJ)
The book uses two projects:

## Blockchain
Builds pieces of a simple blockchain, transaction management system. You can run all tests:

~~~
npm run test-all
~~~

## Chapter-listings
This project contains code for each code listing by name. This project depends on building the *blockchain* project. If you haven't done so, please run:
~~~
npm run build
~~~

for the *blockchain* project before running all tests in *chapter-listings*

You can run all tests:

~~~
npm run test-all
~~~

## Note: 
You can run each file individually, but you must first use Babel to transpile the file. Then you can use *mocha* to execute the test. 