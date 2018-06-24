```http://www.nomnoml.com/
#fill: #fff
#title: Facade
#.interface: italic
[<package> Subsystem|
    [Component1];
    [Component2];
    [Component3];
    [ComponentN];
    [Facade]
    [Facade] -> [Component1]
    [Facade] -> [Component2]
    [Facade] -> [Component3]
    [Facade] -> [ComponentN]]

[Client]
[Client] -> [Subsystem]
```