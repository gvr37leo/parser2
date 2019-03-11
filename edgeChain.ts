class EdgeChain{

    depth:number = 0
    nexts:EdgeChain[] = []

    constructor(public prev:EdgeChain, public edge:Edge, public symbol:string){
        
    }

    add(edge:Edge, symbol:string){
        var newlink = new EdgeChain(this,edge,symbol)
        newlink.depth = this.depth + 1
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

    
}