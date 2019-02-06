

function parse(text:string, system:Knot):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack:Knot[] = [system]
    var stringpointer = 0
    var currentKnot = system


    mainloop:while(stringpointer < text.length){
        for(var i = 0; i < currentKnot.knots.length; i++){
            var knot = currentKnot.knots[i]
            if(knot.knotType == KnotType.high){
                systemStack.push(knot.subsystem)
                currentKnot = knot.subsystem
            }else if(knot.knotType == KnotType.entry){
                
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
                systemStack.pop()
                if(systemStack.length == 0){
                    console.log('string leftover at end of parsing')
                    break mainloop
                }
                currentKnot = systemStack[systemStack.length - 1].knots[0]

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

enum KnotType{entry,normal,exit,high}

class Knot{
    knots:Knot[] = []
    allowedSymbols:string[] = []
    subsystem:Knot

    constructor(public knotType:KnotType){

    }

    or(symbols:string[]):Knot{
        return null
    }
    
    optional(symbols:string[],endknot:Knot):Knot{
        var newknot = this.normal(symbols)
        this.knots.push(endknot)
        return newknot
    }
    
    plus(symbols:string[]):Knot{
        var newknot = this.normal(symbols)
        newknot.knots.push(newknot)
        return newknot
    }
    
    star(endknot:Knot,symbols:string[]):Knot{
        var newknot = this.plus(symbols)
        this.knots.push(endknot)
        return newknot
    }

    normalp(rule:Knot):Knot{
        this.knots.push(rule)
        return rule
    }
    
    normal(symbols:string[]):Knot{
        var newknot = new Knot(KnotType.normal)
        newknot.allowedSymbols = symbols
        this.knots.push(newknot)
        return newknot
    }

    end():Knot{
        var newknot = this.normal([])
        newknot.knotType = KnotType.exit
        return newknot
    }
}



var text = '((a)((b)))';

var braces = new Knot(KnotType.entry).normal(['[']).or([]).normal([']']).end()
var ast = parse(text,braces)