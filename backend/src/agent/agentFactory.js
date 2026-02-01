import { createAgentAccount } from "./accountAA.js";

export async function createTaxAgent() {
  const agent = await createAgentAccount();
  return agent;
}
