import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shippoClient } from "~/server/shippo/client";
import { emailService } from "~/services/email";
import TrackingInfoCustomerTemplate from "~/services/email/email-templates/customer.track-order";
import { addressFormSchema, packageFormSchema } from "../schema";

export const shippingLabelRouter = createTRPCRouter({
  verifyAddress: protectedProcedure
    .input(addressFormSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const address = await shippoClient.address.create({
        street1: input.street,
        street2: input.additional,
        city: input.city,
        state: input.state,
        zip: input.zip,
        country: input.country ?? "US",
        validate: true,
        name: input.name,
      });

      if (!address)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping address not found.",
        });

      return address;
    }),

  getAvailableRates: protectedProcedure
    .input(
      z.object({
        customerAddress: addressFormSchema,
        businessAddress: addressFormSchema,
        parcel: packageFormSchema,
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const shipment = await shippoClient.shipment.create({
        address_from: {
          name: input.businessAddress.name,
          street1: input.businessAddress.street,
          street2: input.businessAddress.additional,
          city: input.businessAddress.city,
          state: input.businessAddress.state,
          zip: input.businessAddress.zip,
          country: "US",
        },
        address_to: {
          name: input.customerAddress.name,
          street1: input.customerAddress.street,
          street2: input.customerAddress.additional,
          city: input.customerAddress.city,
          state: input.customerAddress.state,
          zip: input.customerAddress.zip,
          country: "US",
        },
        parcels: [
          {
            length: `${input.parcel.package_length}`,
            width: `${input.parcel.package_width}`,
            height: `${input.parcel.package_height}`,
            distance_unit: input.parcel.distance_unit ?? "in",
            weight: `${
              (input.parcel.package_weight_lbs * 16 ?? 0) +
              (input.parcel.package_weight_oz ?? 0) / 16
            }`,
            mass_unit: input.parcel.mass_unit ?? "lb",
          },
        ],
      });

      if (!shipment?.rates)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping rates not found.",
        });

      // sort rates by smallest to largest cost
      const sortedRates = shipment.rates.sort(
        (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
      );

      return sortedRates;
    }),
  getLabel: protectedProcedure
    .input(z.object({ labelId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const label = await ctx.prisma.shippingLabel.findUnique({
        where: { id: input.labelId },
      });

      if (!label)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping label not found.",
        });

      return label;
    }),

  getShipments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN")
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action.",
      });

    const shipments = await shippoClient.transaction.list();

    if (!shipments)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shipments not found.",
      });

    return shipments.results;
  }),
  createLabel: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),

        cost: z.string(),
        carrier: z.string(),
        timeEstimate: z.string(),
        expireAt: z.date().optional(),
        orderId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      const shippingLabel = await shippoClient.transaction.create({
        rate: input.rateId,
        label_file_type: "PDF",
        async: false,
      });

      if (!shippingLabel)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating shipping label.",
        });

      const dbEntry = await ctx.prisma.shippingLabel.create({
        data: {
          labelUrl: shippingLabel?.label_url,
          trackingNumber: shippingLabel?.tracking_number,
          trackingUrl: shippingLabel?.tracking_url_provider,
          cost: input.cost,
          carrier: input.carrier,
          timeEstimate: input.timeEstimate,
          expireAt: input.expireAt,
          order: {
            connect: {
              id: input.orderId,
            },
          },
        },
      });

      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          status: "SHIPPED",
          whenShipped: new Date(),
        },
      });

      if (dbEntry.id && order?.email) {
        const emailData = {
          trackingLink: shippingLabel.tracking_url_provider,
        };
        await emailService.sendEmail<typeof emailData>({
          to: order.email,
          from: "Trend Anomaly <no-reply@trendanomaly.com>",
          subject: `A shipment from order ${input.orderId} is on the way`,
          data: emailData,
          template: TrackingInfoCustomerTemplate,
        });
      }

      return {
        shippingLabel,
        dbEntry,
      };
    }),
});
