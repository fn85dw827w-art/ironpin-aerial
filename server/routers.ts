import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  propertyAddress: z.string().max(300).optional(),
  propertyType: z.string().max(100).optional(),
  service: z.string().max(100).optional(),
  message: z.string().min(1).max(5000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(contactSchema)
      .mutation(async ({ input }) => {
        const { name, email, company, phone, propertyAddress, propertyType, service, message } = input;

        const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; color: #1a1a1a;">
  <h2 style="color: #E8500F; border-bottom: 2px solid #E8500F; padding-bottom: 8px;">
    New Quote Request — IronPin Aerial
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; width: 140px;">Name</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Email</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    ${company ? `<tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Company</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${company}</td>
    </tr>` : ""}
    ${phone ? `<tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Phone</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;"><a href="tel:${phone}">${phone}</a></td>
    </tr>` : ""}
    ${propertyAddress ? `<tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Property Address</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${propertyAddress}</td>
    </tr>` : ""}
    ${propertyType ? `<tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Property Type</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${propertyType}</td>
    </tr>` : ""}
    ${service ? `<tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Service</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${service}</td>
    </tr>` : ""}
    <tr>
      <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; vertical-align: top;">Message</td>
      <td style="padding: 8px 12px; white-space: pre-wrap;">${message}</td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #888;">
    Submitted via ironpinaerial.com contact form
  </p>
</div>`;

        const textBody = [
          "New Quote Request — IronPin Aerial",
          "---",
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          phone ? `Phone: ${phone}` : null,
          propertyAddress ? `Property Address: ${propertyAddress}` : null,
          propertyType ? `Property Type: ${propertyType}` : null,
          service ? `Service: ${service}` : null,
          `Message:\n${message}`,
        ].filter(Boolean).join("\n");

        const result = await resend.emails.send({
          from: "IronPin Aerial <no-reply@ironpinaerial.com>",
          to: ["info@ironpinaerial.com"],
          replyTo: email,
          subject: `Quote Request from ${name}${company ? ` — ${company}` : ""}`,
          html: htmlBody,
          text: textBody,
        });

        if (result.error) {
          console.error("[Contact] Resend error:", result.error);
          throw new Error("Email delivery failed");
        }

        return { success: true, id: result.data?.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
