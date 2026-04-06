function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const CHAIN_ID = Number(
  requireEnv(process.env.NEXT_PUBLIC_CHAIN_ID, "NEXT_PUBLIC_CHAIN_ID"),
);

export const TASK_MANAGER_ADDRESS = requireEnv(
  process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS,
  "NEXT_PUBLIC_TASK_MANAGER_ADDRESS",
);

export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "localhost";
