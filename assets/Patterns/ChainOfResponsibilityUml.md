```http://www.nomnoml.com/
#fill: #fff
#title: ChainOfResponsibility
#.interface: italic
[Client]
[Client] -> [Handler]

[<interface> Handler||
    +handleRequest()]
[Handler] inherits-> [Handler]

[ConcreteHandler1||
    +handleRequest()]
[ConcreteHandler1] -:> [Handler]

[ConcreteHandler2||
    +handleRequest()]
[ConcreteHandler2] -:> [Handler]
```