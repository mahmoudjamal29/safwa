/**
 * TypeScript Utility Types for Edge Admin Dashboard
 *
 * This module provides advanced TypeScript utility types for type-safe operations
 * on complex object structures and value extraction.
 */

/**
 * Recursively extracts all string values from nested objects, flattening the type hierarchy.
 *
 * This utility type performs a deep traversal of an object type, extracting only the string
 * values while preserving type safety. It's particularly useful for extracting configuration
 * values, translation keys, or any string literals from deeply nested object types.
 *
 * @template T - The input type to extract string values from
 *
 * @example
 * ```typescript
 * // Define a nested configuration object
 * const config = {
 *   api: {
 *     endpoints: {
 *       users: '/api/users',
 *       posts: '/api/posts'
 *     },
 *     timeout: 5000 // This number will be excluded
 *   },
 *   ui: {
 *     theme: 'dark',
 *     language: 'en'
 *   }
 * } as const;
 *
 * type ConfigStrings = DeepValueOf<typeof config>;
 * // Result: '/api/users' | '/api/posts' | 'dark' | 'en'
 *
 * // Usage in functions
 * function validateConfigValue(value: ConfigStrings) {
 *   // Only accepts the extracted string values
 *   return value.length > 0;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Translation keys example
 * const translations = {
 *   common: {
 *     buttons: {
 *       save: 'Save',
 *       cancel: 'Cancel',
 *       delete: 'Delete'
 *     },
 *     messages: {
 *       success: 'Operation successful',
 *       error: 'An error occurred'
 *     }
 *   },
 *   dashboard: {
 *     title: 'Dashboard',
 *     subtitle: 'Welcome back'
 *   }
 * } as const;
 *
 * type TranslationValues = DeepValueOf<typeof translations>;
 * // Result: 'Save' | 'Cancel' | 'Delete' | 'Operation successful' | 'An error occurred' | 'Dashboard' | 'Welcome back'
 * ```
 */
export type DeepValueOf<T> = T extends string
  ? T
  : T extends object
    ? { [K in keyof T]: DeepValueOf<T[K]> }[keyof T]
    : never

/**
 * Extracts all value types from the top-level properties of an object type.
 *
 * This utility type creates a union of all value types in an object, which is useful
 * for type-safe operations when you need to work with any value from an object without
 * knowing the specific key. It only operates on the immediate properties, not nested objects.
 *
 * @template T - The object type to extract values from
 *
 * @example
 * ```typescript
 * // User roles configuration
 * const userRoles = {
 *   admin: 'administrator',
 *   moderator: 'content_moderator',
 *   user: 'regular_user',
 *   guest: 'anonymous'
 * } as const;
 *
 * type UserRoleValues = ObjectValues<typeof userRoles>;
 * // Result: 'administrator' | 'content_moderator' | 'regular_user' | 'anonymous'
 *
 * function hasPermission(role: UserRoleValues, action: string): boolean {
 *   // Type-safe function that accepts any user role value
 *   return role === 'administrator' || (role === 'content_moderator' && action === 'moderate');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // API response status codes
 * const statusCodes = {
 *   ok: 200,
 *   created: 201,
 *   badRequest: 400,
 *   unauthorized: 401,
 *   notFound: 404,
 *   serverError: 500
 * } as const;
 *
 * type StatusCodeValues = ObjectValues<typeof statusCodes>;
 * // Result: 200 | 201 | 400 | 401 | 404 | 500
 *
 * function handleResponse(status: StatusCodeValues) {
 *   switch (status) {
 *     case 200:
 *     case 201:
 *       return 'Success';
 *     case 400:
 *     case 401:
 *     case 404:
 *       return 'Client Error';
 *     case 500:
 *       return 'Server Error';
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Mixed value types
 * const appConfig = {
 *   apiUrl: 'https://api.example.com',
 *   version: '1.0.0',
 *   retryAttempts: 3,
 *   enableLogging: true,
 *   features: ['auth', 'analytics']
 * } as const;
 *
 * type ConfigValues = ObjectValues<typeof appConfig>;
 * // Result: 'https://api.example.com' | '1.0.0' | 3 | true | readonly ['auth', 'analytics']
 * ```
 */
export type ObjectValues<T> = T[keyof T]
