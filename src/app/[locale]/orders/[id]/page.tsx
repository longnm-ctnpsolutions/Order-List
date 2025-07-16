import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/features/orders/lib/data";
import { type Order } from "@/features/orders/types/order.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Truck, CreditCard, User, Mail, Phone, Home } from "lucide-react";

const getStatusBadgeClass = (status: Order["status"]): string => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "New Order":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Waiting Process":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the order by ID from an API.
  // For now, we'll find it in our mock data.
  // We'll use the first order as a stand-in since the ID might not match.
  const order = orders[2];

  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The order with ID {params.id} could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Order ORD-{params.id}</CardTitle>
                            <CardDescription className="mt-1">
                                Order placed on <time dateTime={order.orderDate}>{formatDate(order.orderDate)}</time>
                            </CardDescription>
                        </div>
                         <Badge
                            className={`rounded-md px-3 py-1 text-sm font-semibold border capitalize ${getStatusBadgeClass(order.status)}`}
                            variant="outline"
                        >
                            {order.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div className="grid gap-4">
                        <div className="font-semibold text-lg">Order Summary</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Temporary Order ID</span>
                                <span>{order.temporaryOrderId}</span>
                            </li>
                             <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Quantity</span>
                                <span>{order.quantity} units</span>
                            </li>
                             <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Confirmed Quantity</span>
                                <span>{order.confirmedQuantity} units</span>
                            </li>
                             <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Back Order</span>
                                <span>{order.backOrder}</span>
                            </li>
                        </ul>
                         <Separator />
                        <dl className="grid gap-3">
                             <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Subtotal</dt>
                                <dd>{(order.total * 0.9).toLocaleString('en-US', { style: 'currency', currency: order.currency })}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">VAT (10%)</dt>
                                <dd>{(order.total * 0.1).toLocaleString('en-US', { style: 'currency', currency: order.currency })}</dd>
                            </div>
                            <div className="flex items-center justify-between font-semibold">
                                <dt>Total</dt>
                                <dd>{order.total.toLocaleString('en-US', { style: 'currency', currency: order.currency })}</dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Print Invoice</Button>
                    <Button>Issue Refund</Button>
                </CardFooter>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <CardTitle>Customer</CardTitle>
                        <CardDescription>{order.customerId}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                     <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>customer@example.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+1 234 567 890</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Home className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <CardTitle>Shipping Address</CardTitle>
                        <CardDescription>
                             123 Main Street, Anytown, USA 12345
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Shipping Method: Standard</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <CardTitle>Payment</CardTitle>
                        <CardDescription>
                             Paid with Visa ending in 1234
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    </div>
  );
}
