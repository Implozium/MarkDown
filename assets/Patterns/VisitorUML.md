```http://www.nomnoml.com/
#fill: #fff
#title: Visitor
#.interface: italic
[<interface> Visitor||
    +visitElementA(in a: ConcreateElementA);
    +visitElementB(in b: ConcreateElementB)]
    
[ConcreateVisitor||
    +visitElementA(in a: ConcreateElementA);
    +visitElementB(in b: ConcreateElementB)]
[ConcreateVisitor] -:> [Visitor]

[Client]
[Client] -> [Visitor]
[Client] -> [Element]
    
[<interface> Element||
    +accept(in v: Visitor)]
    
[ConcreateElementA||
    +accept(in v: Visitor)]    
[ConcreateElementA] -:> [Element]
    
[ConcreateElementB||
    +accept(in v: Visitor)]    
[ConcreateElementB] -:> [Element]
```