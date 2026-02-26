import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, Trash2, Check, Wallet } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PaymentMethod } from '@/types';

export function PaymentMethodsView() {
  const { user, setView, setUser, showToast } = useStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvc: '' });

  if (!user) return null;

  const paymentMethods = user.paymentMethods || [];

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setUser({ ...user, paymentMethods: updatedMethods });
    showToast('Default payment method updated', 'success');
  };

  const handleDelete = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setUser({ ...user, paymentMethods: updatedMethods });
    showToast('Payment method removed', 'info');
  };

  const handleAddCard = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: `Visa **** ${newCard.number.slice(-4)}`,
      last4: newCard.number.slice(-4),
      brand: 'Visa',
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0
    };

    setUser({ ...user, paymentMethods: [...paymentMethods, newMethod] });
    setIsAddingNew(false);
    setNewCard({ number: '', name: '', expiry: '', cvc: '' });
    showToast('New card added successfully', 'success');
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
            <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input 
                      placeholder="0000 0000 0000 0000" 
                      value={newCard.number}
                      onChange={e => setNewCard({...newCard, number: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input 
                        placeholder="MM/YY" 
                        value={newCard.expiry}
                        onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input 
                        placeholder="123" 
                        value={newCard.cvc}
                        onChange={e => setNewCard({...newCard, cvc: e.target.value})}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input 
                      placeholder="John Doe" 
                      value={newCard.name}
                      onChange={e => setNewCard({...newCard, name: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button onClick={handleAddCard} className="w-full bg-amber-500 hover:bg-amber-600 mt-4">
                    Add Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No payment methods saved yet.</p>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border transition-all ${
                    method.isDefault 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded-md flex items-center justify-center ${
                        method.type === 'wallet' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {method.type === 'wallet' ? <Wallet size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {method.name}
                          {method.isDefault && (
                            <Badge className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 h-5">
                              Default
                            </Badge>
                          )}
                        </h3>
                        {method.expiry && (
                          <p className="text-white/40 text-sm">Expires {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                          className="text-white/40 hover:text-white"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(method.id)}
                        className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
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
