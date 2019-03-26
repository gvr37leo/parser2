
class Eventx<T>{
    handled = false

    constructor(public val:T){

    }
}

class PBox<T>{
    private box:Box<Eventx<T>>
    onchange:EventSystem<Eventx<T>>

    constructor(val:T){
        this.box = new Box(new Eventx(val))
        this.onchange = this.box.onchange
    }

    get():T{
        return this.box.value.val
    }

    set(v:T){
        var e = new Eventx(v)
        e.handled = false
        this.box.set(e)
    }

    setS(e:Eventx<T>){
        this.box.set(e)
    }

    setH(e:Eventx<T>){
        if(!e.handled){
            e.handled = true
            this.setS(e)
        }
    }
}