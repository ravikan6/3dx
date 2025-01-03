import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Address = {
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
};

interface AddressFormProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress, saveAddress, setSaveAddress }) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            value={address.streetAddress}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            name="pincode"
            value={address.pincode}
            onChange={handleAddressChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={address.phoneNumber}
            onChange={handleAddressChange}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="saveAddress"
          checked={saveAddress}
          onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
        />
        <label
          htmlFor="saveAddress"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Save address for future use
        </label>
      </div>
    </div>
  );
};

export default AddressForm;

