class Finger{

    constructor(public knot:Knot, public stringpointer:number){

    }
    stack:Edge[]
    edgeChain:EdgeChain

    chainStep(edge:Edge){
        this.edgeChain = this.edgeChain.add(edge)
        this.knot = edge.target
    }
    
    copy(){
        var finger = new Finger(this.knot,this.stringpointer)
        finger.stack = this.stack.slice()
        finger.edgeChain = this.edgeChain
        return finger
    }
}

class EdgeChain{

    constructor(public prev:EdgeChain, public edge:Edge){

    }

    add(edge:Edge){
        var newlink = new EdgeChain(this,edge)
        this.nexts.push(newlink)
        return newlink
    }

    cutBranch(){
        var current:EdgeChain = this
        var next:EdgeChain = null
        while(current.nexts.length <= 1){
            next = current
            current = current.prev
        }
        
        current.nexts.splice(current.nexts.indexOf(next), 1)
    }

    nexts:EdgeChain[] = []
}