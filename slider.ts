class PBVal<T>{
    

    constructor(public handled:boolean, public val:T){

    }
}

class ProtectedBox<T>{

    onchange:EventSystem<PBVal<T>>
    box:Box<PBVal<T>>

    constructor(val:T){
        this.onchange = new EventSystem()
        this.box = new Box(new PBVal(false,val))
    }

    get(){
        return this.box.value.val
    }

    set(val:T){
        this.setS(new PBVal(false,val))
    }

    setS(val:PBVal<T>){
        this.box.set(val)
        if(val.handled == false){
            this.trigger(val)
        }
        
    }

    listen(cb:(val:PBVal<T>) => void){
        this.onchange.listen(v => {
            cb(v)
        })
    }

    trigger(val:PBVal<T>){
        this.onchange.trigger(val)
    }

    
}

