import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Building2, Home, Plus, Briefcase, Trash2, Check } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Address } from '@/types';

export function SavedAddressesView() {
  const { user, setView, setUser, showToast } = useStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    address: '',
    city: '',
    zip: '',
    type: 'home',
  });

  if (!user) return null;

  const addresses = user.addresses || [];

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Default address updated', 'success');
  };

  const handleDelete = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Address removed', 'info');
  };

  const handleAddAddress = () => {
    const newAddr: Address = {
      id: Date.now().toString(),
      name: newAddress.name || 'New Address',
      address: newAddress.address || '',
      city: newAddress.city || 'Pokhara',
      zip: newAddress.zip || '',
      type: newAddress.type as 'home' | 'work' | 'other',
      isDefault: addresses.length === 0
    };

    setUser({ ...user, addresses: [...addresses, newAddr] });
    setIsAddingNew(false);
    setNewAddress({ name: '', address: '', city: '', zip: '', type: 'home' });
    showToast('New address saved', 'success');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Briefcase className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10 mb-6 pl-0"
          onClick={() => setView('profile')}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Button>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Saved Addresses</h1>
            
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Label (e.g., Home, Office)</Label>
                    <Input 
                      value={newAddress.name}
                      onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input 
                      value={newAddress.address}
                      onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input 
                        value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input 
                        value={newAddress.zip}
                        onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex gap-2">
                      {['home', 'work', 'other'].map(type => (
                        <Button
                          key={type}
                          type="button"
                          variant={newAddress.type === type ? 'default' : 'outline'}
                          onClick={() => setNewAddress({...newAddress, type: type as any})}
                          className={`flex-1 capitalize ${
                            newAddress.type === type 
                              ? 'bg-amber-500 hover:bg-amber-600' 
                              : 'border-white/10 hover:bg-white/5 text-white'
                          }`}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddAddress} className="w-full bg-amber-500 hover:bg-amber-600 mt-2">
                    Save Address
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No addresses saved yet.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border transition-all ${
                    address.isDefault 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${
                      address.isDefault ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/60'
                    }`}>
                      {getIcon(address.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{address.name}</h3>
                        {address.isDefault && (
                          <Badge className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 h-5">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/70 text-sm">{address.address}</p>
                      <p className="text-white/50 text-sm">{address.city}, {address.zip}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-white/40 hover:text-white"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 self-end"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
