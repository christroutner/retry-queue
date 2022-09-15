# retry-queue

This library is based on [p-queue](https://www.npmjs.com/package/p-queue) and [p-retry](https://www.npmjs.com/package/p-retry). It create a Queue for executing Promise-based functions. If the function fails, it will be automatically retried.

Executing promise-based functions and then needed to do an automatic retry if it fails, is an extremely common scenario is the software I write. I created this small library because I got tired of constantly re-writing this functionality.

This repository is forked from [npm-lib-boilerplate-esm](https://github.com/christroutner/npm-lib-boilerplate-esm).

## Installation
- `npm install --save-exact @chris.troutner/retry-queue`

## Environment
- node.js v16+

## Example
This provides a simple example of how to use this retry queue.

`longRunningProcess()` is a Promise-based function. It lasts for 2-5 seconds and
it has a 25% change of failing.

A new `longRunningProcess()` is added to the queue as soon as the previous one
completes. `Await`ing on the queue will wait until the queue is empty before
adding a new task. If the `await` is omitted, all processes will be added
immediately and the Queue is allowed to work according concurrency setting.

```javascript
// Include the library.
import RetryQueue from '@chris.troutner/retry-queue'

// Retry-Queue settings:
const options = {
  concurrency: 1,
  attempts: 5,
  retryPeriod: 1000
}
const retryQueue = new RetryQueue(options)

// Example function.
async function retryQueueExample () {
  try {
    // Generate 10 processes.
    const processCount = 10
    for (let i = 0; i < processCount; i++) {
      // Dummy data to pass to the function.
      const now = new Date()
      const processObj = {
        index: i,
        startedOn: now.toLocaleString()
      }

      // Add the process to the queue
      await retryQueue.addToQueue(longRunningProcess, processObj)
    }
  } catch (err) {
    console.error('Error in retryQueueExample(): ', err)
  }
}
retryQueueExample()

// A long-running, Promise-based function
// It will run between 2-5 seconds.
// It has a 25% chance of throwing an error.
async function longRunningProcess (inObj = {}) {
  // Wait for 2 seconds.
  await retryQueue.sleep(2000)

  const rndNum1 = Math.random()
  const rndNum2 = 3 * Math.random()

  // 25% chance of failing
  if (rndNum1 < 0.25) throw new Error('longRunningProcess() failed')

  // Wait an additional 0-3 seconds
  await retryQueue.sleep(rndNum2)

  console.log(`longRunningProcess() ${inObj.index} completed with input object ${JSON.stringify(inObj, null, 2)}`)

  return true
}
```

# Licence

[MIT](LICENSE.md)
