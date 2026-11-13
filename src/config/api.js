// Read backend URL from frontend environment variables (.env)
// Prefixed with VITE_ so it is accessible in Vite browser bundle
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050').replace(/\/$/, '');

export const API_ENDPOINTS = {
  GET_ORDER_LIST: `${BACKEND_URL}/api/getorderlist`,
  GET_CUSTOMER_ITEMS: `${BACKEND_URL}/api/get_customer_items`,
  HEALTH_CHECK: `${BACKEND_URL}/api/health`,
  SCHEMA_STATUS: `${BACKEND_URL}/api/schema/status`,
  CUSTOMER_ITEMS: `${BACKEND_URL}/api/customer-items`,
  REGISTER_CUSTOMER_ITEM: `${BACKEND_URL}/api/register_customer_item`
};
