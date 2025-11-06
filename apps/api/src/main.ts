import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigTypes } from "./config/configuration";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<ConfigTypes> =
    app.get<ConfigService>(ConfigService);
  const port = configService.get<number>("port") as number;

  await app.listen(port);

  const appUrl =
    configService.get<AppEnvironment>("env") === "local"
      ? `http://localhost:${port}`
      : await app.getUrl();

  console.log(`Application is running on: ${appUrl}`);

  // Handle shutdown gracefully
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Starting graceful shutdown...");
    await app.close();
    process.exit(0);
  });
}

bootstrap();
