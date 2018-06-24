```http://www.nomnoml.com/
#fill: #fff
#title: Interpreter
#.interface: italic
[Client]
[Client] -> [Context]
[Client] -> [AbstractExpression]

[<interface> AbstractExpression||
    +interpret()]

[NonterminalExpression||
    +interpret(): Context]
[NonterminalExpression] -:> [AbstractExpression]
[NonterminalExpression] +- [AbstractExpression]

[TerminalExpression||
    +interpret(): Context]
[TerminalExpression] -:> [AbstractExpression]
    
[Context]
```