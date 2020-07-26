```http://www.nomnoml.com/
#fill: #fff
#title: State
#.interface: italic
[<interface> State||
    +handle()]

[ConcreateState1||
    +handle()]
[ConcreateState1] -:> [State]

[ConcreateState2||
    +handle()]
[ConcreateState2] -:> [State]

[Context||
    +request()]

[Context] +- [State]
```