```http://www.nomnoml.com/
#fill: #fff
#title: Command
#.interface: italic
[Client]
[Client] -> [Receiver]
[Client] --> [ConcreteCommand]
[Client] -> [Invoker]

[Command||
    +execute()]

[ConcreteCommand||
    +execute()]
[ConcreteCommand] -:> [Command]
[ConcreteCommand] -> [Receiver]

[Receiver||
    +action()]
    
[Invoker]
[Invoker] +- [Command]
```