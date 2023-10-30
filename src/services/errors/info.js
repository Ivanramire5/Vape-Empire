
export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
        List of required properties:
        * first_name: need to be a String, received ${user.first_name}
        * last_name: need to be a String, received ${user.last_name}
        * email: need to be a String, received ${user.email}
    `
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
        List of required properties:
        * first_name: need to be a String, received ${product.title}
        * last_name: need to be a String, received ${product.code}
        * email: need to be a String, received ${product.description}
    `
}