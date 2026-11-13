// Read backend URL from frontend environment variables (.env)
// Prefixed with VITE_ so it is accessible in Vite browser bundle
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'https://demo-food-order-app-ir77-c0nkf13ac-probro01s-projects.vercel.app/').replace(/\/$/, '');
console.log('BACKEND_URL:', BACKEND_URL);
export const API_ENDPOINTS = {
  GET_ORDER_LIST: `${BACKEND_URL}/api/getorderlist`,
  REGISTER_ORDER: `${BACKEND_URL}/api/register_order`,
  GET_CUSTOMER_ITEMS: `${BACKEND_URL}/api/get_customer_items`,
  GET_CUSTOMER_ITEM: `${BACKEND_URL}/api/get_customer_item`,
  HEALTH_CHECK: `${BACKEND_URL}/api/health`,
  SCHEMA_STATUS: `${BACKEND_URL}/api/schema/status`,
  CUSTOMER_ITEMS: `${BACKEND_URL}/api/customer-items`,
  REGISTER_CUSTOMER_ITEM: `${BACKEND_URL}/api/register_customer_item`
};
