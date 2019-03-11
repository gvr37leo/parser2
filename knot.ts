enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}

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