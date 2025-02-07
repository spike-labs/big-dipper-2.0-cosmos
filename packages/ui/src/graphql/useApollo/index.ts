import chainConfig from '@/chainConfig';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';
import webSocketImpl from 'isomorphic-ws';
import { useEffect, useState } from 'react';

/* A global variable that stores the Apollo Client. */
let globalApolloClient: ApolloClient<NormalizedCacheObject>;

// older version of Hasura doesn't support graphql-ws
const enableGraphqlWs = chainConfig.extra.graphqlWs;

/* Setting the default options for the Apollo Client. */
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

/* Creating a new HttpLink object. */
const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    chainConfig.endpoints.graphql ||
    'http://localhost:3000/v1/graphql',
  fetch,
});

/**
 * It creates a WebSocketLink object that connects to the GraphQL server via a WebSocket connection
 * @returns A WebSocketLink object.
 */
function createWebSocketLink() {
  // older version of Hasura doesn't support graphql-ws
  if (enableGraphqlWs) {
    return new GraphQLWsLink(
      createClient({
        url:
          process.env.NEXT_PUBLIC_GRAPHQL_WS ||
          chainConfig.endpoints.graphqlWebsocket ||
          'ws://localhost:3000/websocket',
        lazy: true,
        retryAttempts: Number.MAX_VALUE,
        retryWait: (_count) => new Promise((r) => setTimeout(r, 1000)),
        shouldRetry() {
          return true;
        },
        connectionAckWaitTimeout: 30000,
        webSocketImpl,
      })
    );
  }

  return new WebSocketLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_WS ||
      chainConfig.endpoints.graphqlWebsocket ||
      'ws://localhost:3000/websocket',
    options: {
      lazy: true,
      reconnect: true,
      reconnectionAttempts: Number.MAX_VALUE,
      timeout: 30000,
    },
    webSocketImpl,
  });
}

/**
 * It creates a new Apollo Client, and sets the default options for it
 * @param initialState - The initial state of the cache.
 * @returns A function that takes an initial state and returns an Apollo Client.
 */
function createApolloClient(initialState = {}) {
  /* Checking if the code is running on the server or the client. */
  const ssrMode = typeof window === 'undefined';
  /* Restoring the cache from the initial state. */
  const cache = new InMemoryCache().restore(initialState);

  /* Checking if the code is running on the server or the client. If it is running on the
  server, it uses the httpLink. If it is running on the client, it uses the split function to check
  if the query is a subscription. If it is, it uses the WebSocketLink. If it is not, it uses the
  httpLink. */
  const link = ssrMode
    ? httpLink
    : split(
        /* Checking if the query is a subscription. */
        ({ query }) => {
          const node = getMainDefinition(query);
          return (
            node.kind === Kind.OPERATION_DEFINITION &&
            node.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        createWebSocketLink(),
        httpLink
      );

  /* Creating a new Apollo Client. */
  const client = new ApolloClient({
    ssrMode,
    link,
    cache,
  });

  /* Setting the default options for the Apollo Client. */
  client.defaultOptions = defaultOptions;

  return client;
}

/**
 * If we're on the server, we create a new Apollo Client. If we're on the client, we create a new
 * Apollo Client if one doesn't already exist
 * @param {NormalizedCacheObject} [initialState] - This is the initial state of the Apollo Client. It
 * is used to hydrate the cache.
 * @returns A function that takes in an initialState and returns a new ApolloClient.
 */
export function initializeApollo(initialState?: NormalizedCacheObject) {
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return createApolloClient(initialState);

  /* Checking if the globalApolloClient is already created. If it is not, it creates it. */
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState);
  }

  return globalApolloClient;
}

/**
 * It initializes the Apollo Client with the initial state and returns the store
 * @param {NormalizedCacheObject} initialState - This is the initial state of the Apollo Client.
 * @returns The Apollo Client instance.
 */
function useApollo(initialState?: NormalizedCacheObject) {
  /* Setting the initial state of the Apollo Client. */
  const [store, setStore] = useState(() => initializeApollo(initialState));

  useEffect(() => {
    /* Setting the store with the new initial state. */
    setStore(initializeApollo(initialState));
  }, [initialState]);

  return store;
}

export default useApollo;
