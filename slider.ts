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

class Slider{

    input:ProtectedBox<number>
    slider:ProtectedBox<number>
    inputel = 0
    sliderel = 0

    constructor(){
        this.input = new ProtectedBox(0)
        this.slider = new ProtectedBox(0)

        //input change -> set slider -> slider change ->| set input

        this.input.onchange.listen(v => {
            this.inputel = v.val
            v.handled = true
            this.slider.setS(v)
        })

        this.slider.onchange.listen(v => {
            this.sliderel = v.val
            v.handled = true
            this.input.setS(v)
        })
    }
}