// import * as pulumi from "@pulumi/pulumi";
import { Container, Network, RemoteImage } from "@pulumi/docker";
import { traefikConfig } from "./traefikConfig";
import { traefikNetwork } from "./traefikNetwork";

const network = new Network("ytdl", {
  name: "ytdl"
});

const dbImage = new RemoteImage("ytdl/mongo", {
  name: "mongo"
});

const db = new Container("ytdl/db", {
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

const ytdlImage = new RemoteImage("ytdl/ytdl", {
  name: "tzahi12345/youtubedl-material:4.3"
});

const ytdl = new Container(
  "ytdl/ytdl",
  {
    name: "ytdl_ytdl",
    image: ytdlImage.imageId,
    restart: "unless-stopped",
    labels: traefikConfig("ytdl"),
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
