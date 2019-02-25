
function parse(text:string, system:Knot):TreeNode{
    var fingers = [new Finger(system,0)]
    
    while(fingers.length > 0){
        mergeFingers(fingers)
        var nextGenFingers = []
        for(var finger of fingers){

            var validEdges:Edge[] = []

            for(let targetEdge of finger.knot.edges){
                if(targetEdge.edgeType == EdgeType.high){
                    validEdges.push(targetEdge)
                }else if(targetEdge.edgeType == EdgeType.normal){
                    for(let symbol of targetEdge.allowedSymbols){//todo
                        if(text.substr(finger.stringpointer,symbol.length) === symbol){
                            validEdges.push(targetEdge)
                        }
                    }
                }
            }

            if(validEdges.length == 0){
                finger.edgeChain.cutBranch()
            }

            for(let validEdge of validEdges){
                let newFinger = finger.copy()
                nextGenFingers.push(newFinger)
                if(validEdge.edgeType == EdgeType.high){
                    newFinger.stack.push(validEdge)
                    newFinger.chainStep(Edge.freeEdge(validEdge.subsystem))
                }else if(validEdge.edgeType == EdgeType.normal){
                    newFinger.stringpointer += 1//todo
                    newFinger.chainStep(validEdge)



                    if(finger.knot.knotType == KnotType.normal){

                    }else if(finger.knot.knotType == KnotType.exit){
                        if(finger.stack.length == 0){
                            return buildTree(reverseKnotChain(finger.edgeChain)) 
                        }else{
                            let laststack = finger.stack.pop()
                            finger.chainStep(Edge.freeEdge(laststack.target))
                        }
                    }
                }
                
            }
        }

        fingers = nextGenFingers
    }

    return null
}

function mergeFingers(fingers:Finger[]):Finger[]{
    for(var finger of fingers){
        
    }
    return null//todo
}

function reverseKnotChain(end:EdgeChain):Edge[]{
    var current = end
    var knots:Edge[] = []
    while(current != null){
        knots.unshift(current.edge)
        current = current.prev
    }
    return knots
}

function buildTree(edges:Edge[]):TreeNode{
    var root = new TreeNode('root',null)
    var stack = [root]
    for(var edge of edges){
        var lastitem = last(stack)
        if(edge.target.knotType == KnotType.entry){
            let hightree = new TreeNode('high',edge)
            lastitem.children.push(hightree)
            stack.push(hightree)
        } else if(edge.target.knotType == KnotType.normal){
            lastitem.children.push(new TreeNode(edge.allowedSymbols[0],edge))
        } else if(edge.target.knotType == KnotType.exit){
            if(stack.length == 0){
                if(edge != last(edges)){
                    console.error('something went wrong')
                }
            }else{
                stack.pop()
            }
        }
    }
    return root
}

class Finger{

    constructor(public knot:Knot, public stringpointer:number){

    }
    stack:Edge[]
    edgeChain:EdgeChain

    chainStep(edge:Edge){
        this.edgeChain = this.edgeChain.add(edge)
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

    constructor(public prev:EdgeChain, public edge:Edge){

    }

    add(edge:Edge){
        var newlink = new EdgeChain(this,edge)
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

    nexts:EdgeChain[] = []
}


class TreeNode{
    constructor(public symbol:string, public origin:Edge){

    }
    children:TreeNode[] = []
}
