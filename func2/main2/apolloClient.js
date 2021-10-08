const {ApolloClient, gql, InMemoryCache, HttpLink} = require('@apollo/client/core')
const {fetch} = require('cross-fetch')
const signer = require('./signer-sdk/signer.js')

// Отключаем проверку сертификата
const https = require("https");
https.globalAgent.options.rejectUnauthorized = false

let dataspaceUrl = process.env.DATASPACE_URL
let graphQLStatus

if (!dataspaceUrl) {
    graphQLStatus = 'DATASPACE_URL environment variable is not set. GraphQL client disabled'
} else {
    graphQLStatus = `Dataspace URL: ${dataspaceUrl}`
}

// Инициализация Apollo клиента
// Вы можете экспортировать его и совершать операции: client.mutate(...), client.query(...).
// Исходящие запросы подписываются ключом и секретом(APP_KEY и APP_SECRET из переменных среды)
const client = (() => {
    // Подпись запроса
    const authFetch = (uri, options) => {
        let appKey = process.env.APP_KEY
        let appSecret = process.env.APP_SECRET

        if (!appKey || !appSecret) {
            console.log("API_SECRET or API_KEY is undefined. Request will not be signed")
        } else {
            let sig = new signer.Signer()
            sig.Key = appKey
            sig.Secret = appSecret
            let request = new signer.HttpRequest(options.method, uri, options.headers, options.body)
            sig.Sign(request)
        }

        return fetch(uri, options);
    };

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({uri: dataspaceUrl, fetch: authFetch})
    })
})()

// Пример вызова DataSpace с подписью
const callDataspace = async () => {
    const query = "query ($paramId: ID!) { some_operation( id: $paramId) { some_field } }"
    const variables = {"paramId": "paramValue"}
    return await client.query({query: gql`${query}`, variables: variables})
}

module.exports = {client, graphQLStatus, callDataspace}