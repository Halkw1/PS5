import React, { useEffect, useState } from 'react';

export function PixPayment({ amount, description, email, externalReference }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function createPixPayment() {
      try {
        const res = await fetch('/create_payment_pix', {
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
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    createPixPayment();
  }, [amount, description, email, externalReference]);

  if (loading) return <p>Gerando QR code PIX...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div>
      <p>Aguardando pagamento via PIX. Escaneie o QR code abaixo:</p>
      <img src={`data:image/png;base64,${qrCode}`} alt="QR Code PIX" />
    </div>
  );
}
