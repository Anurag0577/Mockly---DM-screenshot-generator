class apiError extends Error {
    // this constructor will create a new object, whenever we call new keyword
    constructor( statusCode, message = "Something went wrong!", error = []) {
        super(message); // we are saying, hey parant take 'message' and do whatever you need to do or you generally do
        this.statusCode = statusCode,
        this.message = message,
        this.error = error,
        this.data = null
        this.success = false // generally set to false
        
        // The call stack in JavaScript is a data structure that follows the Last In, First Out (LIFO) principle. It tracks the execution of functions, pushing a function onto the stack when it’s called and popping it off when it completes.It shows which functions are currently executing by maintaining the order of function calls.

        // A stack trace is indeed a snapshot of the call stack at a specific moment, typically when an error is thrown. It lists the sequence of function calls leading to that point, including file names, line numbers, and function names.
        if(this.stack){
            this.stack = this.stack
        } else{
            // Error.captureStackTrace(this, this.constructor) captures the current call stack and attaches it to the stack property of the current error instance (this). The this keyword refers to the instance of the error (e.g., an instance of apiError in your previous context). The this.constructor argument ensures the stack trace excludes the constructor function itself (e.g., apiError’s constructor), making the trace cleaner by starting from the point where the error was thrown.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {apiError};