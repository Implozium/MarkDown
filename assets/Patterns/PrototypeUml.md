```http://www.nomnoml.com/
#fill: #fff
#title: Prototype
#.interface: italic
[<interface> Prototype||
    +clone()]

[ConctretePrototype1||
    +clone()]
[ConctretePrototype1] -:> [Prototype]

[Client]
[Client] -> [Prototype]

[ConctretePrototype2||
    +clone()]
[ConctretePrototype2] -:> [Prototype]
```