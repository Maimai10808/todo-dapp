import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";

type Address = `0x${string}`;

async function main() {
  const connection = await hre.network.connect();
  const { viem } = connection;

  const publicClient = await viem.getPublicClient();

  const taskManager = await viem.deployContract("TaskManager", []);
  const taskManagerAddress = taskManager.address as Address;
  const chainId = Number(await publicClient.getChainId());
  const networkName = connection.networkName;

  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);
  console.log("TaskManager deployed to:", taskManagerAddress);

  const deployment = {
    network: networkName,
    chainId,
    taskManager: taskManagerAddress,
    createdAt: new Date().toISOString(),
  };

  const deploymentsDir = path.join(process.cwd(), "deployments");
  const deploymentsFile = path.join(deploymentsDir, `${networkName}.json`);

  fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    deploymentsFile,
    JSON.stringify(deployment, null, 2),
    "utf8",
  );

  console.log(`Deployment file saved to: ${deploymentsFile}`);

  const webEnvPath = path.join(process.cwd(), "..", "web", ".env.local");

  const envContent = `NEXT_PUBLIC_CHAIN_ID=${chainId}
NEXT_PUBLIC_TASK_MANAGER_ADDRESS=${taskManagerAddress}
NEXT_PUBLIC_NETWORK_NAME=${networkName}
`;

  fs.writeFileSync(webEnvPath, envContent, "utf8");

  console.log(`Web env file saved to: ${webEnvPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
