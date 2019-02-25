enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}
enum EdgeType{normal = 'normal',high = 'high'}

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

    static freeEdge(knot:Knot){
        var newEdge = new Edge([])
        newEdge.target = knot
        return newEdge
    }
}

class Knot{
    edges:Edge[] = []
    knotType:KnotType = KnotType.normal

    star(edge:Edge):Knot{
        return this.connect(edge,this)
    }

    optional(edge:Edge):Knot{
        var newknot = new Knot
        this.connect(edge,newknot)
        this.connect(new Edge([]),newknot)
        return newknot
    }

    or(edges:Edge[]):Knot{
        var endknot = new Knot()
        for(var edge of edges){
            this.connect(edge,endknot)
        }
        return endknot
    }
    
    plus(edge:Edge):Knot{
        return this.normal(edge).star(edge)
    }

    normal(edge:Edge):Knot{
        return this.connect(edge,new Knot())
    }

    connect(edge:Edge,knot:Knot):Knot{
        edge.target = knot
        this.edges.push(edge)
        return knot
    }

    group(cb:(start:Knot) => Knot):Knot{
        var begin = new Knot()
        var end = new Knot()
        this.connect(new Edge([]),begin)
        cb(begin).connect(new Edge([]),end)
        return end
    }

    static entry():Knot{
        var knot = new Knot()
        knot.knotType = KnotType.entry
        return knot
    }

    end():Knot{
        this.knotType = KnotType.exit
        return this
    }
}
