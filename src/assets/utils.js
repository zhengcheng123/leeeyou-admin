function pennyToDollar(dollar) {
    return dollar / 100
}

function getWeight(kg) {
    return kg / 1000
}

function renderTime(timestamp) {
    if (!timestamp) {
        return ''
    }
    let date = new Date(timestamp * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let time = date.toLocaleTimeString('en-US', { hour12: false })
    return `${year}年${month}月${day}日${time}`
}

function renderStateLabel(states, state) {
    for (let item of states) {
        if (item.value === state) {
            return item.label
        }
    }
    return '未知'
}

function validateInteger(rule, value, callback) {
    if (value === '' && rule.required) {
        callback(new Error(rule.firstMessage))
    } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
    } else if (value <= 0 && !rule.enableZero) {
        return callback(new Error('请输入大于零的数字'))
    } else if (/\./.test(value)) {
        return callback(new Error('请输入整数'))
    } else {
        callback()
    }
}

function validatePrice(rule, value, callback) {
    if (value === '' && rule.required) {
        callback(new Error(rule.firstMessage))
    } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字'))
    } else if (value <= 0) {
        return callback(new Error('请输入大于零的金额'))
    } else if (/\./.test(value) && !/\.\d{2}$/.test(value)) {
        callback(new Error('小数点后需输入两位'))
    } else {
        callback()
    }
}

export {
    pennyToDollar,
    renderTime,
    renderStateLabel,
    validateInteger,
    validatePrice,
    getWeight
}