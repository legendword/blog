const nullFunction = (msg) => {
    return;
}
const logger = process.env.NODE_ENV == 'development' ? console.log : nullFunction;
export default logger;