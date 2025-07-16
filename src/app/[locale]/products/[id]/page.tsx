import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>Viewing details for product ID: {params.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for this product will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
