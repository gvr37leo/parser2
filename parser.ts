/// <reference path="test.ts" />


// function parse(text:string, system:Knot):TreeNode{
//     var root = new Stack(system,new TreeNode('high node', null))
//     var systemStack = [root]

//     var stringpointer = 0
//     // var currentKnot = system

//     // var parseresult = parseRecursive(text,stringpointer,systemStack)

//     return root.treenode
// }

function parseFingers(text:string, system:Knot):TreeNode{
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
                    for(let symbol of targetEdge.allowedSymbols){
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
                    newFinger.stringpointer += 1
                    newFinger.chainStep(validEdge)



                    if(finger.knot.knotType == KnotType.normal){

                    }else if(finger.knot.knotType == KnotType.exit){
                        if(finger.stack.length == 0){
                            
                        }
                        let laststack = finger.stack.pop()
                        finger.chainStep(Edge.freeEdge(laststack.target))
                    }
                }
                
            }
        }

        fingers = nextGenFingers
    }

    return null
}

function mergeFingers(fingers:Finger[]){

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

// function parseRecursive(text:string,stringpointer:number, systemStack:Stack[]):{succesfull:boolean,stringpointer:number}{

//     var current = last(systemStack)

//     while(current.knot.knotType != KnotType.exit){
        

//         var validEdges = []
//         var hitsymbol
//         for(let targetEdge of current.knot.edges){

//             if(targetEdge.edgeType == EdgeType.high){
//                 validEdges.push(targetEdge)
//             }else if(targetEdge.edgeType == EdgeType.normal){
//                 for(let symbol of targetEdge.allowedSymbols){
//                     if(text.substr(stringpointer,symbol.length) === symbol){
//                         hitsymbol = symbol
//                         validEdges.push(targetEdge)
//                     }
//                 }
//             }
//         }

//         if(validEdges.length == 0){
//             systemStack.pop()
//             return {succesfull:false,stringpointer:0}
//         }

//         for(let targetEdge of validEdges){
//             if(targetEdge.edgeType == EdgeType.high){
//                 var treenode = new TreeNode('high node', null)
//                 systemStack.push(new Stack(targetEdge.subsystem, treenode))
//                 var parseResult = parseRecursive(text,stringpointer,systemStack)
//                 if(parseResult.succesfull){
//                     current.treenode.children.push(treenode)
//                     stringpointer = parseResult.stringpointer
//                     current.knot = targetEdge.target
//                 }else{
//                     continue
//                 }
//             }else if(targetEdge.edgeType == EdgeType.normal){
//                 stringpointer += hitsymbol.length
//                 current.knot = targetEdge.target
//                 current.treenode.children.push(new TreeNode(hitsymbol,targetEdge))

//                 if(current.knot.knotType == KnotType.normal){
                    
//                 }else if(current.knot.knotType == KnotType.exit){
//                     systemStack.pop()
//                     return {succesfull:true,stringpointer}
//                 }
//             }

//             break//take the first one, fingers not yet supported
//         }
//     }
// }


class TreeNode{
    constructor(public symbol:string, public origin:Edge){

    }
    children:TreeNode[] = []
}
