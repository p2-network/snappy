import { getProject, getStack } from "@pulumi/pulumi";

export const scopedName = (namePrefix: string) =>
  `${getProject()}-${getStack()}-${namePrefix
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
