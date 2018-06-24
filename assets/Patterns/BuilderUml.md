```http://www.nomnoml.com/
#fill: #fff
#title: Builder
#.interface: italic
[<interface> Builder||
    +buildPart()]

[ConctreteBuilder||
    +buildPart();
    +getResult()]
[ConctreteBuilder] -:> [Builder]

[Director||
    +construct()]
[Director] +- [Builder]
```