const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333',
  },
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'baio.eu.auth0.com',
    clientId:
      process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ||
      '5Thid6uCDtF5E1jmWb5zxQkjoO3HiQX4',
    redirectUrl:
      process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL || 'http://localhost:4200',
  },
};

export default appConfig;
