```http://www.nomnoml.com/
#fill: #fff
#title: Strategy
#.interface: italic    
[<interface> Strategy||
    +execute()]
    
[ConcreateStrategyA||
    +execute()]    
[ConcreateStrategyA] -:> [Strategy]
    
[ConcreateStrategyB||
    +execute()]    
[ConcreateStrategyB] -:> [Strategy]

[Context]

[Context] +- [Strategy]
```