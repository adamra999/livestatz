import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import type { EventFormData } from "../types";
import { ATTENDEE_BENEFITS } from "../types";

interface PaymentSectionProps {
  formData: EventFormData;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
}

export const PaymentSection = ({
  formData,
  onFieldChange,
}: PaymentSectionProps) => {
  const handleBenefitToggle = (benefit: string, checked: boolean) => {
    if (checked) {
      onFieldChange("attendeeBenefits", [
        ...formData.attendeeBenefits,
        benefit,
      ]);
    } else {
      onFieldChange(
        "attendeeBenefits",
        formData.attendeeBenefits.filter((b) => b !== benefit)
      );
    }
  };

  return (
    <section className="border-t pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="event-type">Event Type</Label>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm ${
              !formData.isPaid ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            Free
          </span>
          <Switch
            id="event-type"
            checked={formData.isPaid}
            onCheckedChange={(checked) => {
              onFieldChange("isPaid", checked);
              if (!checked) {
                onFieldChange("price", "");
                onFieldChange("attendeeBenefits", []);
              }
            }}
          />
          <span
            className={`text-sm ${
              formData.isPaid ? "text-yellow-600" : "text-muted-foreground"
            }`}
          >
            Paid
          </span>
        </div>
      </div>

      {formData.isPaid && (
        <div className="space-y-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
          <div>
            <Label htmlFor="price">
              💵 Ticket Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="29.99"
              value={formData.price}
              onChange={(e) => onFieldChange("price", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 block">🎯 Attendee Benefits</Label>
            <div className="grid grid-cols-2 gap-2">
              {ATTENDEE_BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Checkbox
                    id={`benefit-${benefit}`}
                    checked={formData.attendeeBenefits.includes(benefit)}
                    onCheckedChange={(checked) =>
                      handleBenefitToggle(benefit, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`benefit-${benefit}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {benefit}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

