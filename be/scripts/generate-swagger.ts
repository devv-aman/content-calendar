import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_CONSTANTS = {
  OUTPUT_FILE: "swagger.json",
  MESSAGES: {
    GENERATING: "Generating swagger.json...",
    SUCCESS: "swagger.json generated successfully!",
    ERROR: "Error generating swagger.json:",
  },
};

// We need to dynamically import to ensure dotenv is loaded first
const generateSwagger = async (): Promise<void> => {
  console.log(SWAGGER_CONSTANTS.MESSAGES.GENERATING);

  try {
    // Import after dotenv is configured
    const { swaggerSpec } = await import("../src/config/swagger.js");

    const outputPath = path.join(
      __dirname,
      "..",
      SWAGGER_CONSTANTS.OUTPUT_FILE
    );

    fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf8");

    console.log(SWAGGER_CONSTANTS.MESSAGES.SUCCESS);
    console.log(`Output: ${outputPath}`);
  } catch (error) {
    console.error(SWAGGER_CONSTANTS.MESSAGES.ERROR, error);
    process.exit(1);
  }
};

generateSwagger();
