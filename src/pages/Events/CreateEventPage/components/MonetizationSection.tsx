import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFormData } from "../types";
import { forwardRef, useImperativeHandle } from "react";

interface MonetizationSectionProps {
  formData: EventFormData;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
}

export interface StepValidationRef {
  validate: () => boolean;
}

export const MonetizationSection = forwardRef<StepValidationRef, MonetizationSectionProps>(
  ({ formData, onFieldChange }, ref) => {
    useImperativeHandle(ref, () => ({
      validate: () => {
        // Validate price if event is paid
        if (formData.isPaid && (!formData.price || parseFloat(formData.price) <= 0)) {
          return false;
        }
        // Validate payment handle if accepting tips
        if (formData.acceptTips && !formData.paymentHandle.trim()) {
          return false;
        }
        return true;
      },
    }));

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Monetization (Optional)</h3>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => {
                    onFieldChange("isPaid", checked as boolean);
                    if (!checked) {
                      onFieldChange("price", "");
                    }
                  }}
                />
                <Label htmlFor="isPaid" className="font-medium cursor-pointer">
                  Enable Paid RSVPs
                </Label>
              </div>

              {formData.isPaid && (
                <div className="ml-6">
                  <Label htmlFor="price" className="text-sm">
                    Ticket Price *
                  </Label>
                  <div className="flex items-center mt-2">
                    <span className="text-muted-foreground mr-2">$</span>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => onFieldChange("price", e.target.value)}
                      className="w-32"
                      placeholder="10.00"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="acceptTips"
                  checked={formData.acceptTips}
                  onCheckedChange={(checked) => {
                    onFieldChange("acceptTips", checked as boolean);
                    if (!checked) {
                      onFieldChange("paymentMethod", "");
                      onFieldChange("paymentHandle", "");
                    }
                  }}
                />
                <Label htmlFor="acceptTips" className="font-medium cursor-pointer">
                  Accept Tips/Donations
                </Label>
              </div>

              {formData.acceptTips && (
                <div className="ml-6 space-y-3">
                  <div>
                    <Label htmlFor="paymentMethod" className="text-sm">
                      Payment Method
                    </Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => onFieldChange("paymentMethod", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashapp">Cash App</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="zelle">Zelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentHandle" className="text-sm">
                      Payment Handle *
                    </Label>
                    <Input
                      id="paymentHandle"
                      value={formData.paymentHandle}
                      onChange={(e) => onFieldChange("paymentHandle", e.target.value)}
                      placeholder="@username or email"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MonetizationSection.displayName = "MonetizationSection";
