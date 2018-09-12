[Содержание](#Содержание)
==========

- [Docker](#Docker)

<a id="Docker" href="#Docker">Docker</a>
======

`service docker start` - запуск службы docker.  
`service docker stop` - остановка службы docker.

`docker stats $(docker ps -q)` - непрерывно выводит в консоль статуса работающих контейнеров.

`docker ps --all` - выводит в консоль статус контейнеров.

`docker logs -f <контейнер>` - непрерывно выводит в консоль лог контейнера докера.

`docker exec -it <контейнер> sh` - подключается к докеру для выполнения команд. `exit` - выход из докера.

`docker-compose down` - остановка всех контейнеров.  
`docker-compose up -d` - запуск всех остановленых контейнеров.  