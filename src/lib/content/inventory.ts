/**
 * Kuttanad Flood Prediction System — merged data inventory + inventory-level summary statistics.
 */
import { categoriesA, type Category } from "./inventory-core";
import { categoriesB, auditFlags, auditGroups, type AuditFlag } from "./inventory-more";

export type { Category, Dataset, AuditState } from "./inventory-core";
export type { AuditFlag, FlagSeverity, FlagImpact, FlagStatus } from "./inventory-more";

export const inventory: Category[] = [...categoriesA, ...categoriesB];
export { auditFlags, auditGroups };

export const inventorySummary = {
  categories: "8",
  folders: "22",
  span: "1901–2026",
  formats: "CSV · XLS · GeoTIFF · GeoPackage · PDF",
  datasets: "40+",
  agencies: "10+",
};
