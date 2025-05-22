import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { PixPayment } from '@/components/PixPayment';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "credit-card",
  });

  // Gera o externalReference fixo só uma vez para usar no PIX
  const [externalReference] = useState(() => `pedido_${Date.now()}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      if (formData.paymentMethod === 'pix') {
        alert('Por favor, escaneie o QR code PIX e aguarde confirmação do pagamento.');
        // Não finalize nem limpe o carrinho aqui, pois isso será feito após confirmação no PixPayment
      } else {
        const order = await createOrder(items, totalPrice);
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some games to your cart before checking out.
            </p>
            <Button onClick={() => navigate("/games")}>Browse Games</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields (ex: nome, email, endereço) */}
                {/* ... */}
                {/* Payment Method */}
                <div className="p-6 bg-card rounded-lg space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handleRadioChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <label htmlFor="credit-card" className="flex-1 cursor-pointer">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <label htmlFor="paypal" className="flex-1 cursor-pointer">
                        PayPal
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="pix" id="pix" />
                      <label htmlFor="pix" className="flex-1 cursor-pointer">
                        PIX
                      </label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "pix" && (
                    <div className="mt-4">
                      <PixPayment
                        amount={totalPrice}
                        description="Compra no Playverse"
                        email={formData.email}
                        externalReference={externalReference}
                        onPaymentApproved={() => {
                          clearCart();
                          navigate(`/order-confirmation/${externalReference}`);
                        }}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ps-blue hover:bg-ps-lightblue"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            {/* ... */}
          </div>
        )}
      </div>
    </Layout>
  );
}
