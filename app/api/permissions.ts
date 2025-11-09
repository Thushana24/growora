/**
 * Permission Structure Overview:
 * Permissions are defined using [RESOURCE]:[ACTION]:[SCOPE].
 *
 * RESOURCE: Entity (e.g., USER, PRODUCT, ORDER, CART, OTP)
 * ACTION: CREATE, READ, UPDATE, DELETE, or * for all
 * SCOPE:
 *   OWN – only for the user’s own data
 *   ALL – for all data in the system
 */

export const ADMIN_PERMISSIONS = [
  "USER:*:*", // Admin can manage all users
  "PRODUCT:*:*", // Admin can manage all products
  "ORDER:*:*", // Admin can manage all orders
  "CART:*:*", // Admin can manage all carts
  "OTP:*:*", // Admin can manage all OTPs
];

export const BUYER_PERMISSIONS = [
  "USER:READ:OWN", // Buyer can read their own profile
  "USER:UPDATE:OWN", // Buyer can update their own profile
  "PRODUCT:READ:ALL", // Buyer can view all products
  "ORDER:CREATE:OWN", // Buyer can create orders
  "ORDER:READ:OWN", // Buyer can read their own orders
  "CART:CREATE:OWN", // Buyer can add to their cart
  "CART:READ:OWN", // Buyer can read their own cart
  "CART:UPDATE:OWN", // Buyer can update cart items
  "CART:DELETE:OWN", // Buyer can remove items from cart
  "OTP:READ:OWN", // Buyer can read OTPs sent to them
  "OTP:CREATE:OWN", // Buyer can request OTPs
];
