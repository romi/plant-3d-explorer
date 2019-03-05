// from https://ourcodeworld.com/articles/read/317/how-to-check-if-a-javascript-promise-has-been-fulfilled-rejected-or-resolved

export function MakeQuerablePromise (promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise

  // Set initial state
  var isPending = true
  var isRejected = false
  var isFulfilled = false

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) {
      isFulfilled = true
      isPending = false
      return v
    },
    function (e) {
      isRejected = true
      isPending = false
      throw e
    }
  )

  result.isFulfilled = function () { return isFulfilled }
  result.isPending = function () { return isPending }
  result.isRejected = function () { return isRejected }
  return result
}
