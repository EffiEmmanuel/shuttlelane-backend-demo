const API_PREFIX = process.env.API_PREFIX;

const routes = {
  API_AUTH_PREFIX: `${process.env.API_AUTH_PREFIX}`,
  API_ADMIN_LOGIN_ROUTE: `/admin/login`,
  API_DRIVER_LOGIN_ROUTE: `/driver/login`,
  API_VENDOR_LOGIN_ROUTE: `/vendor/login`,
  API_USER_LOGIN_ROUTE: `/user/login`,
  API_ADMIN_SIGNUP_ROUTE: `/admin/signup`,
  API_DRIVER_SIGNUP_ROUTE: `/driver/signup`,
  API_VENDOR_SIGNUP_ROUTE: `/vendor/signup`,
  API_USER_SIGNUP_ROUTE: `/user/signup`,
  API_USER_ROUTE: `${API_PREFIX}/users`,
  API_ADMIN_ROUTE: `${API_PREFIX}/admin`,
  API_BOOKING_ROUTE: `${API_PREFIX}/booking`,
  API_VEHICLE_CLASS_ROUTE: `${API_PREFIX}/vehicle-classes`,
  API_CARS_ROUTE: `${API_PREFIX}/cars`,
  API_PASS_ROUTE: `${API_PREFIX}/passes`,
  API_BLOG_ROUTE: `${API_PREFIX}/blog-posts`,
};

export default routes;
