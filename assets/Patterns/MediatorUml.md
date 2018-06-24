```http://www.nomnoml.com/
#fill: #fff
#title: Mediator
#.interface: italic
[Mediator]
    
[ConcerteMediator]
[ConcerteMediator] -:> [Mediator]
[ConcerteMediator] refresh -> [ConcerteColleague]

[<interface> Colleague]
[Colleague] send -> [Mediator]
    
[ConcerteColleague]
[ConcerteColleague] -:> [Colleague]
```