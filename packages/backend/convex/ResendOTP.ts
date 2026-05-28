import { Email } from "@convex-dev/auth/providers/Email"
import { type RandomReader, generateRandomString } from "@oslojs/crypto/random"
import { Resend as ResendAPI } from "resend"

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array<ArrayBuffer>) {
        crypto.getRandomValues(bytes)
      },
    }
    return generateRandomString(random, "0123456789", 8)
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey)
    const { error } = await resend.emails.send({
      from: "Auth <onboarding@resend.dev>",
      to: [email],
      subject: "Your sign-in code",
      text: `Your verification code is: ${token}`,
    })
    if (error) {
      throw new Error(JSON.stringify(error))
    }
  },
})
