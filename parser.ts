

function parse(text:string, system:Knot):TreeNode{
    var root = new Stack(system, 0,new TreeNode('high node', null))
    var systemStack = [root]

    var stringpointer = 0
    // var currentKnot = system

    debugger
    mainloop:while(stringpointer < text.length){
        if(systemStack.length == 0){
            break
        }

        var current = last(systemStack)

        
        if(current.validEdgesSearched == false){
            for(let targetEdge of current.knot.edges){

                if(targetEdge.edgeType == EdgeType.high){
                    current.validEdges.push(targetEdge)
                    // systemStack.push(new Stack(targetEdge.subsystem,0,new TreeNode('high node', null)))
                }else if(targetEdge.edgeType == EdgeType.normal){
                    for(var symbol of targetEdge.allowedSymbols){
                        if(text.substr(stringpointer,symbol.length) === symbol){
                            current.validEdges.push(targetEdge)
                        }
                    }
                }
            }
            current.validEdgesSearched
        }

        if(current.validEdges.length == 0){
            systemStack.pop()
            var highknotEnteringNode = last(systemStack)
            highknotEnteringNode.targetEdgeIndex++
            continue
        }

        for(;current.targetEdgeIndex < current.validEdges.length; current.targetEdgeIndex++){
            let targetEdge = current.validEdges[current.targetEdgeIndex]
            if(targetEdge.edgeType == EdgeType.high){
                systemStack.push(new Stack(targetEdge.subsystem,0,new TreeNode('high node', null)))
                // recursive call
                // if(succesfull){
                //     ga naar de volgende knot
                // }else{
                //     a
                // }
            }else if(targetEdge.edgeType == EdgeType.normal){
                stringpointer += symbol.length
                current.knot = targetEdge.target
                current.targetEdgeIndex = 0
                current.validEdgesSearched = false
                current.validEdges = []

                if(current.knot.knotType == KnotType.normal){
                    current.treenode.children.push(new TreeNode(symbol,targetEdge))
                }else if(current.knot.knotType == KnotType.exit){
                    systemStack.pop()
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.knot = highknotEnteringNode.knot.edges[highknotEnteringNode.targetEdgeIndex].target
                }
            }

            break//take the first one, fingers not yet supported
        }
        
                // var found = false
                // for(var symbol of targetEdge.allowedSymbols){
                //     if(text.substr(stringpointer,symbol.length) === symbol){
                //         stringpointer += symbol.length
                //         current.knot = targetEdge.target
                //         current.targetEdgeIndex = -1

                //         if(current.knot.knotType == KnotType.normal){
                //             current.treenode.children.push(new TreeNode(symbol,targetEdge))
                //         }else if(current.knot.knotType == KnotType.exit){
                //             systemStack.pop()
                //             var highknotEnteringNode = last(systemStack)
                //             highknotEnteringNode.knot = highknotEnteringNode.knot.edges[highknotEnteringNode.targetEdgeIndex].target
                //         }

                        
                //         found = true
                //         break
                //     }
                // }
                // if(!found){
                //     systemStack.pop()
                //     var highknotEnteringNode = last(systemStack)
                //     highknotEnteringNode.targetEdgeIndex++
                // }




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



    return root.treenode
}

class Stack{
    
    fingers:Set<Knot> = new Set()

    validEdgesSearched = false
    validEdges:Edge[] = []


    constructor(public knot:Knot, public targetEdgeIndex:number, public treenode:TreeNode){

    }
}

class TreeNode{
    constructor(public symbol:string, public origin:Edge){

    }
    children:TreeNode[] = []
}
