

function parse(text:string, system:Knot):TreeNode{
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
    knots:Knot[] = []
    allowedSymbols:string[] = []

    constructor(public knotType:KnotType){

    }

    or(symbols:string[]):Knot{
        return null
    }
    
    optional():Knot{
    
        return null
    }
    
    plus(symbols:string[]):Knot{
        var newknot = new Knot(KnotType.normal)
    
        this.knots.push(newknot)
        newknot.knots = [newknot]
        newknot.allowedSymbols = symbols
        return newknot
    }
    
    star(endknot:Knot,symbols:string[]):Knot{
        var newknot = this.plus(symbols)
        this.knots.push(endknot)
        return newknot
    }
    
    normal(symbols:string[]):Knot{
        return null
    }

    end():Knot{
        return null
    }
}



var text = '((a)((b)))';

var braces = new Knot(KnotType.entry).normal(['[']).normal([']']).end()
var ast = parse(text,braces)