import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PatentApplicationDocument } from './PatentApplicationDocument';
import { PatentClaims } from './PatentClaims';
import { Download, FileText, CheckCircle } from 'lucide-react';

interface PatentExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatentExportModal: React.FC<PatentExportModalProps> = ({ isOpen, onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExporting(true);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>USPTO Patent Application - Rotating Virtual Card System</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px; }
              @media print {
                body { margin: 0; padding: 20px; }
                .page-break { page-break-before: always; }
              }
            </style>
          </head>
          <body>
            ${document.getElementById('patent-full-document')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        setExporting(false);
        setExported(true);
      }, 500);
    }
  };

  const handleDownloadText = () => {
    const content = document.getElementById('patent-full-document')?.innerText || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'USPTO-Patent-Application-Rotating-Virtual-Card.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">USPTO Patent Application Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <div className="flex gap-4">
              <Button onClick={handleExport} disabled={exporting} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {exporting ? 'Preparing...' : 'Export as PDF'}
              </Button>
              <Button onClick={handleDownloadText} variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Download as Text
              </Button>
            </div>
            {exported && (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Patent application prepared for printing/PDF export</span>
              </div>
            )}
          </div>

          {/* Document Preview */}
          <div id="patent-full-document" className="border rounded-lg overflow-hidden">
            <PatentApplicationDocument />
            <div className="page-break"></div>
            <PatentClaims />
            
            {/* Additional Sections */}
            <div className="max-w-4xl mx-auto bg-white text-black p-12 font-serif">
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">DETAILED DESCRIPTION</h2>
                <p className="leading-relaxed mb-4">
                  The present invention will now be described in detail with reference to the accompanying drawings and technical specifications.
                </p>
                <h3 className="font-bold mb-2">System Architecture:</h3>
                <p className="leading-relaxed mb-3">
                  The system comprises a client application, credential generation server, validation server, and payment gateway interface. The client application displays current credentials and time remaining. The generation server creates new credentials using cryptographic algorithms. The validation server authenticates transactions in real-time.
                </p>
                <h3 className="font-bold mb-2">Rotation Mechanism:</h3>
                <p className="leading-relaxed mb-3">
                  Upon initialization, the system generates first credentials with timestamp T0. At T0 + 30-60 seconds, the rotation engine triggers generation of new credentials. Old credentials are invalidated atomically. This process repeats continuously.
                </p>
                <h3 className="font-bold mb-2">Security Features:</h3>
                <p className="leading-relaxed">
                  Credentials are generated using AES-256 encryption. Merchant locking prevents cross-merchant fraud. Real-time validation ensures only current credentials are accepted. Expired credentials are permanently blacklisted.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">INDUSTRIAL APPLICABILITY</h2>
                <p className="leading-relaxed">
                  This invention is applicable to e-commerce, retail payment processing, subscription services, and any transaction requiring payment card credentials. It reduces fraud costs, protects consumer data, and enhances payment security across all industries.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">CONCLUSION</h2>
                <p className="leading-relaxed">
                  The foregoing description illustrates the principles of the invention. Various modifications and alterations may be made without departing from the spirit and scope of the invention as defined by the following claims.
                </p>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
