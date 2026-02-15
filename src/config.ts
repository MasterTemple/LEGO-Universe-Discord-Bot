
import * as dotenv from 'dotenv';
import { env } from "process";
dotenv.config();

export const token = env.LUDB_TOKEN;
export const sqlitePath = env.LUDB_SQLITE_PATH;
export const localePath = env.LUDB_LOCALE_PATH;
export const explorerDomain = env.LUDB_EXPLORER_DOMAIN;
const botColorFromEnv = env.LUDB_BOT_COLOR || "";
export const botColor = /^#(?:[\da-fA-F]{6})$/.test(botColorFromEnv) ? botColorFromEnv : "#00AE86";
export const logChannelId = env.LUDB_LOG_CHANNEL_ID;
export const reportChannelId = env.LUDB_REPORT_CHANNEL_ID;
export const LUServerName = env.LUDB_LU_SERVER_NAME;
export const LUServerIcon = env.LUDB_LU_SERVER_ICON;
export const footerText = env.LUDB_FOOTER_TEXT;
export const footerIcon = env.LUDB_FOOTER_ICON;
export const HQValidOnly = env.LUDB_HQ_VALID_ONLY === "true" ? true : false;
export const decimalPlaces = parseInt(env.LUDB_DECIMAL_PLACES);
export const adminRoles = [...env.LUDB_ADMIN_ROLES.match(/\d+/g) || []];
export const executeRoleId = env.LUDB_EXECUTE_ROLE_ID || "";
export const customEmojis = [...env.LUDB_CUSTOM_EMOJIS.matchAll(/(?<name>\w+),(?<id>\d+)/gim)].map((m) => m.groups);
