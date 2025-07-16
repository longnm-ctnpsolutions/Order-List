import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CreateOrderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Use the form below to create a new order.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A form to create a new order will be here.</p>
      </CardContent>
    </Card>
  );
}
