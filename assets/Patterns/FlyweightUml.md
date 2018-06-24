```http://www.nomnoml.com/
#fill: #fff
#title: Flyweight
#.interface: italic
[<interface> Flyweight||
    +operation(in extrinsicState)]

[FlyweightFactory||
    +getFlyweight(in key)]
[FlyweightFactory] +- [Flyweight]

[ConcreteFlyweight|
    -intrinsicState|
    +operation(in extrinsicState)]
[ConcreteFlyweight] -:> [Flyweight]

[UnsharedConcreteFlyweight|
    -intrinsicState|
    +operation(in extrinsicState)]
[UnsharedConcreteFlyweight] -:> [Flyweight]

[Client]
[Client] -> [FlyweightFactory]
[Client] -> [ConcreteFlyweight]
[Client] -> [UnsharedConcreteFlyweight]
```