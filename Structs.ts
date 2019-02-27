enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}
enum EdgeType{normal = 'normal',high = 'high', entering = 'entering', exiting = 'exiting'}

class Edge{
    public edgeType:EdgeType = EdgeType.normal
    public target:Knot
    public subsystem:Knot
    constructor(public allowedSymbols:string[]){

    }

    static highEdge(subsystem:Knot){
        var newedge = new Edge([])
        newedge.edgeType = EdgeType.high
        newedge.subsystem = subsystem
        return newedge
    }

    static freeEdge(knot:Knot, edgeType:EdgeType){
        var newEdge = new Edge([])
        newEdge.target = knot
        newEdge.edgeType = edgeType
        return newEdge
    }
}

class Knot{
    edges:Edge[] = []
    knotType:KnotType = KnotType.normal


    connect(edge:Edge,knot:Knot):Knot{
        edge.target = knot
        this.edges.push(edge)
        return knot
    }

    begin():Knot{
        this.knotType = KnotType.entry
        return this
    }

    end():Knot{
        this.knotType = KnotType.exit
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

function Diagram(systems:System[]):System{
    var res = mergeSystems(systems)
    res.begin.begin()
    res.end.end()
    return res
}

function optional(system:System):System{
    var res = new System()
    res.begin.connect(new Edge([]), res.end)
    return res
}

function or(systems:System[]):System{
    var res = new System()
    
    return res
}

function plus(normal:System,repeat:System):System{
    return null
}

function star(normal:System,repeat:System):System{
    return null
}

function mergeSystems(systems:System[]):System{
    return null
}