import { useState, useEffect } from 'react';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface Withdrawal {
  id: string;
  memberName: string;
  groupName: string;
  reason: string;
  date: string;
  notes: string;
}

export function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    setLoading(true);
    const result = await api.getWithdrawals();
    if (result.data) {
      setWithdrawals(result.data.withdrawals);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-[#333333]">Bajas</h1>
          <button
            className="bg-[#4CAF50] text-white p-2.5 rounded-full shadow-md hover:bg-[#43A047] transition-colors"
            aria-label="Registrar baja"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#9E9E9E] text-[15px]">
                No hay bajas registradas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F0F0]">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="p-5 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#333333]">
                        {withdrawal.memberName}
                      </h3>
                      <p className="text-[13px] text-[#757575]">
                        {withdrawal.groupName}
                      </p>
                    </div>
                    <span className="text-[12px] text-[#9E9E9E]">
                      {formatDate(withdrawal.date)}
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#FFEBEE] text-[#E57373] text-[11px] font-medium px-2.5 py-1 rounded-full">
                      {withdrawal.reason}
                    </span>
                  </div>

                  {/* Notes */}
                  {withdrawal.notes && (
                    <p className="text-[14px] text-[#757575] italic">
                      "{withdrawal.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Count */}
        {!loading && withdrawals.length > 0 && (
          <p className="text-center text-[13px] text-[#9E9E9E] mt-4">
            {withdrawals.length} baja{withdrawals.length !== 1 ? 's' : ''} registrada{withdrawals.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
