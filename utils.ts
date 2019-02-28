
function last<T>(arr:T[]){
    return arr[arr.length - 1]
}

function append<T>(arr:T[],other:T[]){
    for(var item of other){
        arr.push(item)
    }
    return arr
}