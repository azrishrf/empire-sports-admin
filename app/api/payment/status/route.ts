import { ToyyibPayService } from "@/lib/toyyibpay";
import { NextRequest, NextResponse } from "next/server";

interface TransactionResponse {
  billpaymentStatus: string;
  billCode: string;
  billName: string;
  billAmount: string;
  billPaymentDate: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const billCode = searchParams.get("billcode");

    if (!billCode) {
      return NextResponse.json({ success: false, message: "Bill code is required" }, { status: 400 });
    }

    // Get transaction status from ToyyibPay
    const response = await ToyyibPayService.getBillTransactions(billCode);

    // Type guard to check if response is an array
    if (!Array.isArray(response) || response.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No transactions found",
        data: {
          billCode,
          status: "pending",
          transactions: [],
        },
      });
    }

    // Function to parse DD-MM-YYYY HH:mm:ss format to Date object
    const parseToyyibPayDate = (dateStr: string) => {
      const [datePart, timePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split("-").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    // Sort transactions by billpaymentDate to get the latest one
    const sortedTransactions = response.sort((a: TransactionResponse, b: TransactionResponse) => {
      const dateA = parseToyyibPayDate(a.billPaymentDate);
      const dateB = parseToyyibPayDate(b.billPaymentDate);
      return dateB.getTime() - dateA.getTime(); // Latest first
    });

    const latestTransaction = sortedTransactions[0] as TransactionResponse;

    return NextResponse.json({
      success: true,
      message: "Transaction status retrieved",
      data: {
        billCode,
        status:
          latestTransaction.billpaymentStatus === "1"
            ? "success"
            : latestTransaction.billpaymentStatus === "2"
              ? "pending"
              : "failed",
        transaction: latestTransaction,
        allTransactions: sortedTransactions,
      },
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check payment status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
