import { ContainerLabel } from "@pulumi/docker/types/input";

export const traefikConfig = (
  app: string,
  authKey?: string
): ContainerLabel[] => {
  const middlewares = ["cf-connecting-ip@file"];
  const labels = [
    { label: "traefik.enable", value: "true" },
    {
      label: `traefik.http.routers.${app}.rule`,
      value: "Host(`ytdl.p2.network`)"
    },
    { label: `traefik.http.routers.${app}.entrypoints`, value: "web" },
    {
      label: `traefik.http.routers.${app}.middlewares`,
      value: middlewares.join(",")
    }
  ];

  if (authKey) {
    middlewares.push(`${app}-auth@docker`);
    labels.push(
      {
        label: `traefik.http.middlewares.${app}-auth.forwardauth.address`,
        value: `http://traefik-auth-cloudflare:8080/auth/${authKey}`
      },
      {
        label: `traefik.http.middlewares.${app}-auth.forwardauth.authResponseHeaders`,
        value: "X-Auth-User"
      }
    );
  }

  return labels;
};
