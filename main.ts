

function parse(text:string, system:Knot):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack = [{knot:system,targetKnotIndex:0}]

    var stringpointer = 0
    // var currentKnot = system

    debugger
    mainloop:while(stringpointer < text.length){
        if(systemStack.length == 0){
            break
        }

        var current = last(systemStack)
        
        for(; current.targetKnotIndex < current.knot.edges.length; current.targetKnotIndex++){
            var targetknot = current.knot.edges[current.targetKnotIndex]

            if(targetknot.knotType == KnotType.high){
                systemStack.push({knot:targetknot.subsystem,targetKnotIndex:0})
                break
            }else if(targetknot.knotType == KnotType.normal){
                var found = false
                for(var symbol of targetknot.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        stringpointer += symbol.length
                        current.knot = targetknot
                        current.targetKnotIndex = -1
                        found = true
                        break
                    }
                }
                if(!found){
                    systemStack.pop()
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.targetKnotIndex++
                }
            }else if(targetknot.knotType == KnotType.exit){
                systemStack.pop()
                if(systemStack.length == 0){
                    console.log('finished parsing text, finished final stack')
                    if(stringpointer < text.length){
                        console.log('still text left')
                        break mainloop
                    }
                    
                }else{
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.knot = highknotEnteringNode.knot.edges[highknotEnteringNode.targetKnotIndex]
                }
                break
            }
        }
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
    

    group(knot:(start:Knot) => Knot){
        var begin = new Knot()
        this.normal(begin)
        var end = knot(begin)
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



var text = '((a))';
var bracesHigh = Knot.subsystem(null)
var braces = Knot.entry()
braces.normal(new Knot(['('])).group([bracesHigh,new Knot(['a','b']),new Knot([])]).normal(new Knot([')'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)