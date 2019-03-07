var Tau = Math.PI * 2
function last<T>(arr:T[]){
    return arr[arr.length - 1]
}

function append<T>(arr:T[],other:T[]){
    for(var item of other){
        arr.push(item)
    }
    return arr
}

function circle(ctxt:CanvasRenderingContext2D,pos:Vector,size:number){
    ctxt.beginPath()
    ctxt.ellipse(pos.x,pos.y,size,size,0,0,Tau)
    ctxt.fill()
}

function vertline(ctxt:CanvasRenderingContext2D,center:Vector,length:number){
    var top = center.c()
    top.y += length / 2
    var bot = center.c()
    bot.y -= length / 2
    line(ctxt,top,bot)
}