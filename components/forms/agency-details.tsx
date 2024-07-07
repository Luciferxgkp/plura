"use client";
import { Agency } from "@prisma/client";
import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog } from "../ui/alert-dialog";
import FileUpload from "@/components/global/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";

type Props = {
  data?: Partial<Agency>;
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Agency name should be atleast 2 characters long" }),
  companyEmail: z.string().email(),
  companyPhone: z
    .string()
    .min(10, { message: "Phone number should be atleast 10 characters long" }),
  whiteLabel: z.boolean(),
  address: z
    .string()
    .min(5, { message: "Address should be atleast 5 characters long" }),
  city: z
    .string()
    .min(2, { message: "City name should be atleast 2 characters long" }),
  zipCode: z
    .string()
    .min(5, { message: "Zip code should be atleast 5 characters long" }),
  state: z
    .string()
    .min(2, { message: "State name should be atleast 2 characters long" }),
  country: z
    .string()
    .min(2, { message: "Country name should be atleast 2 characters long" }),
  agencyLogo: z.string().min(1),
});

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const [deletingAgency, setDeletingAgency] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  //   useEffect(() => {
  //     if(data)
  //         form.reset(data);
  //     }
  //     }, [data ]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Agency Details</CardTitle>
          <CardDescription>
            Our straightforward pricing plans are tailored to meet your needs.
            If
            {" you're"} not <br />
            ready to commit you can get started for free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                name="agencyLogo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
