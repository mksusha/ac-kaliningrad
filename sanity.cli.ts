/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные из .env.local

export const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID || "2y01oix2",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: false,
    token: process.env.SANITY_TOKEN,
});
