# Шаблон NodeJS14-graphql.  

---
Node v14.16.0  
Npm v.6.14.11  
---
Пример реализации функции можно увидеть в файле [handler.js](./main/handler.js).  
В шаблоне реализована возможность отправки метрик Prometheus. Примеры использования Prometheus можно посмотреть здесь: https://github.com/siimon/prom-client  

1) В функции должен существовать handler(он же указывается в package.json -> main)
   На вход функция принимает 2 объекта:

   Входящий Event:
   ```
     class FunctionEvent {
       body - тело запроса
       headers - заголовки
       method - http метод
       query - query параметры
       path - path запроса
     }
   ```

   Входящий Context (используется для отправки ответа):
   ```
     class FunctionContext {
         status(value) {...return this;}   - указать код http статуса
         headers(value) {... return this;} - прикрепить к ответу заголовки
         succeed(value) {...}              - вернуть успешный ответ
         succeedFile(value) {...}          - вернуть файл (путь к файлу указывается относительно корневой папки)
         fail(value) {...}                 - вернуть ответ с ошибкой (будет возвращен ответ без пользовательских заголовков и с кодом 500)
     }
   ```

2) Unit тесты запускаются во время сборки через «npm run test», отредактируйте package.json, чтобы указать, как вы хотите их выполнять.
3) Перед запуском функции, будет запущен скрипт "prepare-function" (указанный в package.json).  
   В него вы можете добавить различные подготовительные команды, такие как "tsc", "webpack" и т.д.
4) Если вы используете typescript, то транспилированный handler нужно будет указать в package.json -> main
   Например: "dist/handler.js"
5) Если вам необходимо отправлять файлы (html, js, css, png и т.д.) в package.json необходимо указать директории,
   в которых они находятся (относительно корневой папки).  
   Например: `"staticContentFolders": ["content1","content2"]`  
   
   Далее их можно отправлять через метод `"succeedFile(...)"`.  
   Например: `"context.succeedFile("content1/js/script.js")"`

# Dataspace
⚠️ **При запуске должны быть определены переменные среды DATASPACE_URL, APP_KEY, APP_SECRET** ⚠️

Dataspace поддерживает взаимодействие по протоколу GraphQL. Поэтому для вызова в данном шаблоне используется библиотека [ApolloGraphQL](https://www.apollographql.com)

В [`apolloClient`](./main/apolloClient.js) создается клиент `ApolloClient` настроенный на DATASPACE_URL.  
Через него можно вызывать сервис Dataspace, выполнять различные операции - query, mutate и т.д.

Вызовы DataSpace, идущие через API-Gateway, должны быть подписаны ключом (APP_KEY) и секретом (APP_SECRET) из переменных среды.  
Для этого используется [signer.js](./main/signer-sdk/signer.js).  
Пример подписи и вызова Dataspace можно увидеть в [apolloClient.js](./main/apolloClient.js)

# Конфигурирование через ConfigMap:
Для возможности конфигурирования функции через ConfigMap пользователю необходимо:
1) Определить свойства в файле, например: `config/default.json`
2) В ```functions.yaml``` указать конфигурационные файлы для монтирования.
```yaml
    configs:
      - name: node14-example              # Имя конфигурации. В UI OSE ConfigMap будет называться <имя-функции>-cm-<имя конфигурации>
        files:                                # Список файлов для монтирования
          - config/default.json    # Полный путь до файла относительно директории с функцией
```
Данный файл будет смонтирован в папку `/app/config`.  
Далее в функции можете использовать этот файл, например через библиотеку [config](https://www.npmjs.com/package/config).

#Локальная отладка функции

### Prerequisites
На рабочей станции разработчика должны быть установлены:
 - `Node v14`
 - `Npm v6` 
 
### Локальное тестирование
Для локальной отладки функции нужно использовать Unit тесты.  
Существует множество фреймворков для Unit тестирования: Jest, Mocha, Storybook и т.д. Можете использовать любой.  
Во время деплоя функции будет запущен скрипт `npm run test`.  
В шаблоне реализован тест на `Jest`: [handler.test.js](./tests/handler.test.js)

Как сказано выше, handler на вход принимает 2 объекта - Event и Context (их можно увидеть в [test-entities](./tests/test-entities.js)).
