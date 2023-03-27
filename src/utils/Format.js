export const checkPdfType = (type) => {
    var reg = /(pdf)$/
    return reg.test(type)
}

export const checkImageType = (type) => {
    var reg = /(png|jpg)$/
    return reg.test(type)
}

export class Timer{
    static year = (timeStamp) => new Date(Number(timeStamp)).getFullYear() 
    static month = (timeStamp) => new Date(Number(timeStamp)).getMonth() 
    static day = (timeStamp) => new Date(Number(timeStamp)).getDay() 
    static timestamp(date){ date??=new Date(); return date.timestamp;  }
}