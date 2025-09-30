import { ServerOrderService } from "@/lib/serverOrderService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ToyyibPay sends callbacks as multipart/form-data
    const formData = await request.formData();
    const payload = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, value.toString()]));

    const { refno, status, reason, billcode, order_id, amount, transaction_time } = payload;

    // Basic validation - ensure required fields are present
    if (!refno || !status || !billcode || !order_id) {
      console.error("Missing required callback parameters");
      return NextResponse.json(
        {
          success: false,
          message: "Missing required callback parameters",
        },
        { status: 400 },
      );
    }

    // Validate status is a valid value (1=success, 2=pending, 3=fail)
    const validStatuses = ["1", "2", "3"];
    if (!validStatuses.includes(status.toString())) {
      console.error("Invalid payment status:", status);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment status",
        },
        { status: 400 },
      );
    }

    // Validate amount is a number
    if (amount && isNaN(parseFloat(amount.toString()))) {
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid amount format",
        },
        { status: 400 },
      );
    }

    // Process payment based on status
    if (status === "1") {
      // Payment successful
      console.log(`Payment successful for order ${order_id}: ${refno}`);

      try {
        // Find and update order in Firestore
        const order = await ServerOrderService.getOrderByOrderId(order_id);
        if (order) {
          await ServerOrderService.updateOrderPaymentStatus(order.id!, {
            status: "success",
            transactionId: refno,
            billCode: billcode,
            notes: `Payment completed at ${transaction_time}. Amount: ${amount}`,
          });
          console.log(`Order ${order_id} updated with payment success`);
        } else {
          console.warn(`Order ${order_id} not found in database`);
        }
      } catch (error) {
        console.error(`Failed to update order ${order_id}:`, error);
        // Continue processing even if database update fails
      }

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        data: {
          orderId: order_id,
          transactionId: refno,
          status: "success",
        },
      });
    } else if (status === "2") {
      // Payment pending
      console.log(`Payment pending for order ${order_id}: ${refno}`);

      return NextResponse.json({
        success: true,
        message: "Payment is pending",
        data: {
          orderId: order_id,
          transactionId: refno,
          status: "pending",
        },
      });
    } else if (status === "3") {
      // Payment failed
      console.log(`Payment failed for order ${order_id}: ${reason}`);

      try {
        // Find and update order in Firestore
        const order = await ServerOrderService.getOrderByOrderId(order_id);
        if (order) {
          await ServerOrderService.updateOrderPaymentStatus(order.id!, {
            status: "failed",
            billCode: billcode,
            notes: `Payment failed: ${reason}`,
          });
          console.log(`Order ${order_id} updated with payment failure`);
        } else {
          console.warn(`Order ${order_id} not found in database`);
        }
      } catch (error) {
        console.error(`Failed to update order ${order_id}:`, error);
        // Continue processing even if database update fails
      }

      return NextResponse.json({
        success: true,
        message: "Payment failed",
        data: {
          orderId: order_id,
          status: "failed",
          reason: reason,
        },
      });
    } else {
      // Unknown status
      console.log(`Unknown payment status ${status} for order ${order_id}`);

      return NextResponse.json({
        success: false,
        message: "Unknown payment status",
        data: {
          orderId: order_id,
          status: "unknown",
        },
      });
    }
  } catch (error) {
    console.error("Payment callback error:", error);
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

// Handle GET requests (ToyyibPay might send GET requests for some callbacks)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const billcode = searchParams.get("billcode");
  const order_id = searchParams.get("order_id");

  console.log("Payment callback GET:", { status, billcode, order_id });

  return NextResponse.json({
    success: true,
    message: "Callback received via GET",
    data: { status, billcode, order_id },
  });
}
