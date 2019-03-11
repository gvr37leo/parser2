var object = new System()
var array = new System()
var value = new System()
var string = new System()
var number = new System()
var digit19 = ['1','2','3','4','5','6','7','8','9']
var digit = ['0'].concat(digit19)
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p','q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
var whitespace = [' ','\t','\n']
Diagram(object,[
    terminal(new Edge(['{'])),
    star(
        sequence([
            subsystem(string),
            terminal(new Edge([':'])),
            subsystem(value),
        ]),
        terminal(new Edge([','])),
    ),
    terminal(new Edge(['}'])),
])

Diagram(array,[
    terminal(new Edge(['['])),
    star(
        subsystem(value),
        terminal(new Edge([','])),
    ),
    terminal(new Edge([']'])),
])

Diagram(value,[
    choice([
        subsystem(string),
        subsystem(number),
        subsystem(object),
        subsystem(array),
        terminal(new Edge(['true'])),
        terminal(new Edge(['false'])),
        terminal(new Edge(['null'])),
    ])
])

var anycharexceptdoublequote = new Edge(['"'])
anycharexceptdoublequote.isWhitelist = false
Diagram(string,[
    terminal(new Edge(['"'])),
    star(
        terminal(anycharexceptdoublequote),
        skip(),
    ),
    terminal(new Edge(['"'])),
])

Diagram(number,[
    optional(terminal(new Edge(['-']))),
    choice([
        terminal(new Edge(['0'])),
        sequence([
            terminal(new Edge(digit19)),
            plus(skip(),terminal(new Edge(digit)))
        ])
    ]),
    optional(
        sequence([
            terminal(new Edge(['.'])),
            plus(
                terminal(new Edge(digit)),
                skip(),
            )
        ])
    ),
    optional(
        sequence([
            choice([
                terminal(new Edge(['e'])),
                terminal(new Edge(['E'])),
            ]),
            choice([
                terminal(new Edge(['+'])),
                skip(),
                terminal(new Edge(['-'])),
            ]),
            plus(terminal(new Edge(digit)),skip())
        ])
    )
])