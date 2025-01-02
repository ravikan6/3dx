import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Address = {
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
};

interface SavedAddressesDialogProps {
  showAddressDialog: boolean;
  setShowAddressDialog: React.Dispatch<React.SetStateAction<boolean>>;
  savedAddresses: Address[];
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
}

const SavedAddressesDialog: React.FC<SavedAddressesDialogProps> = ({
  showAddressDialog,
  setShowAddressDialog,
  savedAddresses,
  setAddress,
}) => {
  return (
    <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
      <DialogContent>
        <DialogTitle>Saved Addresses</DialogTitle>
        <DialogDescription>
          Select an address or enter a new one.
        </DialogDescription>
        {savedAddresses.map((savedAddress, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">Address {index + 1}</h3>
            <p>
              {savedAddress.streetAddress}, {savedAddress.city}
            </p>
            <p>
              {savedAddress.state}, {savedAddress.pincode}
            </p>
            <p>Phone: {savedAddress.phoneNumber}</p>
            <Button
              onClick={() => {
                setAddress(savedAddress);
                setShowAddressDialog(false);
              }}
            >
              Use This Address
            </Button>
          </div>
        ))}
        <Button onClick={() => setShowAddressDialog(false)}>
          Enter New Address
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SavedAddressesDialog;

