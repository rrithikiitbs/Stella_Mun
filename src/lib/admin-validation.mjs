/** @param {Record<string, unknown>} record */
export function validateAdminRecord(record) {
  for (const field of ["registration_url", "external_url"]) {
    const value = record[field];
    if (typeof value === "string" && value && !/^https:\/\//i.test(value)) return `${field.replaceAll("_", " ")} must use an https:// URL.`;
  }
  if (typeof record.contact_email === "string" && record.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.contact_email)) return "Enter a valid contact email address.";
  return null;
}
