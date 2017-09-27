export const logUrl = (req, res, next) => {
    console.log(`${req.originalUrl}`)
    next();
}