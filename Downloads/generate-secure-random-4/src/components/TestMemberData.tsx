import React from 'react';
import { Button } from './ui/button';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from '../hooks/use-toast';

export const TestMemberData: React.FC = () => {
  const { setMemberData } = useAppContext();
  const { toast } = useToast();

  const setTestMemberData = () => {
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      memberAccountNumber: 'MEM' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      membershipActive: true
    };
    
    setMemberData(testData);
    localStorage.setItem('memberData', JSON.stringify(testData));
    
    toast({
      title: "Test Member Data Set",
      description: "Refresh the page to see the member UI",
    });
  };

  const clearMemberData = () => {
    setMemberData(null);
    localStorage.removeItem('memberData');
    
    toast({
      title: "Member Data Cleared",
      description: "The member data has been removed",
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex gap-2">
        <Button
          onClick={setTestMemberData}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          Set Test Member
        </Button>
        <Button
          onClick={clearMemberData}
          variant="destructive"
          size="sm"
        >
          Clear Member
        </Button>
      </div>
    </div>
  );
};