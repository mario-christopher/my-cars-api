export const notFound = (req, res, next) => {
    res.status(404).send(`'${req.originalUrl}' does not exist`);
}