
class System{
    begin:Knot
    end:Knot
    box:Rect
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
    system.write(holder)
    holder.begin.begin()
    holder.end.end()
}

function sequance(systems:System[]){
    var system = new System()
    var width = systems.reduce((p,c) => p + c.box.size().x,0)
    var height = Math.max(...systems.map(s => s.box.size().y))
    system.box = Rect.fromWidthHeight(width + 40,height,new Vector(0,0))

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
    return choice([system,terminal(new Edge([]))])
}

function choice(systems:System[]):System{
    debugger
    var res = new System()
    var height = systems.reduce((p,c) => p + c.box.size().y,0)
    var width = Math.max(...systems.map(s => s.box.size().x))
    res.box = Rect.fromWidthHeight(width + 40,height,new Vector(0,0))

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
    normal.end.edges = repeat.begin.edges//?
    normal.begin.pilferLeft(repeat.end)
    return normal
}

function star(normal:System,repeat:System):System{
    return optional(plus(normal,repeat))
}

function mergeSystems(holder:System, systems:System[]){
    for(var i = 1; i < systems.length; i++){
        var left = systems[i - 1]
        var right = systems[i]
        right.begin.pilferLeft(left.end)
    }
    holder.begin.pilferRight(systems[0].begin)
    holder.end.pilferLeft(last(systems).end)
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

function subsystem(system:System):System{//should behave similar to terminal
    var subsystem = new System()
    var newedge = Edge.highEdge(system.begin)
    subsystem.begin.connect(newedge,subsystem.end)
    return subsystem
}

function positionCenter(center:Vector,dim:number,boxes:Rect[]){
    var width = boxes.reduce((p, c) => p + c.size().vals[dim], 0)
    var temp = center.c()
    temp.vals[0] -= width / 2
    return spaceBlocks(temp,0,dim,boxes)
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