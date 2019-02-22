/// <reference path="Knot.ts" />
/// <reference path="utils.ts" />
/// <reference path="parser.ts" />

var text = '((a))';
var braces = Knot.entry()
var bracesHigh = Edge.highEdge(braces)
// braces.normal(new Edge(['('])).group(start => start.or([bracesHigh,new Edge(['a','b'])])).normal(new Edge([')'])).end()
braces.normal(new Edge(['('])).or([bracesHigh,new Edge(['a','b'])]).normal(new Edge([')'])).end()
bracesHigh.subsystem = braces
var ast = parse(text,braces)