export function parseCSV<T>(csvText: string, headers: string[]): T[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headerMap = new Map<string, number>();
  
  const headerColumns = parseCSVLine(headerLine);
  headers.forEach((header) => {
    const index = headerColumns.findIndex((h) => 
      h.trim().toLowerCase() === header.toLowerCase()
    );
    if (index !== -1) {
      headerMap.set(header, index);
    }
  });

  const results: T[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = parseCSVLine(line);
    if (columns.length === 0) continue;

    const obj: any = {};
    headers.forEach((header) => {
      const index = headerMap.get(header);
      if (index !== undefined && columns[index]) {
        obj[header] = columns[index].trim();
      }
    });
    
    results.push(obj as T);
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

