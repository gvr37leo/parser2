class ClickManager{
    rects:Map<Rect,() => void> = new Map()

    click(pos:Vector){
        for(var pair of this.rects.entries()){
            if(pair[0].collidePoint(pos)){
                pair[1]()
                break
            }
        }
    }

    listen(rect:Rect,cb:() => void){
        this.rects.set(rect,cb)
    }

    delisten(rect:Rect){
        this.rects.delete(rect)
    }
}