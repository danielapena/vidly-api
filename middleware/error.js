module.exports = function (err, req, res, next) {
    // TODO: Log the exception
    res.status(500).send("Something failed.")
}