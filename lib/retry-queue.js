/*
  This library leverages the p-retry and p-queue libraries, to create a
  queue with automatic retry.

  The addToQueue() is the main function provided by this library.

  There are three user-configurable parameters:
  - concurrency is number of concurrent processes.
  - attempts is the number of retry attempts before finally throwing an error.
  - retryPeriod is the amount of time to wait between retries, in milliseconds.
*/

// Global npm libraries.
import PQueue from 'p-queue'
import pRetry from 'p-retry'

class RetryQueue {
  constructor (localConfig = {}) {
    // Default values
    let concurrency = 1
    this.attempts = 5
    this.retryPeriod = 5000

    // Allow user to override defaults
    if (localConfig.concurrency) concurrency = localConfig.concurrency
    if (localConfig.attempts || localConfig.attempts === 0) this.attempts = localConfig.attempts
    if (localConfig.retryPeriod) this.retryPeriod = localConfig.retryPeriod
    // if(localConfig.timeout) this.timeout = localConfig.timeout

    // Encapsulate dependencies
    if (localConfig.timeout) {
      this.validationQueue = new PQueue({ concurrency, timeout: localConfig.timeout })
    } else {
      this.validationQueue = new PQueue({ concurrency })
    }

    this.pRetry = pRetry

    // Bind 'this' object to subfunctions.
    this.addToQueue = this.addToQueue.bind(this)
    this.retryWrapper = this.retryWrapper.bind(this)
    this.handleValidationError = this.handleValidationError.bind(this)
  }

  // Add an async function to the queue, and execute it with the input object.
  async addToQueue (funcHandle, inputObj) {
    try {
      // console.log('addToQueue inputObj: ', inputObj)

      if (!funcHandle) {
        throw new Error('function handler is required')
      }
      if (!inputObj) {
        throw new Error('input object is required')
      }

      const returnVal = await this.validationQueue.add(() =>
        this.retryWrapper(funcHandle, inputObj)
      )
      return returnVal
    } catch (err) {
      console.error('Error in addToQueue(): ', err)
      throw err
    }
  }

  // Wrap the p-retry library.
  // This function returns a promise that will resolve to the output of the
  // function 'funcHandle'.
  async retryWrapper (funcHandle, inputObj) {
    try {
      // console.log('retryWrapper inputObj: ', inputObj)

      if (!funcHandle) {
        throw new Error('function handler is required')
      }
      if (!inputObj) {
        throw new Error('input object is required')
      }
      // console.log('Entering retryWrapper()')

      // Add artificial delay to prevent 429 errors.
      // await this.sleep(this.retryPeriod)

      return this.pRetry(
        async () => {
          return await funcHandle(inputObj)
        },
        {
          onFailedAttempt: this.handleValidationError,
          retries: this.attempts // Retry 5 times
        }
      )
    } catch (err) {
      console.error('Error in retryWrapper(): ', err)
      throw err
    }
  }

  // Notifies the user that an error occured and that a retry will be attempted.
  // It tracks the number of retries until it fails.
  async handleValidationError (error) {
    try {
      console.log('Error object: ', error)

      const errorMsg = `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left. Waiting before trying again.`
      console.log(errorMsg)

      const SLEEP_TIME = this.retryPeriod
      console.log(`Waiting ${SLEEP_TIME} milliseconds before trying again.\n`)
      await this.sleep(SLEEP_TIME) // 30 sec
    } catch (err) {
      console.error('Error in handleValidationError()')
      throw err
    }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
export default RetryQueue
