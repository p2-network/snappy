import { ContainerLabel } from "@pulumi/docker/types/input";

const tailscaleIPs = 'ClientIP(`100.0.0.0/8`, `fd7a:115c:a1e0:ab12::/64`)';

export const traefikConfig = (app: string): ContainerLabel[] => {
  const routerPublic = `traefik.http.routers.${app}`;
  const routerPrivate = `traefik.http.routers.${app}-private`;
  const labels = [
    // Internet
    { label: "traefik.enable", value: "true" },
    { label: `${routerPublic}.rule`, value: `Host(\`${app}.i.m.ac.nz\`)` },
    { label: `${routerPublic}.entrypoints`, value: "websecure" },
    { label: `${routerPublic}.middlewares`, value: 'oauth2-proxy-redirect@docker' },
    { label: `${routerPublic}.tls`, value: "true" },
    { label: `${routerPublic}.tls.certresolver`, value: "route53" },
    { label: `${routerPublic}.tls.domains[0].main`, value: "*.i.m.ac.nz" },

    // Tailscale only
    { label: `${routerPrivate}.rule`, value: `Host(\`${app}.snappy.thepatrick.cloud\`) && ${tailscaleIPs}` },
    { label: `${routerPrivate}.entrypoints`, value: "websecure" },
    { label: `${routerPrivate}.tls`, value: "true" },
    { label: `${routerPrivate}.tls.certresolver`, value: "route53" },
    { label: `${routerPrivate}.tls.domains[0].main`, value: "*.snappy.thepatrick.cloud" },
  ];

  return labels;
};
