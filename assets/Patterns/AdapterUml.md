```http://www.nomnoml.com/
#fill: #fff
#title: Adapter
#.interface: italic
[<interface> Adapter||
    +operation()]
    
[Client]
[Client] -> [Adapter]

[ConctreteAdapter|
    -adaptee|
    +operation()]
[ConctreteAdapter] -:> [Adapter]
[ConctreteAdapter] -> [Adaptee]

[Adaptee||
    +adaptedOperation()]
```