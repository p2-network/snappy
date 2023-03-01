import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import { flameLabels } from "./flameLabels";
import { traefikConfig } from "./traefikConfig";
import { traefikNetwork } from "./traefikNetwork";

const network = new docker.Network("ytdl", {
  name: "ytdl"
});

// const ubuntuRegistryImage = docker.getRegistryImage({
//   name: "ubuntu:precise",
// });
// const ubuntuRemoteImage = new docker.RemoteImage("ubuntuRemoteImage", {
//   name: ubuntuRegistryImage.then(ubuntuRegistryImage => ubuntuRegistryImage.name),
//   pullTriggers: [ubuntuRegistryImage.then(ubuntuRegistryImage => ubuntuRegistryImage.sha256Digest)],
// });

const dbImage = new docker.RemoteImage("ytdl/mongo", {
  name: "mongo"
});

const db = new docker.Container("ytdl/db", {
  name: "ytdl_mongo",
  image: dbImage.imageId,
  restart: "always",
  volumes: [
    {
      hostPath: "/homelab/ytdl/db",
      containerPath: "/data/db"
    }
  ],
  networksAdvanced: [{ name: network.id }]
});

const ytdlImage = new docker.RemoteImage("ytdl/ytdl", {
  name: "tzahi12345/youtubedl-material:4.3"
});

const ytdl = new docker.Container(
  "ytdl/ytdl",
  {
    name: "ytdl_ytdl",
    image: ytdlImage.imageId,
    restart: "unless-stopped",
    labels: [
      ...traefikConfig(
        "ytdl",
        "89cd7a64eefb09187f4b51a4cbbf08639d80df055de4208931d36ce25747924a"
      ),
      ...flameLabels("ytdl", "https://ytdl.p2.network/", "tune-vertical")
    ],
    envs: [
      "ALLOW_CONFIG_MUTATIONS=true",
      "ytdl_mongodb_connection_string=mongodb://db:27017",
      "ytdl_use_local_db=false",
      "write_ytdl_config=true"
    ],
    volumes: [
      {
        hostPath: "/homelab/ytdl/appdata",
        containerPath: "/app/appdata"
      },
      {
        hostPath: "/homelab/ytdl/audio",
        containerPath: "/app/audio"
      },
      {
        hostPath: "/homelab/ytdl/video",
        containerPath: "/app/video"
      },
      {
        hostPath: "/homelab/ytdl/subscriptions",
        containerPath: "/app/subscriptions"
      },
      {
        hostPath: "/homelab/ytdl/users",
        containerPath: "/app/users"
      }
    ],
    ports: [
      {
        external: 8998,
        internal: 17442
      }
    ],
    networksAdvanced: [{ name: network.id }, { name: traefikNetwork.id }]
  },
  { dependsOn: [db] }
);
