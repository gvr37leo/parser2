enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}
enum EdgeType{normal = 'normal',high = 'high', entering = 'entering', exiting = 'exiting'}

class Edge{
    edgeType:EdgeType = EdgeType.normal
    origin:Knot
    target:Knot
    subsystem:Knot
    constructor(public allowedSymbols:string[]){

    }

    static highEdge(subsystem:Knot){
        var newedge = new Edge([])
        newedge.edgeType = EdgeType.high
        newedge.subsystem = subsystem
        return newedge
    }

    checkValidity(){
        return this.target.edgesIn.findIndex(e => e == this) != -1 &&
        this.origin.edges.findIndex(e => e == this) != -1
    }
}

class Knot{
    edges:Edge[] = []
    edgesIn:Edge[] = []
    knotType:KnotType = KnotType.normal

    bind(knot:Knot):Edge{
        var edge = new Edge([])
        this.connect(edge,knot)
        return edge
    }

    connect(edge:Edge,knot:Knot):Knot{
        edge.origin = this
        edge.target = knot
        knot.edgesIn.push(edge)
        this.edges.push(edge)
        return knot
    }

    freeEdge(knot:Knot, edgeType:EdgeType){//this edge is only used for the chains in fingers
        var edge = new Edge([])
        edge.edgeType = edgeType
        edge.target = knot
        edge.origin = this
        return edge
    }

    begin():Knot{
        this.knotType = KnotType.entry
        return this
    }

    end():Knot{
        this.knotType = KnotType.exit
        return this
    }

    pilfer(victim:Knot):Knot{
        append(this.edgesIn,victim.edgesIn)
        this.edgesIn.forEach(e => e.target = this)
        return this
    }

    pilferOut(victim:Knot):Knot{
        append(this.edges,victim.edges)
        this.edges.forEach(e => e.origin = this)
        return this
    }

    checkValidity(){
        for(var edge of this.edges){
            if(edge.origin != this){
                return false
            }
            
        }
        for(var edge of this.edgesIn){
            if(edge.target != this){
                return false
            }
        }
        return true
    }
}

class Finger{

    constructor(public knot:Knot, public stringpointer:number){

    }
    stack:Edge[] = []
    edgeChain:EdgeChain

    chainStep(edge:Edge, symbol:string){
        this.edgeChain = this.edgeChain.add(edge, symbol)
        this.knot = edge.target
    }
    
    copy(){
        var finger = new Finger(this.knot,this.stringpointer)
        finger.stack = this.stack.slice()
        finger.edgeChain = this.edgeChain
        return finger
    }
}

class EdgeChain{

    depth:number = 0
    nexts:EdgeChain[] = []

    constructor(public prev:EdgeChain, public edge:Edge, public symbol:string){
        
    }

    add(edge:Edge, symbol:string){
        var newlink = new EdgeChain(this,edge,symbol)
        newlink.depth = this.depth + 1
        this.nexts.push(newlink)
        return newlink
    }

    cutBranch(){
        var current:EdgeChain = this
        var next:EdgeChain = null
        while(current.nexts.length <= 1){
            next = current
            current = current.prev
        }
        
        current.nexts.splice(current.nexts.indexOf(next), 1)
    }

    
}


class TreeNode{
    constructor(public symbol:string, public origin:Edge){

    }
    children:TreeNode[] = []
}

class System{
    begin:Knot
    end:Knot
    constructor(){
        this.begin = new Knot()
        this.end = new Knot()
    }
}

function Diagram(holder:System,systems:System[]):void{
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
    res.begin.connect(edge,res.end)
    return res
}

function subsystem(system:System):System{
    var subsystem = new System()
    var newedge = Edge.highEdge(system.begin)
    subsystem.begin.connect(newedge,subsystem.end)
    return subsystem
}
