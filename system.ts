
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

    leftAttachment(){
        return this.box.getPoint(new Vector(0,0.5))
    }

    rightAttachment(){
        return this.box.getPoint(new Vector(1,0.5))
    }
}

function Diagram(holder:System,systems:System[]):void{
    holder.drawroutine = (ctxt,pos) => {

    }
    mergeSystems(holder, systems)
    holder.begin.begin()
    holder.end.end()
}

function optional(system:System):System{
    var res = new System()
    res.begin.bind(res.end)
    res.begin.bind(system.begin)
    system.end.bind(system.end)
    return res
}

function choice(systems:System[]):System{
    var res = new System()
    for(var system of systems){
        append(res.begin.edges, system.begin.edges)
        res.end.pilfer(system.end)
    }
    return res
}

function plus(normal:System,repeat:System):System{
    normal.end.edges = repeat.begin.edges
    normal.begin.pilfer(repeat.end)
    return normal
}

function star(normal:System,repeat:System):System{
    return optional(plus(normal,repeat))
}

function mergeSystems(holder:System, systems:System[]){
    for(var i = 1; i < systems.length; i++){
        var left = systems[i - 1]
        var right = systems[i]
        right.begin.pilfer(left.end)
    }
    holder.begin.pilferOut(systems[0].begin)
    holder.end.pilfer(last(systems).end)
}

function terminal(edge:Edge):System{
    var res = new System()
    res.box = new Rect(new Vector(-10,-10), new Vector(10,10))
    res.drawroutine = (ctxt:CanvasRenderingContext2D,center:Vector) => {
        var absbox = res.box.c().add(center)
        line(ctxt,absbox.getPoint(new Vector(0,0.5)),absbox.getPoint(new Vector(1,0.5)))
        circle(ctxt,center,20)
    }

    res.begin.connect(edge,res.end)
    return res
}

function subsystem(system:System):System{
    var subsystem = new System()
    var newedge = Edge.highEdge(system.begin)
    subsystem.begin.connect(newedge,subsystem.end)
    return subsystem
}

function spaceSystems(begin,skip){
    
}