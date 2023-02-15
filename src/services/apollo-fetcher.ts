
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode } from 'graphql';

// TODO: should type properly (`any`)
function apolloFetcher<T = any>(
  subgraphUrl: string,
  query: DocumentNode
): Promise<ApolloQueryResult<T>> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: subgraphUrl
    }),
    cache: new InMemoryCache()
  });

  return client.query({
    query: query,
    fetchPolicy: 'cache-first'
  });
}

export default apolloFetcher;
