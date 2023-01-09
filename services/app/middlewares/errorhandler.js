

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

        case "UNAUTHORIZED":
            status = 401
            message = "You can only update/delete your own art!"
            break;

        case "INVALID ORDER":
            status = 400
            message = "You may have placed a wrong order"
            break;

        case "INVALID INPUT":
            status = 400
            message = "You must insert the correct input"
            break;

        case "NO TOKEN":
            status = 401
            message = "Please login first"
            break;

        case "UNAUTHORIZED ORDER COMMAND":
            status = 401
            message = 'You can only pay/cancel your own order!'
            break;

        default:
            break;
    }

    // console.log(err);
    res.status(status).json({ status, message })
}


module.exports = errorHandler