
enum EdgeType{normal = 'normal',high = 'high', entering = 'entering', exiting = 'exiting'}

class Edge{
    id:number
    edgeType:EdgeType = EdgeType.normal
    origin:Knot
    target:Knot
    subsystem:System
    isWhitelist:boolean = true
    constructor(public symbols:string[]){

    }

    static highEdge(subsystem:System){
        var newedge = new Edge([])
        newedge.edgeType = EdgeType.high
        newedge.subsystem = subsystem
        return newedge
    }

    isEnterable(text:string,stringpointer:number):{enterable:boolean,symbol:string}{
        if(this.symbols.length == 0 || this.edgeType == EdgeType.high){
            return {
                enterable:true,
                symbol:''
            }
        }
        var found = false
        let symbol
        for(var i = 0; i < this.symbols.length; i++){
            symbol = this.symbols[i]
            if(text.substr(stringpointer,symbol.length) === symbol){
                found = true
                break
            }
        }
        if(this.isWhitelist == true){
            return {
                enterable:found,
                symbol:symbol
            }
        }else{
            return {
                enterable:!found,
                symbol:text.substr(stringpointer,1)
            }
        }
    }

    checkBookKeeping(){
        return this.target.edgesIn.findIndex(e => e == this) != -1 &&
        this.origin.edges.findIndex(e => e == this) != -1
    }
}