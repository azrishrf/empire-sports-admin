import { PaymentData, ToyyibPayService } from "@/lib/toyyibpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { orderId, amount, customerName, customerEmail, customerPhone, items } = body;

    if (!orderId || !amount || !customerName || !customerEmail || !customerPhone || !items) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    // Validate phone format (Malaysian format)
    const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s+/g, ""))) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format. Please use Malaysian format (e.g., 0123456789)" },
        { status: 400 },
      );
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
    }

    // Prepare payment data
    const paymentData: PaymentData = {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone: customerPhone.replace(/\s+/g, ""), // Remove spaces
      items: Array.isArray(items) ? items : [],
    };

    // Create bill with ToyyibPay
    const result = await ToyyibPayService.createBill(paymentData);

    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: "Payment initiated successfully",
        data: {
          billCode: result.data.BillCode,
          paymentUrl: result.data.BillpaymentUrl,
          orderId: orderId,
        },
      });
    } else {
      console.error("ToyyibPay error:", result.error);
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create payment",
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
