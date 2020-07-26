```http://www.nomnoml.com/
#fill: #fff
#title: Memento
#.interface: italic
[Caretaker]
[Caretaker] +- [Memento]

[Memento|
    -state|]

[Organizator|
    -state|
    +setMemento(in m:Memento);
    +createMemento()]
[Organizator] --> [Memento]
```