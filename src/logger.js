const nullFunction = () => {
    return;
};
const logger = import.meta.env.DEV ? console.log : nullFunction;
export default logger;
