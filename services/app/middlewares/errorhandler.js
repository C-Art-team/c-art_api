

const errorHandler = (err, req, res, next) => {

    let status = 500
    let message = "Internal Server Error"
    
    switch (err.name) {
        case "NOT FOUND":
            status = 404
            message = "not found"
            break;
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400
            message = err.errors[0].message
            break;

        default:
            break;
    }


    res.status(status).json({message})
}


module.exports = errorHandler