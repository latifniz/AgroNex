import { gql } from 'graphql-tag';

export const lowStockApiExtensions = gql`
  type LowStockVariant {
    id: ID!
    productName: String!
    variantName: String!
    stockOnHand: Int!
    stockAllocated: Int!
    threshold: Int!
  }

  extend type Query {
    lowStockVariants: [LowStockVariant!]!
  }
`;
