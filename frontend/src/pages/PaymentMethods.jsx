import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPlusCircle,
  FiMoreVertical,
  FiTrash2,
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiShield,
  FiCreditCard,
  FiCheckCircle,
  FiDollarSign,
  FiLayers,
  FiClock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialCards = [
  { id: 'card_1', brand: 'VISA', last4: '4242', expiry: '12/26', bank: 'HDFC Bank' },
  { id: 'card_2', brand: 'MASTERCARD', last4: '5555', expiry: '08/25', bank: 'ICICI Bank' },
];

const initialUpi = [];

const initialWallets = [
  { id: 'wallet_1', name: 'Paytm Wallet', status: 'Balance: ₹450.00', action: 'RECHARGE', linked: true },
  { id: 'wallet_2', name: 'PhonePe', status: 'Not Linked', action: 'LINK', linked: false },
];

const extraPaymentOptions = [
  { id: 'opt_cod', title: 'Cash on Delivery', subtitle: 'Pay when order arrives', icon: FiDollarSign },
  { id: 'opt_netbanking', title: 'Net Banking', subtitle: 'Pay directly from bank account', icon: FiLayers },
  { id: 'opt_paylater', title: 'Pay Later', subtitle: 'Buy now, pay in easy installments', icon: FiClock },
];

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(initialCards);
  const [upiIds, setUpiIds] = useState(initialUpi);
  const [wallets, setWallets] = useState(initialWallets);
  const [selectedMethodId, setSelectedMethodId] = useState('card_1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [methodType, setMethodType] = useState('card');
  const [inputValue, setInputValue] = useState('');
  const [selectedExtraOption, setSelectedExtraOption] = useState('opt_cod');

  const allMethods = useMemo(() => {
    const cardMethods = cards.map((c) => ({ id: c.id, type: 'card', label: `•••• ${c.last4}` }));
    const upiMethods = upiIds.map((u) => ({ id: u.id, type: 'upi', label: u.handle }));
    return [...cardMethods, ...upiMethods];
  }, [cards, upiIds]);

  const addMethod = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error('Please enter details');
      return;
    }

    if (methodType === 'card') {
      const last4 = inputValue.replace(/\s+/g, '').slice(-4);
      if (last4.length < 4) {
        toast.error('Enter valid card number');
        return;
      }
      const newCard = {
        id: `card_${Date.now()}`,
        brand: 'CARD',
        last4,
        expiry: 'MM/YY',
        bank: 'New Bank',
      };
      setCards((prev) => [newCard, ...prev]);
      setSelectedMethodId(newCard.id);
      toast.success('Card added');
    } else if (methodType === 'upi') {
      if (!inputValue.includes('@')) {
        toast.error('Enter valid UPI ID');
        return;
      }
      const newUpi = {
        id: `upi_${Date.now()}`,
        handle: inputValue.trim(),
        label: 'New UPI ID',
        active: true,
      };
      setUpiIds((prev) => [newUpi, ...prev.map((u) => ({ ...u, active: false }))]);
      setSelectedMethodId(newUpi.id);
      toast.success('UPI ID added');
    } else {
      const walletName = inputValue.trim();
      const newWallet = {
        id: `wallet_${Date.now()}`,
        name: walletName,
        status: 'Linked',
        action: 'MANAGE',
        linked: true,
      };
      setWallets((prev) => [newWallet, ...prev]);
      toast.success('Wallet added');
    }

    setInputValue('');
    setShowAddModal(false);
  };

  const removeUpi = (id) => {
    setUpiIds((prev) => prev.filter((u) => u.id !== id));
    if (selectedMethodId === id) setSelectedMethodId(allMethods[0]?.id || '');
    toast.success('UPI ID removed');
  };

  const removeWallet = (id) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
    toast.success('Wallet removed');
  };

  const getBrandLabel = (brand) => {
    const b = String(brand || '').toUpperCase();
    if (b === 'MASTERCARD') return 'MC';
    if (b === 'VISA') return 'VISA';
    return b.slice(0, 6);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <div className="max-w-md mx-auto px-5 pt-5 pb-52">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[22px] font-semibold text-slate-900">Payment Methods</h1>
          <div className="w-9 h-9" />
        </div>

        <section className="mt-6">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">Saved Cards</h3>
          <div className="space-y-2">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedMethodId(card.id)}
                className="w-full rounded-xl bg-white border border-slate-200 px-3 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-8 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center justify-center">
                    <span className="px-1 truncate">{getBrandLabel(card.brand)}</span>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[20px] font-semibold text-slate-900 leading-5">•••• {card.last4}</p>
                    <p className="text-[13px] text-slate-500">Expires {card.expiry} • {card.bank}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMethodId === card.id && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                  <FiMoreVertical className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {upiIds.length > 0 && (
          <section className="mt-5">
            <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">UPI IDs</h3>
            <div className="space-y-2">
              {upiIds.map((upi) => (
                <button
                  key={upi.id}
                  onClick={() => setSelectedMethodId(upi.id)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#f3ece8] text-orange-500 flex items-center justify-center shrink-0">
                      <FiCreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[16px] font-semibold text-slate-900">{upi.handle}</p>
                      <p className="text-[13px] text-slate-500">{upi.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedMethodId === upi.id && <span className="w-2 h-2 rounded-full bg-green-500" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUpi(upi.id);
                      }}
                      className="text-slate-400"
                      aria-label="Delete UPI"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">Digital Wallets</h3>
          <div className="space-y-2">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="rounded-xl bg-white border border-slate-200 px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-cyan-100 flex items-center justify-center text-cyan-700 text-[11px] font-bold">
                    {wallet.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-slate-900">{wallet.name}</p>
                    <p className="text-[13px] text-slate-500">{wallet.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-[11px] font-semibold">
                    {wallet.action}
                  </button>
                  <button
                    onClick={() => removeWallet(wallet.id)}
                    className="text-slate-400"
                    aria-label="Delete wallet"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">More Payment Options</h3>
          <div className="space-y-2">
            {extraPaymentOptions.map((option) => {
              const Icon = option.icon;
              const active = selectedExtraOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedExtraOption(option.id)}
                  className={`w-full rounded-xl border px-3 py-3 flex items-center justify-between transition-colors ${
                    active ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-slate-900">{option.title}</p>
                      <p className="text-[12px] text-slate-500">{option.subtitle}</p>
                    </div>
                  </div>
                  {active && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 rounded-3xl border border-slate-200 border-dashed bg-[#eef2f6] px-4 py-4 flex items-start gap-3">
          <FiShield className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[13px] text-slate-500 leading-5">
            Your payment details are secure. FlashBites uses industry-standard encryption to protect your data.
          </p>
        </div>
      </div>

      <div
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4"
        style={{ bottom: 'calc(64px + max(6px, env(safe-area-inset-bottom)))' }}
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full h-11 rounded-full bg-orange-500 text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-sm"
        >
          <FiPlusCircle className="w-5 h-5" />
          Add New Payment Method
        </button>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-4 px-2 py-2">
          <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiHome className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Home</span>
          </button>
          <button onClick={() => navigate('/orders')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiShoppingBag className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Orders</span>
          </button>
          <button onClick={() => navigate('/restaurants')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiSearch className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Search</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiUser className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] leading-none font-medium text-orange-500">Profile</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-black/30 flex items-end justify-center p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Add Payment Method</h2>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setMethodType('card')}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold ${methodType === 'card' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Card
              </button>
              <button
                onClick={() => setMethodType('upi')}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold ${methodType === 'upi' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                UPI ID
              </button>
              <button
                onClick={() => setMethodType('wallet')}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold ${methodType === 'wallet' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Wallet
              </button>
            </div>
            <form onSubmit={addMethod} className="space-y-3">
              <input
                placeholder={
                  methodType === 'card'
                    ? 'Enter card number'
                    : methodType === 'upi'
                      ? 'Enter UPI ID'
                      : 'Enter wallet name'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-orange-500 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
