import { Command } from "commander";
import { setConfig } from "../storage/configRepository";

export function registerConfigCommand(program: Command): void {

    const config = program
        .command("config")
        .description("Configuration commands");

    config
        .command("set <key> <value>")
        .description("Set configuration value")
        .action((key: string, value: string) => {

            const configKey =
                key === "max-retries"
                    ? "max_retries"
                    : key === "backoff-base"
                    ? "backoff_base"
                    : key;

            setConfig(configKey, value);

            console.log(`${configKey} updated to ${value}`);
        });

}