```http://www.nomnoml.com/
#fill: #fff
#title: Observer
#.interface: italic
#direction: right
[<interface> Subject||
    +attach(in o: Object);
    +deetach(in o: Object);
    +notify()]
    
[ConcreateSubject|
    -subjectState|]
[ConcreateSubject] -:> [Subject]

[<interface> Observer||
    +update()]
    
[ConcreateObserver|
    -observerState|
    +update()]
[ConcreateObserver] -:> [Observer]

[Subject] notify -> [Observer]

[ConcreateObserver] watch -> [ConcreateSubject]
```