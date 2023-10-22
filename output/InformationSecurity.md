[Содержание](#Содержание)
==========

    - [Аутентификация](#Аутентификация)
    - [HTTP Авторизация](#HTTP-Авторизация)
    - [JWT-токен](#JWT-токен)
        - [Серверные методы](#Серверные-методы)
- [XSS](#XSS)
    - [Атака CSRF](#Атака-CSRF)
        - [Защита](#Защита)
    - [Взаимодействие сервисов](#Взаимодействие-сервисов)
    - [Fuzzing](#Fuzzing)
    - [SDL: Secure Software Development Lifecycle](#SDL-Secure-Software-Development-Lifecycle)
    - [SAST: Static Application Security Testing](#SAST-Static-Application-Security-Testing)
    - [Cloud](#Cloud)

## <a id="Аутентификация" href="#Аутентификация">Аутентификация</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

**Аутентификация** - это проверка подлиности пользователя.

**Авторизация** - это проверка прав пользователя.

Хеш+соль для каждого пользователя с алгоритмом трудноперебираемым способом (к примеру Argon2).

**Пароли канарейки** для того чтобы можно было узнать что база была украдена, когда под этим паролем будет происходить авторизация.

Сервис для аутентификации должен содержать методы:
- для создания пользователя;
- для проверки пользователя.

Для хранения токена (JWT) можно использовать сервис воркер, который будет принимать токен и подставлять его в методы, для того чтобы через XSS не смог забрать его.

## <a id="HTTP-Авторизация" href="#HTTP-Авторизация">HTTP Авторизация</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Сценарий запрос-ответ подразумевает, что вначале сервер отвечает клиенту со статусом **401** (*Unauthorized*) и предоставляет информацию о порядке авторизации через заголовок `WWW-Authenticate` (для прокси авторизации используется заголовок `Proxy-Authenticate`), содержащий хотя бы один метод авторизации:  
`WWW-Authenticate: <тип_авторизации> realm=<сообщение_о_зоне_доступа>`

Ответ пользователя должен содержать заголовок `Authorization` (для прокси авторизации используется заголовок `Proxy-Authorization`) с данными авторизации:  
`Authorization: <тип_авторизации> <данные_для_авторизации>`

Виды:
- `Basic` - базовая HTTP Авторизация, формируется: `base64('<логин>:<пароль>')`:

    `Authorization: Basic base64('<логин>:<пароль>')`

- `Bearer` - авторизация через токен:

    `Authorization: Bearer <токен>`

## <a id="JWT-токен" href="#JWT-токен">JWT-токен</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Состоит из двух частей:
- **access-токен** - используется для получения ресурса, имеет малый срок жизни - до 30 мин, не храниться на сервере, храниться у пользователя памяти приложения;
- **refresh-токен** - используется для получения нового **access-токена**, когда у старого истек срок жизни, иммет большой срок жизни - до 30 дней, выдается сервером при авторизации и в дальнейшем храниться у пользователя в **cookies** - с установленными флагами: **Secure** - для передачи только по https, **httpOnly** - для невозможности получения доступа из JavaScript и иметь атрибут **SameSite** в значении **Strict** для защиты от CSRF аттак и на сервере, для того чтобы можно было его внести в черный список и не выдавать по нему новые **access-токены**. У пользователя должно быть определенное количество **refresh-токенов** и если выдаются новые, то самые старые должны удаляться.

Для безопасности лучше хранить **refresh-токен** в HttpOnly-куке, а **access-токен** хранить в памяти приложения.

### <a id="Серверные-методы" href="#Серверные-методы">Серверные методы</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

`POST /login` - по каким-то параметрам происходит авторизация и пользователю в ответ отправляется структура в ответе:
```json
{
    "token": "<access_token>"
}
```
И в куку `refreshToken` записывается **refresh-токен**.

`GET /refresh-token` - на основании токена из куки `refreshToken` происходит проверка **refresh-токен** что он есть в хранилище и тогда отправляется структура в ответе:
```json
{
    "token": "<access_token>"
}
```
иначе, если куки нет или токен в ней протух, то возвращается код **401**.

`POST /logout` - удаляет **refresh-токен** из хранилища на основании куки.

Остальные методы сервера работают в указаном порядке:
1. Пользователь в заголовке запроса помещает **access-токен**: `Authorization: <access_token>`;
2. Метод проверяет токен в заголовке, на то что он подписан правильно и не протух, если все плохо, то возвращает **401**;
3. Дальше метод извлекает информацию из токена и работает с ней;
4. Когда пользователь получает в ответе метода код **401**, то он идет в `/refresh-token` на получение нового токена и повторяет запрос уже с другим токеном.

<a id="XSS" href="#XSS">XSS</a> [<a id="Содержание" href="#Содержание">Содержание</a>]
===

**XSS** (Cross-site scripting) - это тип уязвимости, встречающийся в web приложениях. XSS атаки позволяют внедрить вредоносный скрипт (эксплойт) на страницу приложения, в результате чего у пользователей, посещающих эту страницу, можно выполнить произвольный код.

Основные типы XSS атак:
- **сохраняемый** - когда вредоносный скрипт через пользовательский ввод сохраняется в БД приложения и потом тем или иным способом запускается у клиента, посетившего страницу, которая создается на основе данных из той самой БД.
- **отраженный** - при такой уязвимости база не участвует в доставке вредоносного скрипта клиенту, то есть эксплойт нигде не хранится, атака обычно происходит через URL, когда например вредоносный скрипт пробрасывается через query параметры запроса, "отражается от сервера", где в процессе формирования страницы скрипт добавляется в тело ответа и пользователь получает страницу с уже встроенным в нее скриптом.
- **XSS на основе DOM** - особенность данного типа атаки в том, что она эксплуатирует уязвимости DOM. В отличии от двух других типов, в этом страница на сервере не меняется, то есть нам приходит совершенно безопасный HTML, но JS, который уже запустится на клиенте, отработает неправильно из-за внедренного в него скрипта. Главное отличие XSS на основе DOM в том, что эксплойт добавляется на страницу в рантайме, в момент запуска JS и он никогда не покидает пределы браузера.

Для защиты могут использоваться политики:
- **SOP** (Same-Origin Policy) - политика позволяющая определить, какие стрипты будут иметь доступ к данным, а какие нет, точнее даже с каких ресурсов мы разрешаем скриптам получать данные пользователя. Простыми словами помогает запретить скриптам с одного домена получить доступ к данным пользователя от другого домена.
- **CSP** (Content Security Policy) - политика, которая позволяет установить список доверенных источников скриптов, все скрипты из других источников просто будут проигнорированы.

## <a id="Атака-CSRF" href="#Атака-CSRF">Атака CSRF</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

**CSRF** (*Cross-Site Request Forgery*, также **XSRF**) - опаснейшая атака, которая приводит к тому, что хакер может выполнить на неподготовленном сайте массу различных действий от имени других, зарегистрированных посетителей. В общем это подделка запросов и отправка их с недоверяемого источника.

"**Классический**" сценарий атаки:
- пользователь является залогиненным на целевой сайт. У него есть сессия в куках;
- пользователь попадает на "злую страницу" на каком-то сайте;
- на злой странице находится форма такого вида:
    ```html
    <form action="<url_целевого_сайта>" method="<метод>">
        <input type="hidden" name="<имя>" value="<значение>">
        ...
    </form>
    ```
- при заходе на злую страницу JavaScript вызывает `form.submit`, отправляя таким образом форму на целевой сайт. Целевой сайт проверяет куки, видит, что посетитель авторизован и обрабатывает форму.

Итог атаки - пользователь, зайдя на злую страницу, ненароком совершил действия на сайте от своего имени. Содержимое действий сформировано хакером.

### <a id="Защита" href="#Защита">Защита</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Для избежания этого используют:
- сложные запросы (доп. заголовки) для выполнения preflight запроса;
- двойное подтверждение когда CSFR-токен из куки подставляется в форму и на сервере сверяется;
- получение CSFR-токена через ручку `/CSFR`.

Авторизация через токен избавляет от CSFR.

Куки не гарантируют, что форму создал именно тот пользователь, который в куках. Они только удостоверяют личность, но не данные.

Типичный способ защиты сайтов - это "**секретный ключ**" (*secret*), специальное значение, которое генерируется случайным образом и сохраняется в сессии посетителя. Его знает только сервер, посетителю его даже не показывают.

Затем на основе ключа генерируется "**токен**" (*token*). Токен делается так, чтобы с одной стороны он был отличен от ключа, в частности, может быть много токенов для одного ключа, с другой - чтобы было легко проверить по токену, сгенерирован ли он на основе данного ключа или нет.

Для каждого токена нужно дополнительное случайное значение, которое называют "**соль**" *salt*. Формула вычисления токена:  
`token = salt + ":" + MD5(salt + ":" + secret)`

Далее, токен добавляется в качестве скрытого поля к каждой форме, генерируемой на сервере.

При ее отправке сервер проверит скрытое поле, удостоверится в правильности токена, и лишь после этого отошлет сообщение.

"Злая страница" при всем желании не сможет сгенерировать подобную форму, так как не владеет `secret`, и токен будет неверным.

Такой токен также называют "**подписью**" формы, которая удостоверяет, что форма сгенерирована именно на сервере.

Эта подпись говорит о том, что автор формы - сервер, но ничего не гарантирует относительно ее содержания. Есть ситуации, когда необходимо быть уверенным, что некоторые из полей формы посетитель не изменил самовольно. Тогда можно включить в MD5 для формулы токена эти поля, например:  
`token = salt + ":" + MD5(salt + ":" + secret + ":" + field)`

## <a id="Взаимодействие-сервисов" href="#Взаимодействие-сервисов">Взаимодействие сервисов</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Межсервервисная аутентификация:
- токен с его подписью и ротацией;
- mTLS когда два сервиса проверяют ключи друг друга.

## <a id="Fuzzing" href="#Fuzzing">Fuzzing</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

**Митигация** - защита от перехода через переполнение.

**Фаззинг** - техника динамического тестирования.

Виды фаззинга:
- создание набора байт для передачи в программу;
- через измененные файлы для передачи в программу;
- основанный на грамматиках языка для передачи в программу.

**Корпус** - один из наборов файлов для последующей мутации и подачи на вход программы, которые порождают уникальные пути в программе.

## <a id="SDL-Secure-Software-Development-Lifecycle" href="#SDL-Secure-Software-Development-Lifecycle">SDL: Secure Software Development Lifecycle</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Заключается во внедрении в приложение безопасности как можно раньше и смещение ее к началу проетирования.

Этапы разработки:
- планирование:
    - участие ИБ в проектировании;
    - базовые требования по безопасности;
    - ревью ИБ;
    - моделирование угроз.
- разработка:
    - обучение;
    - линтеры для кода;
    - ревью кода.
- сборка:
    - статический анализ кода (SAST);
    - контроль Open Source (OSA).
- тестирование:
    - динамический анализ кода (DAST).
- релиз / запуск:
    - аудит безопасности.
- сопровождение:
    - мониторинг и сбор логов;
    - bug bounty;
    - сканирование на уязвимости;
    - тестирование на проникновение.

## <a id="SAST-Static-Application-Security-Testing" href="#SAST-Static-Application-Security-Testing">SAST: Static Application Security Testing</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

Это методология тестирования, которая позволяет находить уязвимости без необходимости запускать анализируемое приложения.

Это достигается благодаря поиску по регулярным выражениям или с помощью анализа AST кода.

**Source** - это код, которым начинается - небезопасный.  
**Sink** - это код, который выполняется - небезопасный.  
**Sanitaiser** - это код, что останавливает дальнейшее продвижения небезопасного кода из **Source** в **Sink**.

## <a id="Cloud" href="#Cloud">Cloud</a> [<a id="Содержание" href="#Содержание">Содержание</a>]

**IAAS** - Infrastructure as a Service:
- **Вычеслительный сервис** - cервис по созданию виртуальных машин. Деплой образа производится из базового образа, на основе которого строятся дальнейшие образы и изменение для ВМ должны производится деплоем нового образа и только так.
- **Сетевой сервис**:
    - VPC;
    - Балансер;
    - DNS.
- **Сервис хранилища**;
- **IAM** -  Identity and Access Management - центральная система описания ролей и доступов.

**PAAS** - Platform as a Service:
- Сервисы по управлению через API для ресурсов.

**SAAS** - Software as a Service:
- S3 - сервис для хранения блобов, где у каждого свое доменной имя и доступы.