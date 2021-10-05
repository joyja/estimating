const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core')
const resolvers = require('./resolvers')
const fs = require('fs')

const start = async function () {
  let subscriptionServer
  const app = express()

  const httpServer = createServer(app)

  const schema = makeExecutableSchema({
    typeDefs: gql`
      ${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}
    `,
    resolvers,
  })

  server = new ApolloServer({
    schema,
    context() {
      // lookup userId by token, etc.
      // return { userId }
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect() {
        // lookup userId by token, etc.
        // return { userId }
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  )

  await server.start()
  server.applyMiddleware({ app })

  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  )
}

const stop = async function () {
  try {
    db.close()
  } catch (error) {}
  httpServer.close()
}

module.exports = { start, stop }
