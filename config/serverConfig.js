const serverConfig = {
  //   mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017",
  //   appName: process.env.PROJECT_NAME ?? "Default name",
  //   port: process.env.PORT ? +process.env.PORT : 3000,
  //   environment: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "secret-phrase",
  jwtExpires: process.env.JWT_SECRET ?? "1d",
  MAILTRAP_USER: process.env.MAILTRAP_USER ?? "user",
  MAILTRAP_PASS: process.env.MAILTRAP_PASS ?? "password",
  emailFrom: process.env.emailFrom ?? "admin@example.com",
  BASE_URL: process.env.BASE_URL
};

module.exports = serverConfig;
