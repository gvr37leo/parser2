

function parse(text:string, system:Knot):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack = [{knot:system,targetEdgeIndex:0}]

    var stringpointer = 0
    // var currentKnot = system

    debugger
    mainloop:while(stringpointer < text.length){
        if(systemStack.length == 0){
            break
        }

        var current = last(systemStack)

        for(; current.targetEdgeIndex < current.knot.edges.length; current.targetEdgeIndex++){
            var targetEdge = current.knot.edges[current.targetEdgeIndex]

            if(targetEdge.edgeType == EdgeType.high){
                systemStack.push({knot:targetEdge.subsystem,targetEdgeIndex:0})
                break;
            }else if(targetEdge.edgeType == EdgeType.normal){
                var found = false
                for(var symbol of targetEdge.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        stringpointer += symbol.length
                        current.knot = targetEdge.target
                        current.targetEdgeIndex = -1

                        if(current.knot.knotType == KnotType.normal){

                        }else if(current.knot.knotType == KnotType.exit){
                            systemStack.pop()
                            var highknotEnteringNode = last(systemStack)
                            highknotEnteringNode.knot = highknotEnteringNode.knot.edges[highknotEnteringNode.targetEdgeIndex].target
                        }

                        
                        found = true
                        break
                    }
                }
                if(!found){
                    systemStack.pop()
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.targetEdgeIndex++
                }
            }
        }
        
        // for(; current.targetKnotIndex < current.knot.edges.length; current.targetKnotIndex++){
        //     var targetknot = current.knot.edges[current.targetKnotIndex]

        //     if(targetknot.knotType == KnotType.high){
        //         systemStack.push({knot:targetknot.subsystem,targetKnotIndex:0})
        //         break
        //     }else if(targetknot.knotType == KnotType.normal){
        //         var found = false
        //         for(var symbol of targetknot.allowedSymbols){
        //             if(text.substr(stringpointer,symbol.length) === symbol){
        //                 stringpointer += symbol.length
        //                 current.knot = targetknot
        //                 current.targetKnotIndex = -1
        //                 found = true
        //                 break
        //             }
        //         }
        //         if(!found){
        //             systemStack.pop()
        //             var highknotEnteringNode = last(systemStack)
        //             highknotEnteringNode.targetKnotIndex++
        //         }
        //     }else if(targetknot.knotType == KnotType.exit){
        //         systemStack.pop()
        //         if(systemStack.length == 0){
        //             console.log('finished parsing text, finished final stack')
        //             if(stringpointer < text.length){
        //                 console.log('still text left')
        //                 break mainloop
        //             }
                    
        //         }else{
        //             var highknotEnteringNode = last(systemStack)
        //             highknotEnteringNode.knot = highknotEnteringNode.knot.edges[highknotEnteringNode.targetKnotIndex]
        //         }
        //         break
        //     }
        // }
    }



    return root
}

function last<T>(arr:T[]){
    return arr[arr.length - 1]
}

class TreeNode{
    symbol:string
    origin:Knot
    children:TreeNode
}

enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit'}
enum EdgeType{normal = 'normal',high = 'high'}

class Edge{
    edgeType:EdgeType = EdgeType.normal
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


debugger
var text = '((a))';
var braces = Knot.entry()
var bracesHigh = Edge.highEdge(braces)
// braces.normal(new Edge(['('])).group(start => start.or([bracesHigh,new Edge(['a','b'])])).normal(new Edge([')'])).end()
braces.normal(new Edge(['('])).or([bracesHigh,new Edge(['a','b'])]).normal(new Edge([')'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)