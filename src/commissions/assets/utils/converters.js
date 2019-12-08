export const DateConverter = {
    fromAttribute: (value) => new Date(Date.parse(value)),
    toAttribute: (value) => value.toJSON()
}