// version: '3.6'

// services:
//   flame:
//     secrets:
//       - password # optional but required for (1)
//     environment:
//       - PASSWORD_FILE=/run/secrets/password # optional but required for (1)

// # optional but required for Docker secrets (1)
// secrets:
//   password:
//     file: ./secrets/password

// volumes:
//   flame-data:

import { Container, Network, RemoteImage, Volume } from "@pulumi/docker";
import { interpolate } from "@pulumi/pulumi";
import { scopedName } from "./helpers/scopedName";
import { secretEnv } from "./helpers/secretEnv";
import { traefikConfig } from "./traefikConfig";
import { traefikNetworkId } from "./traefikNetwork";

const network = new Network(scopedName("flame"));

const flameImage = new RemoteImage("flame/flame", {
  name: "pawelmalak/flame:multiarch2.3.0"
});

const audience = secretEnv("DOCKER_FLAME_CF_AUDIENCE");
const password = secretEnv("DOCKER_FLAME_PASSWORD");

const data = new Volume("flame/data", {
  name: scopedName("flame/data")
});

const flame = new Container("flame/flame", {
  name: scopedName("flame/flame"),
  image: flameImage.imageId,
  restart: "unless-stopped",
  labels: [...traefikConfig("papatohu", audience)],
  volumes: [
    { volumeName: data.name, containerPath: "/app/data" },
    { hostPath: "/var/run/docker.sock", containerPath: "/var/run/docker.sock" }
  ],
  envs: [interpolate`PASSWORD=${password}`],
  networksAdvanced: [{ name: network.id }, { name: traefikNetworkId }]
});
