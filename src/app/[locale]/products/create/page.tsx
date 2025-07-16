import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CreateProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>Use the form below to create a new product.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A form to create a new product will be here.</p>
      </CardContent>
    </Card>
  );
}
