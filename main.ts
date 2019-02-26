/// <reference path="utils.ts" />
/// <reference path="parser.ts" />

var text = '((a))';
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
c.connect(new Edge(['a','b']),d)
d.connect(new Edge([]),c)
d.connect(new Edge(['']),e)
e.connect(new Edge([')']),f)

var ast = parse(text,a)