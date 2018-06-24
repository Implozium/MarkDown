```http://www.nomnoml.com/
#fill: #fff
#title: Bridge
#.interface: italic
[<interface> Implementor||
    +operationImpl()]
    
[Abstraction||
    +operation()]
[Abstraction] +- [Implementor]

[ConctreteImplementorA||
    +operationImpl()]
[ConctreteImplementorA] -:> [Implementor]

[ConctreteImplementorB||
    +operationImpl()]
[ConctreteImplementorB] -:> [Implementor]
```