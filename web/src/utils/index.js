export const errorCapture = async (asyncFunc, ...params) => {
    try {
        const res = await asyncFunc(...params);
        return [null, res];
    } catch (error) {
        return [error];
    }
};
