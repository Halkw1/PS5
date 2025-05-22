// src/lib/pixApi.ts

export async function createPixPayment(amount: number, description: string, email: string, externalReference: string) {
  const response = await fetch('https://ps5-89py.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description, email, external_reference: externalReference }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao criar pagamento PIX');
  }

  return await response.json();
}
