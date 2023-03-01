import { ContainerLabel } from "@pulumi/docker/types/input";

export const flameLabels = (
  name: string,
  url: string,
  icon: string
): ContainerLabel[] => [
  { label: "flame.type", value: "application" },
  { label: "flame.name", value: name },
  { label: "flame.url", value: url },
  { label: "flame.icon", value: icon }
];
