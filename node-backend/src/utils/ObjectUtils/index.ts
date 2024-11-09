export const objectUtils = {
    // Check if all required keys are present in an object
    hasRequiredKeys<T extends object>(obj: T, requiredKeys: Array<keyof T>): boolean {
        return requiredKeys.every(key => key in obj);
    },

};