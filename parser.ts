/// <reference path="Structs.ts" />
class Parser{

    fingers:Finger[] = []
    tree:TreeNode
    constructor(system:Knot){
        this.fingers = [new Finger(system,0)]
        this.fingers[0].edgeChain = new EdgeChain(null,null,'')
    }

    run(){
        while(this.fingers.length > 0 && this.tree == null){
            this.step()
        }
    }

    step(){
        this.fingers = mergeFingers(this.fingers)
        var nextGenFingers = []
        for(var finger of this.fingers){

            var validEdges:Edge[] = []
            var symbols:string[] = []

            for(let targetEdge of finger.knot.edges){
                if(targetEdge.edgeType == EdgeType.high){
                    validEdges.push(targetEdge)
                    symbols.push('')
                }else if(targetEdge.edgeType == EdgeType.normal){
                    if(targetEdge.allowedSymbols.length == 0){
                        validEdges.push(targetEdge)
                        symbols.push('')
                    }else{
                        for(let symbol of targetEdge.allowedSymbols){
                            if(text.substr(finger.stringpointer,symbol.length) === symbol){
                                validEdges.push(targetEdge)
                                symbols.push(symbol)
                                break
                            }
                        }
                    }
                }
            }

            if(validEdges.length == 0){
                finger.edgeChain.cutBranch()
                continue
            }

            for(let i = 0; i < validEdges.length; i++){
                let validEdge = validEdges[i]
                let newFinger = finger.copy()
                nextGenFingers.push(newFinger)
                if(validEdge.edgeType == EdgeType.high){
                    newFinger.stack.push(validEdge)
                    newFinger.chainStep(newFinger.knot.freeEdge(validEdge.subsystem, EdgeType.entering),'')
                }else if(validEdge.edgeType == EdgeType.normal){
                    newFinger.stringpointer += symbols[i].length
                    newFinger.chainStep(validEdge,symbols[i])



                    if(validEdge.target.knotType == KnotType.normal){

                    }else if(validEdge.target.knotType == KnotType.exit){
                        if(newFinger.stack.length == 0){
                            this.fingers = nextGenFingers
                            this.tree = buildTree(reverseEdgeChain(newFinger.edgeChain)) 
                        }else{
                            let laststack = newFinger.stack.pop()
                            newFinger.chainStep(newFinger.knot.freeEdge(laststack.target, EdgeType.exiting),'')
                        }
                    }
                }
                
            }
        }

        this.fingers = nextGenFingers
    
    }
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

function fingerCompare(a:Finger,b:Finger):number{
    var result = a.stringpointer - b.stringpointer
    if(result == 0){
        result = b.edgeChain.depth - a.edgeChain.depth
    }else{
        return result
    }
    return result
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
            var a = finger
            var b = current.fingers.get(finger.knot)
            // var dist = EdgeChain.findCommonAncestor(a,b)
            if(fingerCompare(a,b) > 0){
                current.fingers.set(a.knot,a)
                b.edgeChain.cutBranch()
            }else{
                a.edgeChain.cutBranch()
            }
            //cut the longest maintain the shortest
            //longess is determined by length of the chain till they have a common ancestor
            //? dont cut till ancestor but till first branch
            //choose one todo
        }else{
            current.fingers.set(finger.knot,finger)
        }
    }

    return fingerTree.getFingersRecursive()
}

function reverseEdgeChain(end:EdgeChain):EdgeChain[]{
    var current = end
    var edges:EdgeChain[] = []
    while(current != null){
        edges.unshift(current)
        current = current.prev
    }
    edges.splice(0,1)
    return edges
}

function buildTree(chain:EdgeChain[]):TreeNode{
    var root = new TreeNode('root',null)
    var stack = [root]
    for(var chainlink of chain){
        var current = last(stack)
        if(chainlink.edge.edgeType == EdgeType.entering){
            let hightree = new TreeNode('high',chainlink.edge)
            current.children.push(hightree)
            stack.push(hightree)
        }else if(chainlink.edge.edgeType == EdgeType.exiting){
            if(stack.length == 0){
                console.error('something went wrong')
            }else{
                stack.pop()
            }
        }else{
            if(chainlink.symbol.length > 0){
                current.children.push(new TreeNode(chainlink.symbol,chainlink.edge))
            }
        }
    }
    return root
}

