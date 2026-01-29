import type { Subscription } from '../types/subscription';

export interface BackupData {
  version: number;
  exportedAt: string;
  subscriptions: Subscription[];
}

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
