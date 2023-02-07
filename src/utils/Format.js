export const checkPdfType = (type) => {
    var reg = /(pdf)$/
    return reg.test(type)
}

export const checkImageType = (type) => {
    var reg = /(png|jpg)$/
    return reg.test(type)
}
