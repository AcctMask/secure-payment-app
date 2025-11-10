import { Account, MemberData } from '../contexts/AppContext';

export interface BackupData {
  accounts: Account[];
  mainCode: string;
  memberData: MemberData | null;
  exportDate: string;
  version: string;
}

export const exportToJSON = (accounts: Account[], mainCode: string, memberData: MemberData | null): string => {
  const backupData: BackupData = {
    accounts,
    mainCode,
    memberData,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(backupData, null, 2);
};

export const exportToCSV = (accounts: Account[]): string => {
  const headers = ['ID', 'Name', 'Code', 'Last Four', 'Card Type', 'Created At', 'Stripe Payment Method ID'];
  const csvRows = [headers.join(',')];
  
  accounts.forEach(account => {
    const row = [
      account.id,
      `"${account.name}"`,
      `"${account.code}"`,
      account.lastFour,
      account.cardType || '',
      account.createdAt.toISOString(),
      account.stripePaymentMethodId || ''
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseBackupFile = (fileContent: string): BackupData => {
  try {
    const data = JSON.parse(fileContent);
    
    // Validate backup data structure
    if (!data.accounts || !Array.isArray(data.accounts)) {
      throw new Error('Invalid backup format: missing accounts array');
    }
    
    // Convert date strings back to Date objects
    data.accounts = data.accounts.map((account: any) => ({
      ...account,
      createdAt: new Date(account.createdAt)
    }));
    
    return data;
  } catch (error) {
    throw new Error('Invalid backup file format');
  }
};