import React, { useEffect, useState } from 'react';

interface PixPaymentProps {
  amount: number;
  description: string;
  email: string;
  externalReference: string;
  onPaymentApproved?: () => void;
}

export function PixPayment({
  amount,
  description,
  email,
  externalReference,
  onPaymentApproved,
}: PixPaymentProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    async function createPixPayment() {
      try {
        const res = await fetch('https://ps5-89py.onrender.com/create_payment_pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, description, email, external_reference: externalReference }),
        });

        if (!res.ok) {
          throw new Error('Erro ao gerar pagamento PIX');
        }

        const data = await res.json();
        setQrCode(data.qr_code_base64);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    createPixPayment();
  }, [amount, description, email, externalReference]);

  useEffect(() => {
    if (status === 'paid' || !externalReference) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://ps5-89py.onrender.com/orders/status/${externalReference}`);
        const data = await res.json();
        setStatus(data.status);

        if (data.status === 'paid') {
          clearInterval(interval);
          if (onPaymentApproved) onPaymentApproved();
        }
      } catch {
        // Ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [externalReference, status, onPaymentApproved]);

  if (loading) return <p>Gerando QR code PIX...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (status === 'paid') return <p>Pagamento confirmado! Obrigado pela compra.</p>;

  return (
    <div>
      <p>Aguardando pagamento via PIX. Escaneie o QR code abaixo:</p>
      <img src={`data:image/png;base64,${qrCode}`} alt="QR Code PIX" />
    </div>
  );
}
