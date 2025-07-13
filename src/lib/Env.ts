import {createEnv} from '@t3-oss/env-nextjs';
import {z} from 'zod';

export const Env = createEnv({
  server: {},
  client: {},
  shared: {
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000')
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  }
});
