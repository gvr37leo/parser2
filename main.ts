
var text = '((a)((b)))'

function parse(system:Knot,text:string):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack:Knot[] = [system]
    var stringpointer = 0
    var currentKnot = system
    while(stringpointer < text.length){
        
        for(var i = 0; i < currentKnot.knots.length; i++){
            var knot = currentKnot.knots[i]
            if(knot.knotType == KnotType.entry){
                
            }else if(knot.knotType == KnotType.normal){
                for(var symbol of knot.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        stringpointer += symbol.length
                        currentKnot = knot
                        i = 0
                        break
                    }
                }
            }else if(knot.knotType == KnotType.exit){

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

function or(knot:Knot,symbols:string[]){

}

function optional(){

}

function plus(knot:Knot,symbols:string[]):Knot{
    var newknot = new Knot()
    newknot.knotType = KnotType.normal

    knot.knots.push(newknot)
    newknot.knots = [newknot]
    newknot.allowedSymbols = symbols
    return newknot
}

function star(knot:Knot,endknot:Knot,symbols:string[]){
    var newknot = plus(knot,symbols)
    knot.knots.push(endknot)
    return newknot
}

function normal(knot:Knot,symbols:string[]){
    
}