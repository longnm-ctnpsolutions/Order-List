import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>Viewing details for order ID: {params.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for this order will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
