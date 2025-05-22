import React, { useState } from "react";

interface PixPaymentProps {
  amount: number;
  description: string;
  email: string;
  externalReference: string;
}

export function PixPayment({ amount, description, email, externalReference }: PixPaymentProps) {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPixPayment = async () => {
    setLoading(true);
    setError(null);
    setQrCodeBase64(null);

    try {
      const response = await fetch("https://seu-backend.onrender.com/create_payment_pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, email, external_reference: externalReference }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar pagamento PIX");
      }

      const data = await response.json();
      setQrCodeBase64(data.qr_code_base64);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={createPixPayment} disabled={loading}>
        {loading ? "Gerando PIX..." : "Gerar pagamento PIX"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {qrCodeBase64 && (
        <div>
          <p>Escaneie o QR Code abaixo para pagar via PIX:</p>
          <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" />
        </div>
      )}
    </div>
  );
}
