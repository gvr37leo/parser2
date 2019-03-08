
class System{
    begin:Knot
    end:Knot
    box:Rect
    leftanchor:Vector
    rightanchor:Vector
    subsSystems:System[] = []
    drawroutine:(ctxt:CanvasRenderingContext2D,pos:Vector) => void

    constructor(){
        this.begin = new Knot()
        this.end = new Knot()
    }

    draw(ctxt:CanvasRenderingContext2D,pos:Vector){
        this.drawroutine(ctxt,pos)
    }

    write(dst:System){
        dst.begin = this.begin
        dst.end = this.end
        dst.box = this.box
        dst.subsSystems = this.subsSystems
        dst.drawroutine = this.drawroutine
    }
}

function Diagram(holder:System,systems:System[]):void{
    var system = sequance(systems)
    var sequenceDrawRoutine = system.drawroutine
    system.write(holder)
    
    holder.drawroutine = (ctxt, pos) => {
        var absbox = holder.box.moveEdgeTo(pos, new Vector(0.5,0.5))
        sequenceDrawRoutine(ctxt,pos)
        vertline(ctxt,absbox.left(),20)
        vertline(ctxt,absbox.right(),20)
    }
    holder.begin.begin()
    holder.end.end()
}


function sequance(systems:System[]){
    var system = new System()
    var width = systems.reduce((p,c) => p + c.box.size().x,0)
    var height = Math.max(...systems.map(s => s.box.size().y))
    system.box = Rect.fromWidthHeight(width,height,new Vector(0,0))

    system.drawroutine = (ctxt,pos) => {
        var boxes = positionCenter(pos,0,systems.map(s => s.box))
        systems.forEach((system,i) => {
            system.draw(ctxt,boxes[i].center())
        })
    }
    mergeSystems(system, systems)
    return system
}

function optional(system:System):System{
    return choice([system,skip()])
}

function choice(systems:System[]):System{
    var res = new System()
    var height = systems.reduce((p,c) => p + c.box.size().y,0)
    var width = Math.max(...systems.map(s => s.box.size().x))
    res.box = Rect.fromWidthHeight(width + 50,height,new Vector(0,0))

    res.drawroutine = (ctxt,pos) => {
        var boxes = positionCenter(pos,1,systems.map(s => s.box))
        var absbox = res.box.c().moveEdgeTo(pos,new Vector(0.5,0.5))
        systems.forEach((system,i) => {
            system.draw(ctxt,boxes[i].center())
            line(ctxt,absbox.left(),boxes[i].left())
            line(ctxt,absbox.right(),boxes[i].right())
        })        
    }

    for(var system of systems){
        append(res.begin.edges, system.begin.edges)
        res.end.pilferLeft(system.end)
    }
    return res
}

function plus(normal:System,repeat:System):System{
    var res = new System()
    normal.write(res)
    // normal.box = Rect.boundingbox([normal.box, repeat.box.c().add(new Vector(0,30))])
    res.drawroutine = (ctxt,pos) => {
        normal.drawroutine(ctxt,pos)
        repeat.drawroutine(ctxt,pos.c().add(new Vector(0,30)))
        var normalabs = normal.box.c().add(pos)
        var repeatabs = repeat.box.c().add(pos).add(new Vector(0,30))
        line(ctxt,normalabs.right(),repeatabs.right())
        line(ctxt,normalabs.left(),repeatabs.left())
        
    }

    res.end.pilferRight(repeat.begin)
    res.begin.pilferLeft(repeat.end)
    return res
}

function star(normal:System,repeat:System):System{
    return optional(sequance([skip(),plus(normal,repeat),skip()]))//here
}

function mergeSystems(holder:System, systems:System[]){
    
    for(var i = 1; i < systems.length; i++){
        var left = systems[i - 1]
        var right = systems[i]
        right.begin.pilferFull(left.end)
    }
    holder.begin.pilferFull(systems[0].begin)
    holder.end.pilferFull(last(systems).end)
}

function terminal(edge:Edge):System{
    var res = new System()
    res.box = new Rect(new Vector(-30,-10), new Vector(30,10))
    res.drawroutine = (ctxt:CanvasRenderingContext2D,abscenter:Vector) => {
        var absbox = res.box.c().add(abscenter)
        
        ctxt.fillStyle = 'black'
        line(ctxt,absbox.left(),absbox.right())
        circle(ctxt,abscenter,10)
        ctxt.fillStyle = 'white'
        ctxt.fillText(edge.allowedSymbols.join(' '),abscenter.x,abscenter.y)
    }

    res.begin.connect(edge,res.end)
    return res
}

function skip(){
    return terminal(new Edge([]))   
}

function subsystem(system:System):System{//should behave similar to terminal
    var res = new System()
    res.box = new Rect(new Vector(-30,-10), new Vector(30,10))

    res.drawroutine = (ctxt:CanvasRenderingContext2D,abscenter:Vector) => {
        var absbox = res.box.c().add(abscenter)
        
        ctxt.fillStyle = 'black'
        line(ctxt,absbox.left(),absbox.right())
        circle(ctxt,abscenter,10)
        ctxt.fillStyle = 'white'
        ctxt.fillText('sub',abscenter.x,abscenter.y)
    }

    var edge = Edge.highEdge(system.begin)
    res.begin.connect(edge,res.end)
    return res
}

function positionCenter(center:Vector,dim:number,boxes:Rect[]){
    var width = boxes.reduce((p, c) => p + c.size().vals[dim], 0)
    var start = center.c()
    start.vals[dim] -= width / 2
    return spaceBlocks(start,0,dim,boxes)
}

function spaceBlocks(begin:Vector,skip:number,dim:number,rects:Rect[]):Rect[]{
    var result:Rect[] = []
    var current = begin
    var blockedge = dim == 0 ? new Vector(0,0.5) : new Vector(0.5,0)
    for(var rect of rects){
        
        var size = rect.size()
        var start = current
        
        var temp = rect.c().moveEdgeTo(start,blockedge)//todo
        result.push(temp)
        current.vals[dim] += size.vals[dim] + skip
    }
    return result
}

