import * as docker from "@pulumi/docker";

export const traefikNetwork = docker.getNetworkOutput({
  name: "traefik_default"
});
