
var text = '((a)((b)))'

function parse(system:Knot,text:string):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack:Knot[] = [system]
    var stringpointer = 0
    var currentKnot = system
    while(stringpointer < text.length){
        
        for(var i = 0; i < currentKnot.knots.length; i++){
            var knot = currentKnot.knots[i]
            for(var symbol of knot.allowedSymbols){
                if(text.substr(stringpointer,symbol.length) === symbol){
                    stringpointer += symbol.length
                    currentKnot = knot
                    i = 0
                    break
                }
            }
        }

        console.log('no matching symbols found')
        console.log(currentKnot)
        console.log(stringpointer)
        break
    }

    return root
}

class TreeNode{
    symbol:string
    origin:Knot
    children:TreeNode
}

enum KnotType{entry,normal,exit}

class Knot{
    knotType:KnotType
    knots:Knot[]
    allowedSymbols:string[]
}

