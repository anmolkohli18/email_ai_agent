import { ContactFormData } from '@/types/contact';

export interface CSVParseResult {
  success: boolean;
  contacts?: ContactFormData[];
  errors?: string[];
  warnings?: string[];
  totalRows?: number;
  validRows?: number;
}

export interface CSVValidationError {
  row: number;
  field: string;
  message: string;
}

/**
 * Parse CSV file to contacts
 */
export async function parseCSVFile(file: File): Promise<CSVParseResult> {
  try {
    const text = await file.text();
    return parseCSVText(text);
  } catch (error: any) {
    return {
      success: false,
      errors: [`Failed to read file: ${error.message}`],
    };
  }
}

/**
 * Parse CSV text content to contacts
 */
export function parseCSVText(csvText: string): CSVParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const contacts: ContactFormData[] = [];

  try {
    // Split into lines and filter empty lines
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return {
        success: false,
        errors: ['CSV file is empty'],
      };
    }

    // Parse header row
    const headerLine = lines[0];
    const headers = parseCSVRow(headerLine);

    // Validate required headers
    const headerMapping = mapHeaders(headers);

    if (!headerMapping.firstName) {
      errors.push('Missing required column: firstName (or First Name)');
    }
    if (!headerMapping.lastName) {
      errors.push('Missing required column: lastName (or Last Name)');
    }
    if (!headerMapping.email) {
      errors.push('Missing required column: email (or Email)');
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    // Parse data rows
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const rowNumber = i + 1;

      try {
        const values = parseCSVRow(line);

        // Skip if row is empty or has no values
        if (values.length === 0 || values.every((v) => !v)) {
          warnings.push(`Row ${rowNumber}: Empty row, skipping`);
          continue;
        }

        // Map values to contact fields
        const contact = mapRowToContact(values, headerMapping);

        // Validate contact
        const validationErrors = validateContact(contact, rowNumber);
        if (validationErrors.length > 0) {
          errors.push(...validationErrors);
          continue;
        }

        // Check for duplicate emails within CSV
        const emailLower = contact.email.toLowerCase();
        if (seenEmails.has(emailLower)) {
          warnings.push(
            `Row ${rowNumber}: Duplicate email "${contact.email}", skipping`
          );
          continue;
        }

        seenEmails.add(emailLower);
        contacts.push(contact);
      } catch (error: any) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }

    // Return results
    const hasErrors = errors.length > 0;
    const hasContacts = contacts.length > 0;

    if (!hasContacts && hasErrors) {
      return {
        success: false,
        errors,
        warnings,
        totalRows: lines.length - 1,
        validRows: 0,
      };
    }

    return {
      success: true,
      contacts,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      totalRows: lines.length - 1,
      validRows: contacts.length,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [`Failed to parse CSV: ${error.message}`],
    };
  }
}

/**
 * Parse a CSV row handling quoted values and commas
 */
function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current.trim());

  return values;
}

/**
 * Map CSV headers to contact fields
 */
function mapHeaders(headers: string[]): Record<string, number> {
  const mapping: Record<string, number> = {};

  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().trim();

    // Map common variations to standard fields
    if (
      normalized === 'firstname' ||
      normalized === 'first name' ||
      normalized === 'first_name'
    ) {
      mapping.firstName = index;
    } else if (
      normalized === 'lastname' ||
      normalized === 'last name' ||
      normalized === 'last_name'
    ) {
      mapping.lastName = index;
    } else if (normalized === 'email' || normalized === 'email address') {
      mapping.email = index;
    } else if (
      normalized === 'company' ||
      normalized === 'organization' ||
      normalized === 'company name'
    ) {
      mapping.company = index;
    } else if (
      normalized === 'notes' ||
      normalized === 'personalization notes' ||
      normalized === 'personalization_notes'
    ) {
      mapping.personalizationNotes = index;
    } else {
      // Custom field
      mapping[`custom_${normalized.replace(/\s+/g, '_')}`] = index;
    }
  });

  return mapping;
}

/**
 * Map CSV row values to Contact object
 */
function mapRowToContact(
  values: string[],
  headerMapping: Record<string, number>
): ContactFormData {
  const contact: ContactFormData = {
    firstName: '',
    lastName: '',
    email: '',
  };

  // Map standard fields
  if (headerMapping.firstName !== undefined) {
    contact.firstName = values[headerMapping.firstName] || '';
  }
  if (headerMapping.lastName !== undefined) {
    contact.lastName = values[headerMapping.lastName] || '';
  }
  if (headerMapping.email !== undefined) {
    contact.email = values[headerMapping.email] || '';
  }
  if (headerMapping.company !== undefined) {
    const company = values[headerMapping.company]?.trim();
    if (company) {
      contact.company = company;
    }
  }
  if (headerMapping.personalizationNotes !== undefined) {
    const notes = values[headerMapping.personalizationNotes]?.trim();
    if (notes) {
      contact.personalizationNotes = notes;
    }
  }

  // Map custom fields
  const customFields: Record<string, string> = {};
  Object.keys(headerMapping).forEach((key) => {
    if (key.startsWith('custom_')) {
      const fieldName = key.replace('custom_', '');
      const value = values[headerMapping[key]]?.trim();
      if (value) {
        customFields[fieldName] = value;
      }
    }
  });

  if (Object.keys(customFields).length > 0) {
    contact.customFields = customFields;
  }

  return contact;
}

/**
 * Validate contact data
 */
function validateContact(
  contact: ContactFormData,
  rowNumber: number
): string[] {
  const errors: string[] = [];

  // Required fields
  if (!contact.firstName || !contact.firstName.trim()) {
    errors.push(`Row ${rowNumber}: First name is required`);
  }

  if (!contact.lastName || !contact.lastName.trim()) {
    errors.push(`Row ${rowNumber}: Last name is required`);
  }

  if (!contact.email || !contact.email.trim()) {
    errors.push(`Row ${rowNumber}: Email is required`);
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      errors.push(`Row ${rowNumber}: Invalid email format "${contact.email}"`);
    }
  }

  // Length validations
  if (contact.firstName && contact.firstName.length > 100) {
    errors.push(`Row ${rowNumber}: First name too long (max 100 characters)`);
  }

  if (contact.lastName && contact.lastName.length > 100) {
    errors.push(`Row ${rowNumber}: Last name too long (max 100 characters)`);
  }

  if (contact.email && contact.email.length > 255) {
    errors.push(`Row ${rowNumber}: Email too long (max 255 characters)`);
  }

  if (contact.company && contact.company.length > 200) {
    errors.push(`Row ${rowNumber}: Company name too long (max 200 characters)`);
  }

  return errors;
}

/**
 * Generate sample CSV template
 */
export function generateSampleCSV(): string {
  const headers = [
    'firstName',
    'lastName',
    'email',
    'company',
    'personalizationNotes',
  ];

  const sampleRows = [
    [
      'John',
      'Doe',
      'john.doe@example.com',
      'Acme Corp',
      'Met at tech conference',
    ],
    [
      'Jane',
      'Smith',
      'jane.smith@startup.io',
      'Startup Inc',
      'Interested in product demo',
    ],
    [
      'Robert',
      'Johnson',
      'robert@company.com',
      'Tech Solutions',
      'Follow up on proposal',
    ],
  ];

  const rows = [headers, ...sampleRows];
  return rows.map((row) => row.join(',')).join('\n');
}

/**
 * Download CSV template
 */
export function downloadSampleCSV(): void {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'contacts_template.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
