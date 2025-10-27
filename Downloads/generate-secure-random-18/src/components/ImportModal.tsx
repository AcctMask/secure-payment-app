import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { parseBackupFile, BackupData } from '../utils/exportUtils';
import { Alert, AlertDescription } from './ui/alert';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { setMemberData } = useAppContext();
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFile = async (file: File) => {
    try {
      const content = await file.text();
      const backupData: BackupData = parseBackupFile(content);
      localStorage.setItem('pendingRestore', JSON.stringify(backupData));
      setStatus('success');
      setMessage(`Backup file loaded successfully. Found ${backupData.accounts.length} accounts.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to parse backup file');
    }
  };

  const handleRestore = () => {
    const pendingRestore = localStorage.getItem('pendingRestore');
    if (pendingRestore) {
      const backupData: BackupData = JSON.parse(pendingRestore);
      localStorage.setItem('securePurchaseAccounts', JSON.stringify(backupData.accounts));
      localStorage.setItem('securePurchaseMainCode', backupData.mainCode);
      if (backupData.memberData) {
        setMemberData(backupData.memberData);
        localStorage.setItem('securePurchaseMemberData', JSON.stringify(backupData.memberData));
      }
      localStorage.removeItem('pendingRestore');
      setStatus('success');
      setMessage('Data restored successfully! Refreshing page...');
      setTimeout(() => { onClose(); window.location.reload(); }, 2000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />Import Backup Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {status === 'idle' && (
            <>
              <div className="text-sm text-gray-600">
                Import a previously exported backup file to restore your accounts and codes.
              </div>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
                onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)}>
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop your backup file here, or</p>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild><span>Browse Files</span></Button>
                  <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
                </label>
              </div>
            </>
          )}
          {status === 'success' && <Alert><CheckCircle className="h-4 w-4" /><AlertDescription>{message}</AlertDescription></Alert>}
          {status === 'error' && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{message}</AlertDescription></Alert>}
          {status === 'success' && localStorage.getItem('pendingRestore') && <Button onClick={handleRestore} className="w-full">Restore Data</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};