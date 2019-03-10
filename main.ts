/// <reference path="utils.ts" />
/// <reference path="parser.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="rect.ts" />
/// <reference path="Store.ts" />
/// <reference path="system.ts" />
/// <reference path="clickManager.ts" />
/// <reference path="jsondef.ts" />




//https://github.com/tabatkins/railroad-diagrams
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)

var text = '[true,false,null]';



var cc = createCanvas(700,500)
var canvas = cc.canvas
var ctxt = cc.ctxt
ctxt.textAlign = "center"
ctxt.textBaseline = "middle"
var parser = new Parser(array.begin)

// braces.draw(ctxt,new Vector(200,200))
var tree = parser.run()
console.log(tree)

