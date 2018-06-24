```http://www.nomnoml.com/
#fill: #fff
#title: TemplateMethod
#.interface: italic    
[<interface> AbstractClass||
    +templateMethod();
    +subMethod()]
    
[ConcreateClass||
    +subMethod()]    
[ConcreateClass] -:> [AbstractClass]
```