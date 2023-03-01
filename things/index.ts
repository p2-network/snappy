import * as pulumi from "@pulumi/pulumi";

import * as docker from "@pulumi/docker";

import "./src/ytdl";

// // Find the latest Ubuntu precise image.
// const ubuntuRemoteImage = new docker.RemoteImage("ubuntuRemoteImage", {
//   name: "ubuntu:precise"
// });
// // Start a container
// const ubuntuContainer = new docker.Container("ubuntuContainer", {
//   image: ubuntuRemoteImage.imageId
// });
