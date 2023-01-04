

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

        case "INACTIVE ART":
            status = 400
            message = "You can only delete active arts"
            break;

        default:
            break;
    }

    // console.log(err);
    res.status(status).json({ message })
}


module.exports = errorHandler