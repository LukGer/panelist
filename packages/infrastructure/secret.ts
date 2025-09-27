export const secret = {
  BetterAuthSecret: new sst.Secret("BetterAuthSecret"),
  DatabaseUrl: new sst.Secret("DatabaseUrl"),
  GoogleClientId: new sst.Secret("GoogleClientId"),
  GoogleClientSecret: new sst.Secret("GoogleClientSecret"),
  CronApiKey: new sst.Secret("CronApiKey"),
};

export const allSecrets = Object.values(secret);
