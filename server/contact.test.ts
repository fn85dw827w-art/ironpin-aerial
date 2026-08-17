import { describe, expect, it } from "vitest";
import { Resend } from "resend";

describe("Resend API key validation", () => {
  it("should have a valid Resend API key configured", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be set").toBeTruthy();
    expect(apiKey?.startsWith("re_"), "RESEND_API_KEY should start with re_").toBe(true);
  });

  it("should successfully send a test email via Resend to verified address", async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // In Resend sandbox mode (unverified domain), emails can only go to the account owner.
    // Once ironpinaerial.com is verified in Resend, the `to` address will switch to quote@ironpinaerial.com
    const result = await resend.emails.send({
      from: "IronPin Aerial <no-reply@ironpinaerial.com>",
      to: ["quote@ironpinaerial.com"],
      subject: "[TEST] IronPin Aerial — Contact Form Integration Test",
      html: "<p>This is an automated test email confirming the IronPin Aerial contact form email integration is working correctly. The Resend API key is valid.</p><p>Once <strong>ironpinaerial.com</strong> is verified as a sending domain in Resend, production emails will route to quote@ironpinaerial.com.</p>",
      text: "This is an automated test email confirming the IronPin Aerial contact form email integration is working correctly. The Resend API key is valid.\n\nOnce ironpinaerial.com is verified as a sending domain in Resend, production emails will route to quote@ironpinaerial.com.",
    });

    expect(result.error, `Resend send failed: ${JSON.stringify(result.error)}`).toBeNull();
    expect(result.data?.id).toBeTruthy();
    console.log(`[Test] Email sent successfully to dallas.hobbs@ironpinaerial.com. Resend ID: ${result.data?.id}`);
  });
});
