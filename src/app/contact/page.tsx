"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Gift form schema
const formSchema = z.object({
  recipientName: z.string().min(2, {
    message: "Recipient name must be at least 2 characters.",
  }),
  giftMessage: z.string().min(10, {
    message: "Gift message must be at least 10 characters.",
  }),
  deliveryAddress: z.string().min(5, {
    message: "Please enter a valid delivery address.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to our privacy policy.",
  }),
});

export default function GiftPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      giftMessage: "",
      deliveryAddress: "",
      email: "",
      privacy: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const payload = {
      recipientName: values.recipientName,
      giftMessage: values.giftMessage,
      deliveryAddress: values.deliveryAddress,
      email: values.email,
    };

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/gift/send-gift", // Update API endpoint for gift submission
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting gift form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Gift Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-extrabold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800">
                  Send a Thoughtful Gift
                </span>
                <span className="text-gray-800 block text-3xl mt-2">
                  Surprise someone special with a personalized gift!
                </span>
              </h1>
              <p className="text-gray-600">
                Want to send a thoughtful gift? Fill out the details below, and we'll take care of the rest!
              </p>
            </div>

            {!isSubmitted ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Recipient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="giftMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gift Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Leave a message for the recipient"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Delivery address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to our friendly{" "}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              privacy policy
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending Gift..." : "Send Gift"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">
                  Gift Sent Successfully!
                </h2>
                <p className="text-gray-600">
                  Your thoughtful gift will be delivered shortly.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info and Image */}
          <div className="lg:pl-8">
            <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden bg-blue-100">
              <div className="absolute inset-0 " />
              <img
                src="/gift/illustration.jpg"
                alt="Gift"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-6 w-6 text-black-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@yourgiftshop.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Phone className="h-6 w-6 text-black-600" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">(0252)8324 9231</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
