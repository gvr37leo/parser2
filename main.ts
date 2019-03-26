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
var cc = createCanvas(700,500)
var canvas = cc.canvas
var ctxt = cc.ctxt
ctxt.textAlign = "center"
ctxt.textBaseline = "middle"

var text = '{"a":false}';




// var system = new System()
// Diagram(system,[
//     term('('),
//     star(choice([term('a'),subsystem(system)]),term(',')),
//     term(')'),
// ])


var parser = new Parser(object.begin)
var tree = parser.run()
console.log(tree)
