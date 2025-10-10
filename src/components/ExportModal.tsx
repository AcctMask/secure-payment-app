import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, FileText, Database } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { exportToJSON, exportToCSV, downloadFile } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { accounts, mainCode, memberData } = useAppContext();

  const handleExportJSON = () => {
    const jsonContent = exportToJSON(accounts, mainCode, memberData);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(jsonContent, `secure-purchase-backup-${timestamp}.json`, 'application/json');
    onClose();
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(accounts);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csvContent, `secure-purchase-accounts-${timestamp}.csv`, 'text/csv');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Account Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Export your secure purchase accounts and codes for backup purposes.
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleExportJSON}
              className="w-full justify-start gap-3"
              variant="outline"
            >
              <Database className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Complete Backup (JSON)</div>
                <div className="text-xs text-gray-500">All accounts, codes, and member data</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleExportCSV}
              className="w-full justify-start gap-3"
              variant="outline"
            >
              <FileText className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Accounts Only (CSV)</div>
                <div className="text-xs text-gray-500">Account data in spreadsheet format</div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};