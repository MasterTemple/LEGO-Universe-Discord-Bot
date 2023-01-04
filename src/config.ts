
import * as dotenv from 'dotenv';
import { env } from "process";
dotenv.config();

export const token = env.LUDB_TOKEN;
export const sqlitePath = env.LUDB_SQLITE_PATH;
export const localePath = env.LUDB_LOCALE_PATH;
export const explorerDomain = env.LUDB_EXPLORER_DOMAIN;
export const botColor = env.LUDB_BOT_COLOR;
export const logChannelId = env.LUDB_LOG_CHANNEL_ID;
export const reportChannelId = env.LUDB_REPORT_CHANNEL_ID;
export const LUServerName = env.LUDB_LU_SERVER_NAME;
export const LUServerIcon = env.LUDB_LU_SERVER_ICON;
export const footerText = env.LUDB_FOOTER_TEXT;
export const footerIcon = env.LUDB_FOOTER_ICON;
export const HQValidOnly = env.LUDB_HQ_VALID_ONLY;
export const decimalPlaces = parseInt(env.LUDB_DECIMAL_PLACES);
export const adminRoles = [...env.LUDB_ADMIN_ROLES.match(/\d+/g) || []];
