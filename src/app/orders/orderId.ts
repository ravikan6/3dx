import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { giftId } = req.query;

  const mockGifts = [
    {
      id: "GIFT001",
      sender: "John Doe",
      recipient: "Jane Smith",
      message: "Happy Birthday, enjoy your special day!",
      deliveryAddress: "123 Main St, Cityville, 12345",
      status: "Shipped",
      estimatedDelivery: "2024-02-05",
      items: [
        { id: 1, name: "3D Custom Portrait", price: "$99.99" },
      ],
      total: "$99.99"
    },
    {
      id: "GIFT002",
      sender: "Alice Cooper",
      recipient: "Bob Marley",
      message: "Wishing you all the best for the new year!",
      deliveryAddress: "456 Elm St, Townsville, 67890",
      status: "Processing",
      estimatedDelivery: "2024-02-10",
      items: [
        { id: 2, name: "3D Printed Vase Set", price: "$45.99" },
      ],
      total: "$45.99"
    },
    {
      id: "GIFT003",
      sender: "Eve Adams",
      recipient: "Charles Dickens",
      message: "Hope this brings a smile to your face!",
      deliveryAddress: "789 Oak St, Villageville, 11223",
      status: "Delivered",
      estimatedDelivery: "2024-01-30",
      items: [
        { id: 3, name: "Personalized Keychain", price: "$19.99" },
      ],
      total: "$19.99"
    }
  ];

  const gift = mockGifts.find((gift) => gift.id === giftId);

  if (gift) {
    res.status(200).json(gift);
  } else {
    res.status(404).json({ message: "Gift not found" });
  }
}
