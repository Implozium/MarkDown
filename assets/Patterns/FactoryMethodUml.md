```http://www.nomnoml.com/
#fill: #fff
#title: FactoryMethod
#.interface: italic
[<interface> Product]
[ConctreteProduct]
[ConctreteProduct] -:> [Product]

[Creator||
    +factoryMethod();
    +anOperation()]
[ConctreteCreator||
    +factoryMethod()]
[ConctreteCreator] -:> [Creator]

[ConctreteCreator] --> [ConctreteProduct]
```