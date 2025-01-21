import { Output, secret } from "@pulumi/pulumi";

export const secretEnv = (key: string): Output<string> => {
  const value = process.env[key];
  if (value == null) {
    throw new Error(`${key} environment variable not set`);
  }
  return secret(value);
};
