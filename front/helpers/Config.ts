export default {
  APP_URL: process.env.VUE_APP_URL,
  APP_VK_REDIRECT_PATH: process.env.VUE_APP_VK_REDIRECT_PATH,
  APP_GOOGLE_REDIRECT_PATH: process.env.VUE_APP_GOOGLE_REDIRECT_PATH,

  API_URL: process.env.VUE_APP_API_URL,
  API_VK_AUTH_PATH: process.env.VUE_APP_API_VK_AUTH_PATH,
  API_GOOGLE_AUTH_PATH: process.env.VUE_APP_API_GOOGLE_AUTH_PATH,
  API_SIGNUP_PATH: process.env.VUE_APP_API_SIGNUP_PATH,
  API_SIGNIN_PATH: process.env.VUE_APP_API_SIGNIN_PATH,
} as Record<string, string>;
