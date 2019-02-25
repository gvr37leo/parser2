/// <reference path="Structs.ts" />

function parse(text:string, system:Knot):TreeNode{
    var fingers = [new Finger(system,0)]
    fingers[0].edgeChain = new EdgeChain(null,null)
    
    
    while(fingers.length > 0){
        fingers = mergeFingers(fingers)
        var nextGenFingers = []
        for(var finger of fingers){

            var validEdges:Edge[] = []

            for(let targetEdge of finger.knot.edges){
                if(targetEdge.edgeType == EdgeType.high){
                    validEdges.push(targetEdge)
                }else if(targetEdge.edgeType == EdgeType.normal){
                    if(targetEdge.allowedSymbols.length == 0){
                        validEdges.push(targetEdge)
                    }else{
                        for(let symbol of targetEdge.allowedSymbols){//todo
                            if(text.substr(finger.stringpointer,symbol.length) === symbol){
                                validEdges.push(targetEdge)
                            }
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



                    if(validEdge.target.knotType == KnotType.normal){

                    }else if(validEdge.target.knotType == KnotType.exit){
                        if(newFinger.stack.length == 0){
                            return buildTree(reverseKnotChain(finger.edgeChain)) 
                        }else{
                            let laststack = newFinger.stack.pop()
                            newFinger.chainStep(Edge.freeEdge(laststack.target))
                        }
                    }
                }
                
            }
        }

        fingers = nextGenFingers
    }
    console.log('no fingers left')
    console.log('something went wrong')

    return null
}

class FingerTree{
    fingers:Map<Knot,Finger> = new Map()
    fingerTrees:Map<Edge,FingerTree> = new Map()

    getFingersRecursive():Finger[]{
        var result = Array.from(this.fingers.values())

        for(var fingertree of this.fingerTrees.values()){
            result = result.concat(fingertree.getFingersRecursive()) 
        }
        return result
    }
}

function mergeFingers(fingers:Finger[]):Finger[]{
    var fingerTree = new FingerTree()

    for(var finger of fingers){
        var current = fingerTree
        for(var i = 0; i < finger.stack.length && current; i++){
            var stackitem = finger.stack[i]
            if(current.fingerTrees.has(stackitem) == false){
                current.fingerTrees.set(stackitem,new FingerTree())
            }
            current = current.fingerTrees.get(stackitem)
        }
        if(current.fingers.has(finger.knot)){
            //choose one
        }else{
            current.fingers.set(finger.knot,finger)
        }
    }

    return fingerTree.getFingersRecursive()
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

