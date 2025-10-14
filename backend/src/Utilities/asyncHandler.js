// const asyncHandler = (fn) => async(req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => next(err)); 

// }

// export default asyncHandler;


// fn basically a api function (async route handler)
function asyncHandler(fn){
    return function(req, res, next){ // this is the function that nodejs normally/generally call
        // WHY WE ARE PASSING OUR ASYNC HANDLER IN THIS PROMISE.RESOLVE. THIS JUST ENSURE THAT WHATEVAR THAT FUNCTION RETURN WILL BE A PROMISE, AND IF IT IS RETURNING ERROR THEN IT WILL REJECT IT AND CATCH WILL CATCH IT AND SEND IT TO ERROR HANDLING MIDDLEWARE
        Promise.resolve(fn(req, res, next)).catch(function(error){ 
            next(error)
        })
    }
}

export {asyncHandler};