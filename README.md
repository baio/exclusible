# Exclusible Tech coding challenge

## Development

The project structure is based on [nx workspace](https://nx.dev/) which provides best practices for building node micorservices and websocket servers using [nestjs](https://nestjs.com/) framework.

Install dependency `yarn install`

Run everything in docker `docker-compose up` then go to browser and open `http://localhost:4200`

## Implementation details

+ Rates for BTC/USD are taken from [kraken trade websocket api](https://docs.kraken.com/websockets/#message-trade)
+ After new trade price received `buy / sell offset` added to the price value and application `exchangeRate` event emitted
+ Once spread config is changed next `exchangeRate` event will be emitted with new spread based on recent trade and spread config

### WS protocol 

+ Once new client connected to application ws it will receive `open` event
+ User can use `open` event to subscribe exchange rates stream by submitting `subscribe` event
+ Once `subscribe` event received, application will emit 5 latest exchange rates from the cache and then emit new ones when they received from kraken

### Resilience

If subscription to `kraken ws api` fails server will try to re-establish connection with `KRAKEN_FAILURE_RETRY_DELAY` interval (3000 by default), can test by turnoff network on your local machine

If client subscription to `application ws api` fails client will try to re-establish connection, you can test it by shutdown server (docker-compose) and then run it again.

### Efficiency

Subscription to `kraken ws api` would be establish only if some client is connected to the application, once client disconnected kraken connection also would be closed

All application clients are subscribed to the same kraken stream

## Project structure

+ `apps/client-app` - React next.js app will show list of the 5 latest rates with applied spread. 
The latest spread will be highlighted. In order to edit spread configuration user has to be authorized (see Authorization section)
+ `apps/config-service` - Service to store / retrieve spread configuration in typeorm database. This is microservice which use `rabbitmq` as a transport
+ `apps/exchange-api` - provides REST API to change spread configuration (public api to access `config-service`). also provides WebSocket API to get stream of the exchange rates with applied spread
+ `libs/rabbit-service-config` - library to read common config for `rabbitmq` services
+ `libs/rabbit-service-factory` - library to create microservice applications
+ `libs/rabbit-service-proxies` - library to call microservices in typesafe way also 
useful for abstracting access to microservices api 
+ `libs/shared` - shared models of the application, including microservices public api 
definitions

Libraries related to microservices implementation from above maybe overkill for such small project, but it just trying to demonstrate general approach when you solution have many
microservices which communicate with each other, main rules here:

+ When one microservice call another it should be done through abstracted proxy interface
+ Proxy interface definition should be contained in separate shared libarary
+ Proxy microservice implementation related to particular transport should be done in separate library
+ Link between proxy interface definition and implementation should be done on app boostraping with DI

## Authorization

Though task has following requirement `Mock an API for register/login/logout with JWT authentication`. Current implementation uses [Auth0 service](https://auth0.com/) to provide real authorization implementation using jwt tokens.

To access following API user should be authorized 
```
[Get] {{host}}/config/spread
[Post] {{host}}/config/spread

```

> Note: If you change API or Web client port to serve application, authorization will stop to work since it requires changes in `Auth0` configuration settings such as `Allowed callback url`

## Other notes
+ postman collection is in `postman` folder you need to update Authorization header (jwt toke n could be copied from the client request)
+ There is no tests at the moment due to the lack of time
+ Documentation generation also absent

## Task description

Tech coding challenge
Simple tech challenge, for user registering API that will be consumed by a
ReactJS/NextJS frontend. This will be managed by a Admin CRUD panel.
Th backend should also provide a websocket for the exchange rate for the pair
BTC/USD
This Exchange rate is calculated by getting the exchange rate from coinmarketcap
API/Kraken websocket (easiest exchange to get information) and adding a configurable
spread over it. This spread is configurable on the admin panel.
The exchange rate should be a microservice communicating with the datastorage
service.
You would need:
● Node.js
● Postgres or mysql
Your task:
● Mock an API for register/login/logout with JWT authentication
● Implement it taking this actions into consideration:
o User authentication flow
o Admin CRUD + spread change
o Websocket with subscription for Exchange rate on the FE (connecting to
external API or websocket)
● We give creative freedom, show us something new or improve upon
We will evaluate the architecture chosen, code implementation (javascript or
typescript), code structure, asset organization, unit testing (Jest), caching and linting,
database structure and ORM usage.
Nice to have:
● Postman collection
● Documentation generation
● Docker
● Structured commits

## Usefull links

https://wanago.io/2021/01/25/api-nestjs-chat-websockets/
https://docs.nestjs.com/websockets/gateways
https://www.youtube.com/watch?v=6xeeLKlVSAc
https://www.npmjs.com/package/nestjs-websocket
https://github.com/websockets/ws
https://docs.kraken.com/rest/
https://support.kraken.com/hc/en-us/sections/360003493672-WebSocket-APIs
https://support.kraken.com/hc/en-us/articles/360022327631-WebSocket-API-Market-data-feed-example
https://docs.kraken.com/websockets/#connectionDetails
https://docs.kraken.com/websockets/#message-ticker
https://rxjs.dev/api/webSocket/webSocket
https://docs.kraken.com/websockets/#message-trade
https://redux-observable.js.org/
https://auth0.com/docs/quickstart/spa/react/01-login
https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/
https://community.auth0.com/t/unauthorizederror-jwt-malformed-in-express-js/7352/26