
class TreeNode{
    children:TreeNode[] = []
    constructor(public symbol:string, public origin:Edge){

    }
    

    draw(ctxt:CanvasRenderingContext2D,pos:Vector){
        var treenodePosMap = new Map<TreeNode,Vector>()
        var levels:TreeNode[][] = []
        this.walkstart((node,depth) => {
            if(levels.length <= depth){
                levels.push([])
            }
            levels[depth].push(node)
        })

        for(var i = 0; i < levels.length; i++){
            var nodes = levels[i]
            for(var j = 0; j < nodes.length; j++){
                var node = nodes[j]
                var pos = new Vector(j * 50,i * 50).add(pos)
                treenodePosMap.set(node,pos)
                ctxt.fillStyle = 'black'
                ctxt.fillRect(pos.x,pos.y,10,10)
                ctxt.fillStyle = 'white'
                ctxt.fillText(node.symbol,pos.x,pos.y)
            }
        }

        for(var pair of treenodePosMap.entries()){
            var node = pair[0]
            var pos = pair[1]

            for(var child of node.children){
                line(ctxt,pos,treenodePosMap.get(child))
            }
        }
    }

    walkstart(cb:(node:TreeNode,depth:number) => void){
        this.walkrec(0,cb)
    }

    walkrec(depth:number,cb:(node:TreeNode,depth:number) => void){
        cb(this,depth)
        this.children.forEach(c => c.walkrec(depth + 1, cb))
    }
}
