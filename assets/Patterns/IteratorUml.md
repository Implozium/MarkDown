```http://www.nomnoml.com/
#fill: #fff
#title: Iterator
#.interface: italic
[<interface> Iterator||
    +next()]
    
[ConcerteIterator||
    +next(): Context]
[ConcerteIterator] -:> [Iterator]

[Client]
[Client] -> [Iterator]
[Client] -> [Aggregate]

[<interface> Aggregate||
    +createIterator()]
    
[ConcerteAggregate||
    +createIterator(): Context]
[ConcerteAggregate] -:> [Aggregate]

```