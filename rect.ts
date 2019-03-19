
class Rect{

    constructor(public min:Vector, public max:Vector){
    }

    static fromPosSize(pos:Vector, size:Vector){
        return new Rect(pos,pos.c().add(size))
    }

    static fromWidthHeight(width:number,height:number,pos:Vector):Rect{
        var halfwidth = width/2
        var halfheight = height/2
        return new Rect(new Vector(-halfwidth,-halfheight), new Vector(halfwidth,halfheight))
    }

    c(){
        return new Rect(this.min.c(),this.max.c())
    }

    collidePoint(point:Vector){
        
        for (var i = 0; i < this.min.vals.length; i++) {
			if (!inRange(this.min.vals[i], this.max.vals[i], point.vals[i])) {
				return false;
			}
		}
		return true;
    }

    size():Vector{
        return this.min.to(this.max)
    }

    collideBox(other:Rect){
        for(var i = 0; i < 2; i++){
			if(!rangeOverlap(this.min[i], this.max[i], other.min[i], other.max[i])){
				return false;
			}
		}
		return true;
    }


    getPoint(relativePos:Vector):Vector{
        return this.min.c().add(this.size().mul(relativePos))
    }

    left(){
        return this.getPoint(new Vector(0,0.5))
    }

    right(){
        return this.getPoint(new Vector(1,0.5))
    }

    top(){
        return this.getPoint(new Vector(0.5,0))
    }

    bot(){
        return this.getPoint(new Vector(0.5,1))
    }

    center(){
        return this.getPoint(new Vector(0.5,0.5))
    }

    draw(ctxt:CanvasRenderingContext2D){
       var size = this.size()
       ctxt.fillRect(this.min.x,this.min.y,size.x,size.y)
    }

    move(pos:Vector):Rect{
        var size = this.size()
        this.min = pos
        this.max = this.min.c().add(size)
        return this
    }

    moveEdgeTo(to:Vector,relpos:Vector):Rect{
        var from = this.getPoint(relpos)
        var diff = from.to(to)
        this.add(diff)
        return this
    }

    add(pos:Vector){
        this.min.add(pos)
        this.max.add(pos)
        return this
    }

    loop(callback:(v:Vector)=>void){
        var temp = this.max.c()
        

        this.size().loop(v2 => {
            temp.overwrite(v2)
            temp.add(this.min)
            callback(temp)
        })
    }
}

function rangeOverlap(range1A:number,range1B:number,range2A:number,range2B:number){
    return range1A <= range2B && range2A <= range1B
}