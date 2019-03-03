class Store<T>{
    idcount:number = 0
    edges = new Map<number,T>()
    fkStores:Map<number,Map<number,T>>[] = []

    constructor(
        public pkSet:(edge:T,id:number) => void,
        public pkGet:(edge:T) => number,
        public fkgets:((edge:T) => number)[])
    {
        for(var i = 0; i < this.fkgets.length; i++){
            this.fkStores.push(new Map())
        }
    }

    size():number{
        return this.edges.size
    }
    
    add(edge:T):T{
        return this.addWithId(edge,this.idcount++)
    }

    private addWithId(edge:T,id:number):T{
        this.edges.set(id,edge)
        this.pkSet(edge,id)

        for(var i = 0; i < this.fkgets.length; i++){
            var fkget = this.fkgets[i]
            var fkstore = this.fkStores[i]
            var foreignObjects:Map<number,T>
            var fkid = fkget(edge)
            if(fkstore.has(fkid)){
                foreignObjects = fkstore.get(fkid)
            }else{
                foreignObjects = new Map()
                fkstore.set(fkid,foreignObjects)
            }
            foreignObjects.set(this.pkGet(edge),edge)
        }
        
        return edge
    }

    del(id:number):boolean{
        if(this.edges.has(id)){
            var edge = this.get(id)
            this.edges.delete(id)
            for(var i = 0; i < this.fkgets.length; i++){
                var fkget = this.fkgets[i]
                var fkstore = this.fkStores[i]

                var fkid = fkget(edge)
                var knot2edgemap = fkstore.get(fkid)
                knot2edgemap.delete(this.pkGet(edge))
                if(knot2edgemap.size == 0){
                    knot2edgemap.delete(fkid)
                }
            }
            return true
        }else{
            return false
        }
    }

    update(val:T):boolean{
        var result = this.del(this.pkGet(val))
        this.addWithId(val,this.pkGet(val))
        return result
    }

    get(id:number):T{
        return this.edges.get(id)
    }

    getByFK(fkindex:number,knotid:number):T[]{
        return Array.from(this.fkStores[fkindex].get(knotid).values())
    }
}