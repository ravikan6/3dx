import { NextApiRequest, NextApiResponse } from "next";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: string;
  status: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: string;
  status: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  // Validate query parameter
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ message: "Invalid or missing orderId" });
  }

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "ORD001",
      date: "2024-01-31",
      items: [
        {
          id: 1,
          name: "Custom 3D Portrait",
          image: "/placeholder.svg",
          price: "$99.99",
          status: "Delivered",
        },
      ],
      total: "$99.99",
      status: "Delivered",
    },
    {
      id: "ORD002",
      date: "2024-01-28",
      items: [
        {
          id: 2,
          name: "3D Printed Vase Set",
          image: "/placeholder.svg",
          price: "$45.99",
          status: "Processing",
        },
      ],
      total: "$45.99",
      status: "Processing",
    },
    {
      id: "ORD003",
      date: "2024-01-25",
      items: [
        {
          id: 3,
          name: "Architectural Model Kit",
          image: "/placeholder.svg",
          price: "$149.99",
          status: "Shipped",
        },
      ],
      total: "$149.99",
      status: "Shipped",
    },
  ];

  // Find order by ID
  const order = mockOrders.find((order) => order.id === orderId);

  if (order) {
    return res.status(200).json(order); // Return order details
  } else {
    return res.status(404).json({ message: "Order not found" }); // Handle not found
  }
}
