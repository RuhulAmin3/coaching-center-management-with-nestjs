export const excludeField = <T, k extends keyof T>(obj: T, keys: k[]) => {
  for (const key of keys) {
    delete obj[key];
  }

  return obj;
};
