

function parse(text:string, system:Knot):TreeNode{
    var root = new Stack(system,new TreeNode('high node', null))
    var systemStack = [root]

    var stringpointer = 0
    // var currentKnot = system

    var parseresult = parseRecursive(text,stringpointer,systemStack)

    return root.treenode
}

function parseRecursive(text:string,stringpointer:number, systemStack:Stack[]):{succesfull:boolean,stringpointer:number}{

    var current = last(systemStack)

    while(current.knot.knotType != KnotType.exit){
        

        var validEdges = []
        var hitsymbol
        for(let targetEdge of current.knot.edges){

            if(targetEdge.edgeType == EdgeType.high){
                validEdges.push(targetEdge)
            }else if(targetEdge.edgeType == EdgeType.normal){
                for(let symbol of targetEdge.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        hitsymbol = symbol
                        validEdges.push(targetEdge)
                    }
                }
            }
        }

        if(validEdges.length == 0){
            systemStack.pop()
            return {succesfull:false,stringpointer:0}
        }

        for(let targetEdge of validEdges){
            if(targetEdge.edgeType == EdgeType.high){
                var treenode = new TreeNode('high node', null)
                systemStack.push(new Stack(targetEdge.subsystem, treenode))
                var parseResult = parseRecursive(text,stringpointer,systemStack)
                if(parseResult.succesfull){
                    current.treenode.children.push(treenode)
                    stringpointer = parseResult.stringpointer
                    current.knot = targetEdge.target
                }else{
                    continue
                }
            }else if(targetEdge.edgeType == EdgeType.normal){
                stringpointer += hitsymbol.length
                current.knot = targetEdge.target
                current.treenode.children.push(new TreeNode(hitsymbol,targetEdge))

                if(current.knot.knotType == KnotType.normal){
                    
                }else if(current.knot.knotType == KnotType.exit){
                    systemStack.pop()
                    return {succesfull:true,stringpointer}
                }
            }

            break//take the first one, fingers not yet supported
        }
    }
}

class Stack{
    
    fingers:Set<Knot> = new Set()

    // validEdgesSearched = false
    // validEdges:Edge[] = []


    constructor(public knot:Knot, public treenode:TreeNode){

    }
}

class TreeNode{
    constructor(public symbol:string, public origin:Edge){

    }
    children:TreeNode[] = []
}
