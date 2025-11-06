import { FlattenProperties } from "../utils/types";

const config = () => ({
  port: parseInt(process.env.PORT ?? "5502", 10),
  env: process.env.ENVIRONMENT ?? "local",
  test: process.env.NODE_ENV === "test",
});

export type ConfigTypes = FlattenProperties<ReturnType<typeof config>>;

export default config;
