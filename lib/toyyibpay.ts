export interface ToyyibPayBill {
  billName: string;
  billDescription: string;
  billPriceSetting: number;
  billPayorInfo: number;
  billAmount: number;
  billReturnUrl: string;
  billCallbackUrl: string;
  billExternalReferenceNo: string;
  billTo: string;
  billEmail: string;
  billPhone: string;
  billSplitPayment: number;
  billSplitPaymentArgs: string;
  billPaymentChannel: string;
  billContentEmail: string;
  billChargeToCustomer: number;
  billExpiryDate?: string;
  billExpiryDays?: number;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    size?: string;
  }[];
}

export interface ToyyibPayResponse {
  success: boolean;
  message: string;
  data?: {
    BillCode: string;
    BillpaymentUrl: string;
  };
  error?: string;
}

/**
 * ToyyibPay Service for handling payment operations
 */
export class ToyyibPayService {
  private static readonly BASE_URL = "https://dev.toyyibpay.com";
  private static readonly SECRET_KEY = process.env.TOYYIBPAY_SECRET_KEY;
  private static readonly CATEGORY_CODE = process.env.TOYYIBPAY_CATEGORY_CODE;

  /**
   * Generate bill description from items
   */
  private static generateBillDescription(items: PaymentData["items"]): string {
    if (items.length === 1) {
      return `${items[0].name} (Qty: ${items[0].quantity})`;
    }
    return `${items.length} items: ${items
      .map((item) => item.name)
      .slice(0, 2)
      .join(", ")}${items.length > 2 ? "..." : ""}`;
  }

  /**
   * Create a new bill for payment
   */
  static async createBill(paymentData: PaymentData): Promise<ToyyibPayResponse> {
    try {
      if (!this.SECRET_KEY || !this.CATEGORY_CODE) {
        throw new Error("ToyyibPay configuration is missing. Please check your environment variables.");
      }

      // Create bill data matching the PHP example structure
      const billData = {
        userSecretKey: this.SECRET_KEY,
        categoryCode: this.CATEGORY_CODE,
        billName: `Order #${paymentData.orderId}`,
        billDescription: this.generateBillDescription(paymentData.items),
        billPriceSetting: 0, // Dynamic price (matching PHP example)
        billPayorInfo: 1, // Required
        billAmount: Math.round(paymentData.amount * 100), // Convert to sen (cents)
        billReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        billCallbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
        billExternalReferenceNo: paymentData.orderId,
        billTo: paymentData.customerName,
        billEmail: paymentData.customerEmail,
        billPhone: paymentData.customerPhone,
        billSplitPayment: 0,
        billSplitPaymentArgs: "",
        billPaymentChannel: "0", // All channels
        billContentEmail: `Thank you for purchasing our product! Order #${paymentData.orderId}`,
        billChargeToCustomer: 1,
        billExpiryDays: 3,
      };

      const formData = new FormData();

      // Add all bill data to form (matching PHP structure)
      Object.entries(billData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.BASE_URL}/index.php/api/createBill`, {
        method: "POST",
        body: formData,
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("ToyyibPay API error response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log("ToyyibPay raw response:", responseText);

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse ToyyibPay response as JSON:", responseText);
        console.error("Parse error details:", parseError);
        return {
          success: false,
          message: "Invalid response from payment gateway",
          error: `Parse error: ${responseText.substring(0, 200)}...`,
        };
      }

      if (result[0]?.BillCode) {
        return {
          success: true,
          message: "Bill created successfully",
          data: {
            BillCode: result[0].BillCode,
            BillpaymentUrl: `${this.BASE_URL}/${result[0].BillCode}`,
          },
        };
      } else {
        return {
          success: false,
          message: result[0]?.msg || "Failed to create bill",
          error: JSON.stringify(result),
        };
      }
    } catch (error) {
      console.error("ToyyibPay createBill error:", error);
      return {
        success: false,
        message: "An error occurred while creating the bill",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get bill transactions/status
   */
  static async getBillTransactions(billCode: string): Promise<unknown> {
    try {
      if (!this.SECRET_KEY) {
        throw new Error("ToyyibPay secret key is missing");
      }

      const formData = new FormData();
      formData.append("userSecretKey", this.SECRET_KEY);
      formData.append("billCode", billCode);

      const response = await fetch(`${this.BASE_URL}/index.php/api/getBillTransactions`, {
        method: "POST",
        body: formData,
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("ToyyibPay getBillTransactions API error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();

      // Try to parse as JSON
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse getBillTransactions response as JSON:", responseText);
        console.error("Parse error details:", parseError);
        throw new Error(`Parse error: ${responseText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.error("ToyyibPay getBillTransactions error:", error);
      throw error;
    }
  }

  /**
   * Verify payment callback signature
   */
  static verifyCallback(data: Record<string, unknown>, signature: string): boolean {
    // Log the callback data for debugging
    console.log("Verifying callback:", { data, signature });

    // For now, we'll do basic validation
    // In production, you should implement proper signature verification
    // based on ToyyibPay's documentation

    // Check if required fields are present
    const requiredFields = ["refno", "status", "billcode", "order_id"];
    const hasRequiredFields = requiredFields.every((field) => data[field] !== undefined);

    if (!hasRequiredFields) {
      console.error("Missing required callback fields");
      return false;
    }

    // TODO: Implement actual signature verification based on ToyyibPay docs
    // For now, return true if basic validation passes
    return true;
  }
}
