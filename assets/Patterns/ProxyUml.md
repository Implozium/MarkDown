```http://www.nomnoml.com/
#fill: #fff
#title: Proxy
#.interface: italic
[Client]
[Client] -> [Subject]

[<interface> Subject||
    +request()]

[RealSubject||
    +request()]
[RealSubject] -:> [Subject]

[Proxy||
    +request()]
[Proxy] -:> [Subject]
[Proxy] present-> [RealSubject]
```