enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}
enum EdgeType{normal = 'normal',high = 'high', entering = 'entering', exiting = 'exiting'}

class Edge{
    id:number
    edgeType:EdgeType = EdgeType.normal
    origin:Knot
    target:Knot
    subsystem:System
    whitelist:boolean = true
    constructor(public symbols:string[]){

    }

    static highEdge(subsystem:System){
        var newedge = new Edge([])
        newedge.edgeType = EdgeType.high
        newedge.subsystem = subsystem
        return newedge
    }

    isEnterable(text:string,stringpointer:number):{enterable:boolean,symbol:string}{
        if(this.symbols.length == 0 || this.edgeType == EdgeType.high){
            return {
                enterable:true,
                symbol:''
            }
        }
        var found = false
        let symbol
        for(var i = 0; i < this.symbols.length; i++){
            symbol = this.symbols[i]
            if(text.substr(stringpointer,symbol.length) === symbol){
                found = true
                break
            }
        }
        if(this.whitelist == true){
            return {
                enterable:found,
                symbol:symbol
            }
        }else{
            return {
                enterable:!found,
                symbol:text.substr(stringpointer,1)
            }
        }
    }

    checkBookKeeping(){
        return this.target.edgesIn.findIndex(e => e == this) != -1 &&
        this.origin.edges.findIndex(e => e == this) != -1
    }
}

class Knot{
    id:number
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

    pilferFull(victim:Knot):Knot{
        this.pilferLeft(victim)
        this.pilferRight(victim)
        return this
    }

    pilferLeft(victim:Knot):Knot{
        append(this.edgesIn,victim.edgesIn)
        this.edgesIn.forEach(e => e.target = this)
        return this
    }

    pilferRight(victim:Knot):Knot{
        append(this.edges,victim.edges)
        this.edges.forEach(e => e.origin = this)
        return this
    }

    checkBookKeeping(){
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


function spaceOut(){

}
