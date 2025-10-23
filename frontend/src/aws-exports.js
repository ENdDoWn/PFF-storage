const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.VITE_USER_POOL_ID,
      userPoolClientId: process.env.VITE_USER_POOL_CLIENT_ID,
      region: process.env.VITE_AWS_REGION,
    }
  }
};

export default awsConfig;
