class apiResponse{
    constructor( // to create a new responce object
        statusCode,
        message = "Success", // default message
        data
    ){
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.success = statusCode >= 200 && statusCode < 300;
    }
}



export {apiResponse};