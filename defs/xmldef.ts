// var element = new System()
// var attirbute = new System()
// var variablename = new System()
// var variablesymbols = alphabet.concat(digit).concat(['$','_'])
// Diagram(element,[
//     terminal(new Edge(['<'])),
//     subsystem(variablename),
//     star(subsystem(attirbute),skip()),
//     choice([
//         sequence([
//             terminal(new Edge(['/>'])),
//         ]),
//         sequence([
//             terminal(new Edge(['>'])),
//             star(subsystem(element),skip()),
//             terminal(new Edge(['</'])),
//             subsystem(variablename),
//             terminal(new Edge(['>'])),
//         ]),
//     ]),

// ])

// Diagram(attirbute,[
//     //name
//     terminal(new Edge(['='])),
//     subsystem(string)
// ])

// Diagram(variablename,[
//     terminal(new Edge(alphabet)),
//     star(
//         terminal(new Edge(variablesymbols)),
//         skip(),
//     )
// ])