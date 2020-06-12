export function typeCheck(arg) {
    switch(Object.prototype.toString.call(arg)){
        case '[object Object]':
            return 'Object'
        case '[object Number]':
            return 'Number'
        case '[object String]':
            return 'String'
        case '[object Undefined]':
            return 'Undefined'
        case '[object Null]':
            return 'Null'
        case '[object Array]':
            return 'Array'
        case '[object Function]':
            return 'Function'
    }    
}