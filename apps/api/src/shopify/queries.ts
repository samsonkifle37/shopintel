export const SHOP_BOOTSTRAP_QUERY = `#graphql
  query ShopBootstrap {
    shop {
      id
      name
      email
      myshopifyDomain
      currencyCode
      plan {
        displayName
        partnerDevelopment
      }
    }
  }
`;

export const BULK_PRODUCTS_QUERY = `#graphql
  query BulkProducts {
    products {
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          status
          tags
          publishedAt
          seo {
            title
            description
          }
          variants {
            edges {
              node {
                id
                title
                sku
                price
                compareAtPrice
                inventoryQuantity
                inventoryItem {
                  id
                  unitCost {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const BULK_ORDERS_QUERY = `#graphql
  query BulkOrders {
    orders {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          currentSubtotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            id
            email
          }
          lineItems {
            edges {
              node {
                id
                title
                sku
                quantity
                discountedTotalSet {
                  shopMoney {
                    amount
                  }
                }
                variant {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
