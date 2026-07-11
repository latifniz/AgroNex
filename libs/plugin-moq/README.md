# plugin-moq

Minimum Order Quantity (MOQ) plugin for Vendure. Enforces a minimum quantity per order line via an `OrderInterceptor` — used on the wholesale channel to ensure bulk order requirements are met.

MOQ is set as a custom field on each `ProductVariant`. If a buyer adds fewer units than the MOQ, the order is blocked with a user-facing error message.
