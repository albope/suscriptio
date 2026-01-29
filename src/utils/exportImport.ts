import type { Subscription } from '../types/subscription';
import { format } from 'date-fns';

export interface BackupData {
  version: number;
  exportedAt: string;
  subscriptions: Subscription[];
}

// UTF-8 BOM for Excel compatibility
const UTF8_BOM = '\uFEFF';

export function exportToJson(subscriptions: Subscription[]): void {
  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    subscriptions,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suscriptio-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateBackupFile(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'number') return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!Array.isArray(d.subscriptions)) return false;

  // Validate each subscription has required fields
  for (const sub of d.subscriptions) {
    if (!sub || typeof sub !== 'object') return false;
    const s = sub as Record<string, unknown>;
    if (typeof s.id !== 'string') return false;
    if (typeof s.name !== 'string') return false;
    if (typeof s.cost !== 'number') return false;
  }

  return true;
}

export async function importFromJson(file: File): Promise<Subscription[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!validateBackupFile(data)) {
    throw new Error('Invalid backup file format');
  }

  // Convert date strings back to Date objects
  return data.subscriptions.map((sub) => ({
    ...sub,
    nextPaymentDate: new Date(sub.nextPaymentDate),
    createdAt: new Date(sub.createdAt),
    updatedAt: new Date(sub.updatedAt),
  }));
}

/**
 * Escapes a value for CSV (handles commas, quotes, and newlines)
 */
function escapeCsvValue(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If the value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export subscriptions to CSV format with UTF-8 BOM for Excel compatibility
 */
export function exportToCsv(subscriptions: Subscription[]): void {
  // CSV headers
  const headers = [
    'Nombre',
    'Coste',
    'Moneda',
    'Frecuencia',
    'Próximo pago',
    'Estado',
    'Categoría',
    'Etiquetas',
    'Notas',
    'URL',
  ];

  // Map frequency and status to Spanish labels
  const frequencyLabels: Record<string, string> = {
    monthly: 'Mensual',
    yearly: 'Anual',
  };

  const statusLabels: Record<string, string> = {
    active: 'Activa',
    canceled: 'Cancelada',
  };

  const categoryLabels: Record<string, string> = {
    streaming: 'Streaming',
    productivity: 'Productividad',
    cloud_storage: 'Almacenamiento',
    music: 'Música',
    gaming: 'Juegos',
    health_fitness: 'Salud y fitness',
    news_learning: 'Noticias y aprendizaje',
    utilities: 'Utilidades',
    other: 'Otro',
  };

  // Build CSV rows
  const rows = subscriptions.map((sub) => [
    escapeCsvValue(sub.name),
    escapeCsvValue(sub.cost.toFixed(2)),
    escapeCsvValue(sub.currency),
    escapeCsvValue(frequencyLabels[sub.billingFrequency] || sub.billingFrequency),
    escapeCsvValue(format(new Date(sub.nextPaymentDate), 'dd/MM/yyyy')),
    escapeCsvValue(statusLabels[sub.status] || sub.status),
    escapeCsvValue(sub.category ? categoryLabels[sub.category] || sub.category : ''),
    escapeCsvValue(sub.tags?.join(', ') || ''),
    escapeCsvValue(sub.notes || ''),
    escapeCsvValue(sub.providerUrl || ''),
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  // Create blob with UTF-8 BOM
  const blob = new Blob([UTF8_BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suscriptio-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
