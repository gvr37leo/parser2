
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
    var system = sequence(systems)
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


function sequence(systems:System[]){
    var system = new System()
    var boxes = positionCenter(new Vector(0,0),0,0,systems.map(s => s.box))
    system.box = boundingBox(boxes)

    system.drawroutine = (ctxt,pos) => {
        // var boxesabs = boxes.map(box => box.c().add(pos))
        systems.forEach((system,i) => {
            // system.draw(ctxt,boxesabs[i].center())//dont draw system at system centered on center but centered at systems origin
            // new Vector()
            system.draw(ctxt,pos.c().add(boxes[i].center()))
            // system.draw(ctxt,pos)
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
    var boxes = positionCenter(new Vector(0,0),1,10,systems.map(s => s.box))
    res.box = boundingBox(boxes)
    res.box.min.x -= 10
    res.box.max.x += 10

    res.drawroutine = (ctxt,pos) => {
        var boxesabs = boxes.map(box => box.c().add(pos))
        var systemboxabs = res.box.c().add(pos)
        systems.forEach((system,i) => {
            system.draw(ctxt,boxesabs[i].center())
            line(ctxt,boxesabs[i].left(),systemboxabs.left())
            line(ctxt,boxesabs[i].right(),systemboxabs.right())
        })        
    }

    for(let system of systems){
        append(res.begin.edges, system.begin.edges)
        res.end.pilferLeft(system.end)
    }
    return res
}

function plus(normal:System,repeat:System):System{
    var res = new System()
    normal.write(res)
    
    // positionCenter(new Vector())
    var boxes = positionLinearVertical(new Vector(0,0),[
        normal.box,
        repeat.box,
    ])
    res.box = boundingBox(boxes)
    res.drawroutine = (ctxt,pos) => {
        var boxesabs = boxes.map(box => box.c().add(pos))
        normal.drawroutine(ctxt,boxesabs[0].center())
        repeat.drawroutine(ctxt,boxesabs[1].center())
        line(ctxt,boxesabs[0].right(),boxesabs[1].right())
        line(ctxt,boxesabs[0].left(),boxesabs[1].left())
        
    }

    res.end.pilferRight(repeat.begin)
    res.begin.pilferLeft(repeat.end)
    return res
}

function star(normal:System,repeat:System):System{
    return optional(sequence([skip(),plus(normal,repeat),skip()]))//here
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

function skip(){
    var edge = new Edge([])
    edge.isWhitelist = false
    var res = terminal(edge)
    res.box = Rect.fromWidthHeight(60,20,new Vector(0,0))
    res.drawroutine = (ctxt:CanvasRenderingContext2D,abscenter:Vector) => {
        var absbox = res.box.c().add(abscenter)
        ctxt.fillStyle = 'black'
        line(ctxt,absbox.left(),absbox.right())
    }
    return  res
}

function simpleTerminal(symbol:string){
    return terminal(new Edge([symbol]))
}

function terminal(edge:Edge):System{
    var res = new System()
    res.box = Rect.fromWidthHeight(60,20,new Vector(0,0))
    res.drawroutine = (ctxt:CanvasRenderingContext2D,abscenter:Vector) => {
        var absbox = res.box.c().add(abscenter)
        drawtextnode(ctxt,absbox,(edge.isWhitelist ? '' : '!') + edge.symbols.join(' '))
    }

    res.begin.connect(edge,res.end)
    return res
}

function subsystem(system:System):System{
    var res = new System()
    res.box = Rect.fromWidthHeight(60,20,new Vector(0,0))

    res.drawroutine = (ctxt:CanvasRenderingContext2D,abscenter:Vector) => {
        var absbox = res.box.c().add(abscenter)
        drawtextnode(ctxt,absbox,'sub')
    }

    var edge = Edge.highEdge(system)
    res.begin.connect(edge,res.end)
    return res
}

function drawtextnode(ctxt:CanvasRenderingContext2D,absbox:Rect,text:string){
    var abscenter = absbox.center()
    ctxt.fillStyle = 'black'
    line(ctxt,absbox.left(),absbox.right())
    circle(ctxt,abscenter,10)
    ctxt.fillStyle = 'white'
    ctxt.fillText(text,abscenter.x,abscenter.y)
}

function boundingBox(blocks:Rect[]):Rect{
    var minheight = findbest(blocks.map(b => b.min.y),v => -v)
    var maxheight = findbest(blocks.map(b => b.max.y),v => v)
    var minwidth = findbest(blocks.map(b => b.min.x),v => -v)
    var maxwidth = findbest(blocks.map(b => b.max.x),v => v)
    return new Rect(new Vector(minwidth,minheight), new Vector(maxwidth,maxheight))
}

function positionCenter(center:Vector,dim:number,margin:number,boxes:Rect[]):Rect[]{
    var width = blockrowwidth(boxes,margin,dim)
    var start = center.c()
    start.vals[dim] -= width / 2
    return spaceBlocks(start,margin,dim,boxes)
}

function positionLinearVertical(start:Vector, boxes:Rect[]):Rect[]{
    var offsetstart = new Vector(0,0 - boxes[0].size().y / 2)
    return spaceBlocks(offsetstart,0,1,boxes)
}

function blockrowwidth(boxes:Rect[],skip:number,dim:number){
    var width = boxes.reduce((p, c) => p + c.size().vals[dim], 0)
    return width + (boxes.length - 1) * skip
}

function spaceBlocks(begin:Vector,skip:number,dim:number,rects:Rect[]):Rect[]{
    var result:Rect[] = []
    var current = begin
    for(var rect of rects){
        var topleft = new Vector(0,0)
        topleft.vals[dim] = current.vals[dim]
        topleft.vals[1-dim] = rect.min.vals[1 - dim]
        var newrect = Rect.fromPosSize(topleft, rect.size())
        // var newrect = Rect.fromPosSize(new Vector(current.x,rect.min.y), rect.size())//works only for horinzontal
        // var newrect = Rect.fromPosSize(new Vector(rect.min.x,current.y), rect.size())//works only for vertical
        result.push(newrect)
        current.vals[dim] += rect.size().vals[dim] + skip
    }
    return result
}

