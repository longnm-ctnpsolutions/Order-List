
// src/app/[locale]/orders/[id]/page.tsx
'use client';

import * as React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Upload,
  Copy,
  Save,
  RefreshCw,
  Calendar,
  List,
  Plus,
  Trash2,
  AlertTriangle,
  ChevronDown,
  User,
  Truck,
  Clock,
  FileText,
  Box,
  ChevronUp,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Mock data based on the UI
const orderData = {
  orderId: '001200058',
  status: 'Completed',
  temporaryOrderId: '0001252561',
  orderDate: '11:00 AM 27/06/2025',
  totalItems: '0001252561',
  channel: 26,
  poNumber: '____',
  customerInfo: {
    customerCode: '0012000058',
    companyName: 'HOANG HUNG COMPANY',
    address: 'Floor 2 of Nguyen Tung Tuy Building, Ba Dinh',
    provinceCity: 'Ha Noi',
    taxCode: '0012000058',
    phone: '04-36207792',
    fax: '04-39277784',
    contactPerson: 'Nguyen Van Hai',
  },
  deliveryAddress: {
    customerCode: '0012000058',
    deliveryCode: '04-BSTVN',
    companyName: 'HOANG HUNG COMPANY',
    deliveryAddress: '20 Mac Thi Buoi, Ha Noi',
    provinceCity: 'Ha Noi',
    phone: '04-36207762',
    fax: '04-39277764',
    contactPerson: 'Nguyen Van Hai',
    atWarehouse: true,
    recipientName: 'Nguyen Van An',
    cccdNumber: '05439277764',
    dateOfIssue: '27/06/2025',
    recipientPhone: '04-36207734',
    licensePlate: '54H140040',
  },
  deliveryTimeSlot: {
    deliveryRound: 'Round 1',
    expectedTime: '05:00 PM 27/06/2025',
  },
  deliveryNotes: [
    'Maximum shipment: 10 tons per trip',
    'Tire casings: up to 25 units',
    'Delivery address must match registered one',
    'Distance: 16 km',
  ],
  products: [
    {
      id: 1,
      productCode: '0000182951',
      productName: 'Tire 121',
      description: '0012000058',
      origin: 'TH',
      quantity: 1.0,
      unitPrice: 4,
      amountExcl: 5,
      amountIncl: 5.5,
    },
    {
      id: 2,
      productCode: '0000182952',
      productName: 'Tire 232',
      description: '0012000058',
      origin: 'VN',
      quantity: 2.0,
      unitPrice: 8,
      amountExcl: 10,
      amountIncl: 11,
    },
  ],
};

const PageHeader = () => {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/en/orders" passHref>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Order Details</h1>
        </div>
  
        {/* Actions for mobile and small tablets */}
        <div className="flex md:hidden gap-2 w-full">
            <Button variant="outline" className="flex-1 bg-green-600 text-white hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Save
            </Button>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Upload className="mr-2 h-4 w-4" />
                        Export
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Save className="mr-2 h-4 w-4" />
                        Save As Draft
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
  
        {/* Actions for larger screens */}
        <div className="hidden md:flex gap-2">
          <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm BO
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save As Draft
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Save Order
          </Button>
        </div>
      </div>
    );
  };
  
const OrderSummary = ({ data }: { data: typeof orderData }) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
    <span>
      Order ID: <span className="font-semibold text-foreground">{data.orderId}</span>
      <Badge variant="outline" className="ml-2 border-green-600 text-green-600 bg-green-50">
        {data.status}
      </Badge>
    </span>
    <span>Temporary Order ID: <span className="font-semibold text-foreground">{data.temporaryOrderId}</span></span>
    <span>Order Date: <span className="font-semibold text-foreground">{data.orderDate}</span></span>
    <span>Total Items: <span className="font-semibold text-foreground">{data.totalItems}</span></span>
    <span>Channel: <span className="font-semibold text-foreground">{data.channel}</span></span>
    <span>PO Number: <span className="font-semibold text-foreground">{data.poNumber}</span></span>
  </div>
);

const InfoField = ({ label, value, required = false }: { label: string; value: string | React.ReactNode; required?: boolean }) => (
  <div>
    <label className="text-sm text-muted-foreground flex items-center">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {typeof value === 'string' ? (
      <Input readOnly value={value} className="mt-1 bg-gray-50" />
    ) : (
      <div className="mt-1">{value}</div>
    )}
  </div>
);

const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center space-x-3 pb-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const CustomerInfo = ({ data }: { data: typeof orderData.customerInfo }) => (
  <InfoCard icon={User} title="Customer & Delivery Information">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Customer Code" value={data.customerCode} required />
      <InfoField label="Company Name" value={data.companyName} required />
      <InfoField label="Address" value={data.address} />
      <InfoField label="Tax Code" value={data.taxCode} />
      <InfoField label="Province/City" value={data.provinceCity} />
      <div/>
      <InfoField label="Phone" value={data.phone} />
      <InfoField label="Fax" value={data.fax} />
      <InfoField
        label="Contact Person"
        value={
          <div className="relative">
            <Input readOnly value={data.contactPerson} className="bg-gray-50" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        }
      />
    </div>
  </InfoCard>
);

const DeliveryAddress = ({ data }: { data: typeof orderData.deliveryAddress }) => (
  <InfoCard icon={Truck} title="Delivery Address">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Customer Code" value={data.customerCode} required />
      <InfoField label="Company/Branch Name" value={data.companyName} />
      <InfoField label="Delivery Code" value={data.deliveryCode} />
      <div />
      <InfoField label="Delivery Address" value={data.deliveryAddress} />
      <div />
      <InfoField label="Province/City" value={data.provinceCity} />
      <InfoField label="Phone" value={data.phone} />
      <InfoField label="Fax" value={data.fax} />
      <InfoField
        label="Contact Person"
        value={
          <div className="relative">
            <Input readOnly value={data.contactPerson} className="bg-gray-50" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        }
      />
    </div>
    <div className="flex items-center space-x-2 my-4">
      <Checkbox id="warehouse" defaultChecked={data.atWarehouse} />
      <label htmlFor="warehouse" className="text-sm font-medium">At BSTVN Warehouse</label>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Recipient Name" value={data.recipientName} />
      <InfoField label="CCCD Number" value={data.cccdNumber} />
      <InfoField
        label="Date of Issue"
        value={
          <div className="relative">
            <Input readOnly value={data.dateOfIssue} className="bg-gray-50 pl-10" />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        }
      />
      <InfoField label="Phone" value={data.recipientPhone} />
      <InfoField label="License Plate Number" value={data.licensePlate} />
    </div>
    <Alert className="mt-4 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-700">
        The order placer is legally responsible for the identity of the recipient.
      </AlertDescription>
    </Alert>
  </InfoCard>
);

const DeliveryTimeSlot = ({ data }: { data: typeof orderData.deliveryTimeSlot }) => (
  <InfoCard icon={Clock} title="Delivery Time Slot">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField
        label="Delivery Round"
        value={
          <div className="relative">
            <Input readOnly value={data.deliveryRound} className="bg-gray-50" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        }
      />
      <InfoField label="Expected Delivery Time" value={data.expectedTime} />
    </div>
  </InfoCard>
);

const DeliveryNotes = ({ data }: { data: typeof orderData.deliveryNotes }) => (
  <InfoCard icon={FileText} title="Delivery Notes (Guideline for BSTVN)">
    <p className="text-sm font-semibold mb-2">Important Guidelines:</p>
    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
      {data.map((note, index) => <li key={index}>{note}</li>)}
    </ul>
  </InfoCard>
);

const ProductDetailsTable = ({ data }: { data: typeof orderData.products }) => {
    const SortableHeader = ({ children }: { children: React.ReactNode }) => (
      <div className="flex items-center cursor-pointer">
        {children}
        <div className="flex flex-col ml-1">
            <ChevronUp className="h-3 w-3 -mb-1 text-muted-foreground/50"/>
            <ChevronDown className="h-3 w-3 -mt-1 text-muted-foreground"/>
        </div>
      </div>
    );
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <Box className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px]"><SortableHeader>No.</SortableHeader></TableHead>
                  <TableHead><SortableHeader>Product Code</SortableHeader></TableHead>
                  <TableHead><SortableHeader>Product Name</SortableHeader></TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead><SortableHeader>Origin</SortableHeader></TableHead>
                  <TableHead className="text-right"><SortableHeader>Quantity</SortableHeader></TableHead>
                  <TableHead className="text-right"><SortableHeader>Unit Price (Excl. VAT)</SortableHeader></TableHead>
                  <TableHead className="text-right"><SortableHeader>Amount (Excl. VAT)</SortableHeader></TableHead>
                  <TableHead className="text-right"><SortableHeader>Amount (Incl. VAT)</SortableHeader></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.origin}</TableCell>
                    <TableCell className="text-right">{product.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{product.unitPrice}</TableCell>
                    <TableCell className="text-right">{product.amountExcl}</TableCell>
                    <TableCell className="text-right">{product.amountIncl}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
            <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />Recalculate Date</Button>
            <Button variant="outline"><List className="mr-2 h-4 w-4" />Select from Price List</Button>
            <Button className="bg-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

export default function OrderDetailPage() {
  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <PageHeader />
      <OrderSummary data={orderData} />
      <Separator className="mb-6"/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          <CustomerInfo data={orderData.customerInfo} />
          <DeliveryTimeSlot data={orderData.deliveryTimeSlot} />
          <DeliveryNotes data={orderData.deliveryNotes} />
        </div>
        <div className="space-y-6">
          <DeliveryAddress data={orderData.deliveryAddress} />
        </div>
      </div>

      <ProductDetailsTable data={orderData.products} />
    </div>
  );
}
