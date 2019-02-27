/// <reference path="utils.ts" />
/// <reference path="parser.ts" />

var text = '(())';
// var bracesHigh = Edge.highEdge(braces)
// braces.normal(new Edge(['('])).group(start => start.or([bracesHigh,new Edge(['a','b'])])).normal(new Edge([')'])).end()
// braces.normal(new Edge(['('])).or([bracesHigh,new Edge(['a','b'])]).normal(new Edge([')'])).end()


var a = Knot.entry()
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
// Diagram(
//     '(',
//     ZeroOrMore(
//       Choice(0,'a','V')
//     ),
//     ')',
//   )
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)

// var braces = Diagram([
//     new Edge(['(']),
//     star(
//         or([
//             new Edge(['a']),
//             new Edge(['V']),
//         ]),
//         new Edge([])
//     ),
//     new Edge([')']),
// ])

//knot - (edge | ?) - knot
//melt the knots together

var ast = parse(text,a)