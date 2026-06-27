"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateCompanyContact } from "@/lib/admin/actions";

interface CompanyInfoFormProps {
  userId: string;
  companyName: string;
  email: string;
  address: string;
  initialPhone: string;
  initialVat: string;
}

export function CompanyInfoForm({
  userId,
  companyName,
  email,
  address,
  initialPhone,
  initialVat,
}: CompanyInfoFormProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [vat, setVat] = useState(initialVat);
  const [isPending, startTransition] = useTransition();

  const dirty = phone !== initialPhone || vat !== initialVat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateCompanyContact(phone, vat, userId);
      if (result.success) {
        toast.success("Company information updated");
      } else {
        toast.error(result.error || "Failed to update company information");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Read-only fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Company Name</label>
          <p className="text-foreground">{companyName}</p>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Email</label>
          <p className="text-foreground">{email}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-muted-foreground mb-1">Address</label>
          <p className="text-foreground">{address}</p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Editable fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company-phone" className="text-muted-foreground">
            Phone
          </Label>
          <Input
            id="company-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+39 ..."
            className="mt-2 bg-muted border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="company-vat" className="text-muted-foreground">
            VAT / P.IVA
          </Label>
          <Input
            id="company-vat"
            value={vat}
            onChange={(e) => setVat(e.target.value)}
            placeholder="e.g. IT01234567890"
            className="mt-2 bg-muted border-border text-foreground"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Phone and P.IVA are shown across the public site (footer, contact page and legal notice).
        Leave P.IVA blank to hide it until it&apos;s available.
      </p>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !dirty}
          className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
