/// <reference path="utils.ts" />
/// <reference path="parser.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />


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
c.connect(new Edge(['a','b', '']),d)
d.connect(new Edge([]),c)
d.connect(new Edge([]),e)
e.connect(new Edge([')']),f)

//https://github.com/tabatkins/railroad-diagrams
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)

debugger
var text = '((a))';
// var braces:System = new System()
// Diagram(braces,[
//     terminal(new Edge(['('])),
//     star(
//         choice([
//             terminal(new Edge(['a'])),
//             subsystem(braces),
//         ]),
//         terminal(new Edge([]))
//     ),
//     terminal(new Edge([')'])),
// ])
var cc = createCanvas(500,500)
var canvas = cc.canvas
var ctxt = cc.ctxt
drawSystem(ctxt,[a,b,c,d,e,f],[
    new Vector(200,200),
    new Vector(250,200),
    new Vector(300,200),
    new Vector(350,200),
    new Vector(400,200),
    new Vector(450,200),
])

function drawSystem(ctxt:CanvasRenderingContext2D, knots:Knot[], positions:Vector[]){
    var knotmap = new Map<Knot,Vector>()
    for(var i = 0; i < knots.length; i++){
        knotmap.set(knots[i],positions[i])
    }
    

    for(var i = 0; i < knots.length; i++){
        var knot = knots[i]
        var pos = positions[i]

        if(knot.checkValidity()){
            ctxt.fillStyle = 'black'
        }else{
            ctxt.fillStyle = 'red'
        }
        ctxt.ellipse(pos.x,pos.y,20,20,0,0,7)

        for(var edge of knot.edges){
            if(edge.checkValidity()){
                ctxt.fillStyle = 'black'
            }else{
                ctxt.fillStyle = 'red'
            }
            line(ctxt,knotmap.get(knot),knotmap.get(edge.target))
        }
    }
}

var ast = parse(text,a)