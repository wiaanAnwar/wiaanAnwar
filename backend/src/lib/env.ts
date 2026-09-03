import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: required('JWT_SECRET'),
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  otpDevMode: process.env.OTP_DEV_MODE === 'true',
};

if (env.nodeEnv === 'production' && env.otpDevMode) {
  throw new Error('OTP_DEV_MODE must not be enabled in production — it bypasses OTP delivery.');
}

if (env.nodeEnv === 'production' && env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is too short for production use — generate a long random value.');
}
