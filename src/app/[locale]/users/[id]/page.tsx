import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Viewing details for user ID: {params.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for this user will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
