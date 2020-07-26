```http://www.nomnoml.com/
#fill: #fff
#title: Composite
#.interface: italic
[<interface> Component||
    +operation();
    +add(in c: Composite);
    +remove(in c: Composite);
    +getChild(in i: int)]

[Leaf||
    +operation()]
[Leaf] -:> [Component]

[Composite||
    +operation();
    +add(in c: Composite);
    +remove(in c: Composite);
    +getChild(in i: int)]
[Composite] -:> [Component]
[Composite] children +- [Component]
```