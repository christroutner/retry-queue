# retry-queue

This library is based on [p-queue](https://www.npmjs.com/package/p-queue) and [p-retry](https://www.npmjs.com/package/p-retry). It create a Queue for executing Promise-based functions. If the function fails, it will be automatically retried.

Executing promise-based functions and then needed to do an automatic retry if it fails, is an extremely common scenario is the software I write. I created this small library because I got tired of constantly re-writing this functionality.

This repository is forked from [npm-lib-boilerplate-esm](https://github.com/christroutner/npm-lib-boilerplate-esm).

# Licence

[MIT](LICENSE.md)
