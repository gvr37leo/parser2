/// <reference path="utils.ts" />
/// <reference path="parser.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="Store.ts" />

var store = new Store<Edge>((e,v) => e.id = v,e => e.id,[
    e => 1
])
var edge = store.add(new Edge([]))
var edge2 = store.add(new Edge([]))
store.get(1)
store.del(edge.id)

// var bracesHigh = Edge.highEdge(braces)
// braces.normal(new Edge(['('])).group(start => start.or([bracesHigh,new Edge(['a','b'])])).normal(new Edge([')'])).end()
// braces.normal(new Edge(['('])).or([bracesHigh,new Edge(['a','b'])]).normal(new Edge([')'])).end()






var a = new Knot().begin()
var b = new Knot()
var c = new Knot()
var d = new Knot()
var e = new Knot()
var f = new Knot().end()

a.connect(new Edge(['(']),b)
b.connect(new Edge([]),c)
b.connect(new Edge([]),e)
c.connect(Edge.highEdge(a),d)
c.connect(new Edge(['a','b','']),d)
d.connect(new Edge([',']),c)
d.connect(new Edge([]),e)
e.connect(new Edge([')']),f)
//https://github.com/tabatkins/railroad-diagrams
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)

var text = '((a),())';
var braces:System = new System()
Diagram(braces,[
    terminal(new Edge(['('])),
    star(
        choice([
            terminal(new Edge(['a'])),
            subsystem(braces),
        ]),
        terminal(new Edge([]))
    ),
    terminal(new Edge([')'])),
])
var cc = createCanvas(700,500)
var canvas = cc.canvas
var ctxt = cc.ctxt
var parser = new Parser(a)
var knotpositions = []
for (let i = 0; i < 6; i++) {
    knotpositions.push(new Vector(50 + 100 * i,200))
}

var edgeoffsets = [0,0,-20,0,10,-10,0,0,]
var knots = [a,b,c,d,e,f]
while(parser.fingers.length > 0 && parser.tree == null){
    drawSystem(ctxt,parser.fingers,knots,knotpositions,edgeoffsets);

    parser.step()
}
drawSystem(ctxt,parser.fingers,knots,knotpositions,edgeoffsets);
console.log(parser.tree)



function drawSystem(ctxt:CanvasRenderingContext2D,fingers:Finger[], knots:Knot[], positions:Vector[],edgeOffset:number[]){
    var knotradius = 30
    ctxt.clearRect(0,0,700,500)
    ctxt.fillText(text,20,10)
    var knotmap = new Map<Knot,Vector>()
    var edgeOffsetmap = new Map<Edge,number>()
    for(var i = 0; i < knots.length; i++){
        knotmap.set(knots[i],positions[i])
    }
    
    var j = 0;
    for(let i = 0; i < knots.length; i++){
        let knot = knots[i]
        let pos = positions[i]

        if(knot.checkValidity()){
            ctxt.fillStyle = 'black'
        }else{
            ctxt.fillStyle = 'red'
        }
        circle(ctxt,pos,knotradius)

        for(let edge of knot.edges){
            if(edge.checkValidity()){
                ctxt.strokeStyle = 'black'
            }else{
                ctxt.strokeStyle = 'red'
            }
            edgeOffsetmap.set(edge,edgeOffset[j])
            bezier(ctxt,knotmap.get(knot),knotmap.get(edge.target),edgeOffset[j])
            j++
        }
    }

    var positionDrawCountMap = new Map<Vector,number>()
    for(var pos of positions){
        positionDrawCountMap.set(pos,0)
    }
    for(let finger of fingers){
        var pos = knotmap.get(finger.knot) 
        var drawcount = positionDrawCountMap.get(pos)
        var drawoffset = pos.c()
        drawoffset.y += drawcount * knotradius * 2

        ctxt.fillStyle = 'pink'
        circle(ctxt,drawoffset,knotradius - 5)

        ctxt.fillStyle = 'black'
        ctxt.textAlign = 'center'
        
        ctxt.fillText(finger.stringpointer as any,drawoffset.x,drawoffset.y + 3)
        ctxt.fillText(text.substr(finger.stringpointer,1),drawoffset.x,drawoffset.y + 12)
        ctxt.fillText(finger.stack.length as any,drawoffset.x,drawoffset.y - 6)
        positionDrawCountMap.set(pos, drawcount + 1)

        for(let edge of finger.knot.edges){
            if(edge.enterable(text,finger.stringpointer)){
                ctxt.strokeStyle = 'red'
                bezier(ctxt,pos,knotmap.get(edge.target),edgeOffsetmap.get(edge))
            }
        }
    }
}



// var ast = parse(text,a)