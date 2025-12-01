"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProductAvailabilityToggleProps {
  productId: number;
  productName: string;
  isAvailable: boolean;
  onToggle: () => void;
}

export function ProductAvailabilityToggle({
  productId,
  productName,
  isAvailable,
  onToggle,
}: ProductAvailabilityToggleProps) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(isAvailable);

  const handleToggle = async (newValue: boolean) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAvailable: newValue,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar disponibilidade");
      }

      setChecked(newValue);
      onToggle();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar disponibilidade. Tente novamente.");
      setChecked(!newValue); // Reverte em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`availability-${productId}`}
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <Label htmlFor={`availability-${productId}`} className="text-sm">
        {checked ? "Disponível" : "Indisponível"}
      </Label>
    </div>
  );
}