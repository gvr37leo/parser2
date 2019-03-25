/// <reference path="utils.ts" />
/// <reference path="parser.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="rect.ts" />
/// <reference path="store.ts" />
/// <reference path="knot.ts" />
/// <reference path="edge.ts" />
/// <reference path="system.ts" />
/// <reference path="clickManager.ts" />
/// <reference path="defs/jsondef.ts" />
/// <reference path="treeNode.ts" />
/// <reference path="edgeChain.ts" />
/// <reference path="finger.ts" />
/// <reference path="defs/xmldef.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="slider.ts" />



//https://github.com/tabatkins/railroad-diagrams
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)


var text = '{"a":"b"}';

var cc = createCanvas(700,500)
var canvas = cc.canvas
var ctxt = cc.ctxt
ctxt.textAlign = "center"
ctxt.textBaseline = "middle"
// var parser = new Parser(object.begin)

var test = new System()
Diagram(test,[
    simpleTerminal('a'),
    simpleTerminal('a'),
])

var test = new System()
Diagram(test,[
    plus(simpleTerminal('a'),skip()),
    plus(simpleTerminal('a'),skip()),
])

test.draw(ctxt,new Vector(200,200))
test.draw(ctxt,new Vector(200,300))

// ctxt.strokeStyle = 'red'
// for(var edgenode of edgenodes.values()){
//     line(ctxt,edgenode.left(),edgenode.right())
// }

// ctxt.fillStyle = 'pink'
// for(var knotpos of knotpositions.values()){
//     circle(ctxt,knotpos,5)
// }

// for(var i = 0; i < 100; i++){
//     parser
// }

// var tree = parser.run()
// console.log(tree)

// a   b
//[0]-[0]
//[1]-[0] set a to 1
//[1]-[1] a sets b to 1
//[1]-[1] b is notified and triggered but doesnt set a
//maybe set event with a handled flag?

var a1
var b2
class Eventx<T>{
    handled = false

    constructor(public val:T){

    }
}
var a = new Box(new Eventx(0))
var b = new Box(new Eventx(0))

a.onchange.listen(v => {
    a1 = v
    if(!v.handled){
        v.handled = true
        b.set(v)
    }
})

b.onchange.listen(v => {
    b2 = v
    if(!v.handled){
        v.handled = true
        a.set(v)
    }
})

a.set(new Eventx(1))
console.log(1)