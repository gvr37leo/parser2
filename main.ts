

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
    knotType:KnotType
    subsystem:Knot

    constructor(public allowedSymbols:string[]){

    }

    star(knot:Knot, endknot:Knot):Knot{
        this.optional(this.plus(knot),endknot)
        return endknot
    }

    optional(knot:Knot,endknot:Knot):Knot{
        this.connect(endknot)
        this.connect(knot).connect(endknot)
        return endknot
    }
    
    plus(knot:Knot):Knot{
        this.connect(knot)
        knot.connect(knot)
        return knot
    }

    end():Knot{
        var newknot = this.connect(new Knot([]))
        newknot.knotType = KnotType.exit
        return newknot
    }

    connect(knot:Knot):Knot{
        this.knots.push(knot)
        return knot
    }

    or(knots:Knot[],endknot:Knot):Knot{
        for(var knot of knots){
            knot.knots.push(endknot)
        }
        return endknot
    }

    static subsystem(subsystem:Knot){
        var knot = new Knot([])
        knot.knotType = KnotType.high
        knot.subsystem = subsystem
        return knot
    }

    static entry():Knot{
        var knot = new Knot([])
        knot.knotType = KnotType.entry
        return knot
    }
}



var text = '((a)((b)))';
var bracesHigh = Knot.subsystem(null)
var braces = Knot.entry().connect(new Knot(['['])).or([bracesHigh,new Knot(['a']),new Knot([])],null).connect(new Knot([']'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)