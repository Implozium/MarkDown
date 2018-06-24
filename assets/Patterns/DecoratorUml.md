```http://www.nomnoml.com/
#fill: #fff
#title: Decorator
#.interface: italic
[<interface> Component||
    +operation()]

[ConcreteComponent||
    +operation()]
[ConcreteComponent] -:> [Component]

[Decorator||
    +operation()]
[Decorator] -:> [Component]
[Decorator] +- [Component]

[ConcreteDecorator|
    -addedState|
    +operation();
    +addedBehavior()]
[ConcreteDecorator] -:> [Decorator]
```