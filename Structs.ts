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
        edge.origin = this
        edge.target = knot
        this.connect

        edge.edgeType = edgeType
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

    pilver(victim:Knot):Knot{
        this.edgesIn = victim.edgesIn
        this.edgesIn.forEach(e => e.target = this)
        return this
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

    static findCommonAncestor(a:EdgeChain,b:EdgeChain):EdgeChain{
        var dist = [0,0]
        var items = [a,b]
        items.sort((a,b) => a.depth - b.depth)
        var high = items[0]
        var deep = items[1]
        while(deep.depth > high.depth){
            deep = deep.prev
        }

        while(high != deep){
            high = high.prev
            deep = deep.prev
        }


        return deep
    }

    nexts:EdgeChain[] = []
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
        res.end.pilver(system.end)
    }
    return res
}

function plus(normal:System,repeat:System):System{
    normal.end.edges = repeat.begin.edges
    normal.begin.pilver(repeat.end)
    return normal
}

function star(normal:System,repeat:System):System{
    return optional(plus(normal,repeat))
}

function mergeSystems(holder:System, systems:System[]){
    for(var i = 1; i < systems.length; i++){
        var left = systems[i - 1]
        var right = systems[i]
        left.end.edges = right.begin.edges
    }
    holder.begin.edges = systems[0].begin.edges
    holder.end.pilver(last(systems).end)
}

function terminal(edge:Edge):System{
    var res = new System()
    res.begin.connect(edge,res.end)
    edge.target = res.end
    return res
}

function subsystem(system:System):System{
    var subsystem = new System()
    subsystem.begin.freeEdge(system.begin, EdgeType.entering)
    subsystem.end.freeEdge(system.end, EdgeType.exiting)
    return system
}
