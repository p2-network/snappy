import { getNetworkOutput } from "@pulumi/docker";

export const traefikNetwork = getNetworkOutput({
  name: "traefik_default"
});
