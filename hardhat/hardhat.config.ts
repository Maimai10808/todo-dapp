import "dotenv/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(key: string): string {
  return key.startsWith("0x") ? key : `0x${key}`;
}

export default defineConfig({
  plugins: [hardhatToolboxViem],

  solidity: {
    version: "0.8.28",
  },

  networks: {
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },

    sepolia: {
      type: "http",
      chainType: "l1",
      url: requireEnv("SEPOLIA_RPC_URL"),
      accounts: [normalizePrivateKey(requireEnv("SEPOLIA_PRIVATE_KEY"))],
    },
  },
});
