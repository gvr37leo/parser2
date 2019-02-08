

function parse(text:string, system:Knot):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack:Knot[] = [system]
    var stringpointer = 0
    var currentKnot = system


    mainloop:while(stringpointer < text.length && systemStack.length > 0){
        for(var i = 0; i < currentKnot.knots.length; i++){
            var targetKnot = currentKnot.knots[i]
            if(targetKnot.knotType == KnotType.high){
                //just go in and go back out if no fit
                //backing out is a problem because is i is reset to 0 and cant go over the high knot
                systemStack.push(targetKnot.subsystem)
                currentKnot = targetKnot.subsystem
                i = -1
            }else if(targetKnot.knotType == KnotType.entry){
                // should never be hit since currentknot is teleported here from a high knot
                console.log('entry knot should not be hit')

            }else if(targetKnot.knotType == KnotType.normal){
                for(var symbol of targetKnot.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        stringpointer += symbol.length
                        currentKnot = targetKnot
                        i = -1
                        break
                    }
                }
            }else if(targetKnot.knotType == KnotType.exit){
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

enum KnotType{entry = 'entry',normal = 'normal',exit = 'exit',high = 'high'}

class Knot{
    knots:Knot[] = []
    knotType:KnotType = KnotType.normal
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
            this.connect(knot)
            knot.connect(endknot)
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
var braces = Knot.entry()
braces.connect(new Knot(['('])).or([bracesHigh,new Knot(['a','b']),new Knot([])],new Knot([')'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)