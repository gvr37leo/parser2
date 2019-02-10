

function parse(text:string, system:Knot):TreeNode{
    var root:TreeNode = new TreeNode()
    var systemStack = [{knot:system,targetKnotIndex:0}]

    var stringpointer = 0
    // var currentKnot = system

    debugger
    mainloop:while(stringpointer < text.length){
        if(systemStack.length == 0){
            break
        }

        var current = last(systemStack)
        
        for(; current.targetKnotIndex < current.knot.knots.length; current.targetKnotIndex++){
            var targetknot = current.knot.knots[current.targetKnotIndex]

            if(targetknot.knotType == KnotType.high){
                systemStack.push({knot:targetknot.subsystem,targetKnotIndex:0})
                break
            }else if(targetknot.knotType == KnotType.normal){
                var found = false
                for(var symbol of targetknot.allowedSymbols){
                    if(text.substr(stringpointer,symbol.length) === symbol){
                        stringpointer += symbol.length
                        current.knot = targetknot
                        current.targetKnotIndex = -1
                        found = true
                        break
                    }
                }
                if(!found){
                    systemStack.pop()
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.targetKnotIndex++
                }
            }else if(targetknot.knotType == KnotType.exit){
                systemStack.pop()
                if(systemStack.length == 0){
                    console.log('finished parsing text, finished final stack')
                    if(stringpointer < text.length){
                        console.log('still text left')
                        break mainloop
                    }
                    
                }else{
                    var highknotEnteringNode = last(systemStack)
                    highknotEnteringNode.knot = highknotEnteringNode.knot.knots[highknotEnteringNode.targetKnotIndex]
                }
                break
            }
        }
    }



    return root
}

function last<T>(arr:T[]){
    return arr[arr.length - 1]
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



var text = '((a))';
var bracesHigh = Knot.subsystem(null)
var braces = Knot.entry()
braces.connect(new Knot(['('])).or([bracesHigh,new Knot(['a','b']),new Knot([])],new Knot([')'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)