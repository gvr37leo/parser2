/// <reference path="utils.ts" />
/// <reference path="parser.ts" />

var text = '(())';
// var bracesHigh = Edge.highEdge(braces)
// braces.normal(new Edge(['('])).group(start => start.or([bracesHigh,new Edge(['a','b'])])).normal(new Edge([')'])).end()
// braces.normal(new Edge(['('])).or([bracesHigh,new Edge(['a','b'])]).normal(new Edge([')'])).end()




// var a = new Knot().begin()
// var b = new Knot()
// var c = new Knot()
// var d = new Knot()
// var e = new Knot()
// var f = new Knot().end()

// a.connect(new Edge(['(']),b)
// b.connect(new Edge([]),c)
// b.connect(new Edge([]),e)
// c.connect(Edge.highEdge(a),d)
// c.connect(new Edge(['a','b', '']),d)
// d.connect(new Edge([]),c)
// d.connect(new Edge([]),e)
// e.connect(new Edge([')']),f)

//https://github.com/tabatkins/railroad-diagrams
//https://tabatkins.github.io/railroad-diagrams/generator.html#Diagram(%0A%20%20'('%2C%0A%20%20ZeroOrMore(%0A%20%20%20%20Choice(0%2C'a'%2C'V')%0A%20%20)%2C%0A%20%20')'%2C%0A)
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

var braces:System = new System()
Diagram(braces,[
    terminal(new Edge(['('])),
    choice([
        terminal(new Edge([])),
        subsystem(braces),
    ]),
    terminal(new Edge([')'])),
])


var ast = parse(text,braces.begin)