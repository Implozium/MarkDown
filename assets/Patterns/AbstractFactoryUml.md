```http://www.nomnoml.com/
#fill: #fff
#title: AbstractFactory
#.interface: italic
[<interface> AbstractFactory||
    +createProductA();
    +createProductB()]

[<interface> AbstractProduct]

[ConctreteProduct]
[ConctreteProduct] -:> [AbstractProduct]

[Client]
[Client] -> [AbstractFactory]
[Client] -> [AbstractProduct]

[ConctreteFactory||
    +createProductA();
    +createProductB()]
[ConctreteFactory] -:> [AbstractFactory]
```