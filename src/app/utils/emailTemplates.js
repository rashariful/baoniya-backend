// utils/emailTemplates.js

export const getPasswordResetEmailTemplate = (
  resetUrl,
  userName,
  expiryMinutes = 10,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          background-color: #f4f7fb;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 560px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
        }

        .header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }

        .logo {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .logo span {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }

        .header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }

        .content {
          padding: 40px 35px;
        }

        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 20px;
        }

        .message {
          color: #4a5568;
          margin-bottom: 30px;
          line-height: 1.7;
        }

        .button-container {
          text-align: center;
          margin: 35px 0;
        }

        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 35px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        .info-box {
          background: #f7fafc;
          border-left: 4px solid #f97316;
          padding: 20px;
          border-radius: 12px;
          margin: 25px 0;
        }

        .info-box p {
          margin: 5px 0;
          color: #4a5568;
          font-size: 14px;
        }

        .alternative-link {
          margin-top: 20px;
          font-size: 13px;
          color: #718096;
          word-break: break-all;
          background: #f7fafc;
          padding: 12px;
          border-radius: 8px;
        }

        .security-note {
          background: #fff5f0;
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
          border: 1px solid #fed7aa;
        }

        .security-note p {
          color: #9b2c2c;
          font-size: 13px;
          margin: 8px 0;
        }

        .footer {
          background: #f7fafc;
          padding: 30px 35px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }

        .social-links {
          margin-bottom: 20px;
        }

        .social-links a {
          display: inline-block;
          margin: 0 8px;
          text-decoration: none;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          background: #e2e8f0;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
          font-size: 14px;
          font-weight: bold;
        }

        .footer-text {
          color: #718096;
          font-size: 12px;
          margin-top: 15px;
        }

        .footer-text a {
          color: #f97316;
          text-decoration: none;
        }

        @media only screen and (max-width: 600px) {
          .container {
            margin: 20px;
          }

          .content {
            padding: 30px 20px;
          }

          .footer {
            padding: 25px 20px;
          }
        }
      </style>
    </head>

    <body>
      <div class="container">

        <!-- Header -->
        <div class="header">
          <div class="logo">
           <img src="https://admin.upayon.com/assets/logo-BmEUqsom.png" alt="${companyName}" width="80" style="margin-bottom: 15px; border-radius: 10px;" />
          </div>

          <h1>Reset Your Password</h1>

          <p>Upayon Ecommerce Security Center</p>
        </div>

        <!-- Content -->
        <div class="content">

          <div class="greeting">
            Hello${userName ? ` ${userName}` : ""}! 👋
          </div>

          <div class="message">
            We received a request to reset your Upayon account password.
            Click the button below to securely create a new password.
          </div>

          <div class="button-container">
            <a href="${resetUrl}" class="reset-button">
              Reset Password
            </a>
          </div>

          <div class="info-box">
            <p>
              <strong>
                🔐 This link will expire in ${expiryMinutes} minutes
              </strong>
            </p>

            <p>
              For security reasons, this password reset link can only be used once.
            </p>
          </div>

          <div class="alternative-link">
            <p>
              If the button doesn't work, copy and paste this link into your browser:
            </p>

            <p style="font-size:12px; color:#f97316;">
              ${resetUrl}
            </p>
          </div>

          <div class="security-note">
            <p><strong>⚠️ Didn't request this?</strong></p>

            <p>
              If you didn't request a password reset, please ignore this email.
              Your account remains secure.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">

          <div class="social-links">
            <a href="https://facebook.com/upayon">
              <div class="social-icon">f</div>
            </a>

            <a href="https://instagram.com/upayon">
              <div class="social-icon">i</div>
            </a>

            <a href="https://twitter.com/upayon">
              <div class="social-icon">x</div>
            </a>

            <a href="https://linkedin.com/company/upayon">
              <div class="social-icon">in</div>
            </a>
          </div>

          <div class="footer-text">
            <p><strong>Upayon</strong></p>

            <p>Your Trusted Ecommerce Website</p>

            <p style="margin-top:15px;">
              <a href="#">Privacy Policy</a> •
              <a href="#">Terms of Service</a> •
              <a href="#">Support</a>
            </p>

            <p style="margin-top:15px;">
              © ${new Date().getFullYear()} Upayon. All rights reserved.
            </p>

            <p style="margin-top:10px; font-size:11px;">
              This email was sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getOrderConfirmationTemplate = ({
  customerName,
  orderId,
  orderDate,
  items = [],
  subTotal = 0,
  deliveryCharge = 0,
  grandTotal = 0,
  paymentMethod = "cod",
  paymentStatus = "pending",
  paidAmount = 0,
  due = 0,
  address = "",
  note = "",
  companyName = "Upayon",
  logoUrl = "https://admin.upayon.com/assets/logo-BmEUqsom.png",
}) => {
  // Items mapping with Table Layout for cross-client compatibility
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; width: 70px; vertical-align: top;">
          <img
            src="${item.thumbnail?.url || "https://via.placeholder.com/60"}"
            alt="${item.name}"
            width="60"
            height="60"
            style="display: block; border-radius: 8px; object-fit: cover; border: 1px solid #eee;"
          />
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
          <p style="margin: 0; font-weight: 600; color: #1f2937; font-size: 14px; line-height: 1.4;">
            ${item.name}
          </p>
          ${
            item.variantSku
              ? `<p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">SKU: ${item.variantSku}</p>`
              : ""
          }
          <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">Qty: ${item.quantity} × ৳${item.price}</p>
        </td>
        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 700; color: #1f2937; vertical-align: top;">
          ৳${item.price * item.quantity}
        </td>
      </tr>
    `,
    )
    .join("");

  const statusColor = paymentStatus === "paid" ? "#16a34a" : "#ca8a04";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- HEADER -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px;">
                <img src="${logoUrl}" alt="${companyName}" width="80" style="margin-bottom: 15px; border-radius: 10px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: -0.5px;">Order Confirmed!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">We've received your order and it's being processed.</p>
              </td>
            </tr>

            <!-- CUSTOMER GREETING -->
            <tr>
              <td style="padding: 30px 40px 10px;">
                <h2 style="margin: 0; color: #111827; font-size: 20px;">Hello ${customerName},</h2>
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-top: 10px;">
                  Your order <strong>#${orderId}</strong> has been successfully placed. Here are the details of your transaction.
                </p>
              </td>
            </tr>

            <!-- ORDER DETAILS BOX -->
            <tr>
              <td style="padding: 0 40px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 10px; font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Order Info</p>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="font-size: 14px; padding: 4px 0; color: #374151;">Date: <strong>${orderDate}</strong></td>
                          <td align="right" style="font-size: 14px; padding: 4px 0; color: #374151;">Status: <span style="color: ${statusColor}; font-weight: 700; text-transform: uppercase;">${paymentStatus}</span></td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; padding: 4px 0; color: #374151;">Method: <strong>${paymentMethod.toUpperCase()}</strong></td>
                          <td align="right" style="font-size: 14px; padding: 4px 0; color: #374151;">ID: <strong>${orderId}</strong></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SHIPPING ADDRESS -->
            <tr>
              <td style="padding: 20px 40px 0;">
                 <p style="margin: 0 0 5px; font-size: 13px; color: #6b7280; font-weight: 700;">SHIPPING ADDRESS</p>
                 <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.5;">${address}</p>
              </td>
            </tr>

            <!-- ITEMS TABLE -->
            <tr>
              <td style="padding: 20px 40px;">
                <div style="border-top: 2px solid #f3f4f6; padding-top: 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>
                </div>
              </td>
            </tr>

            <!-- TOTALS -->
            <tr>
              <td style="padding: 0 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-left: auto; width: 250px;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
                    <td align="right" style="padding: 5px 0; color: #1f2937; font-size: 14px; font-weight: 600;">৳${subTotal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Delivery</td>
                    <td align="right" style="padding: 5px 0; color: #1f2937; font-size: 14px; font-weight: 600;">৳${deliveryCharge}</td>
                  </tr>
                   <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Paid</td>
                    <td align="right" style="padding: 5px 0; color: #16a34a; font-size: 14px; font-weight: 600;">৳${paidAmount}</td>
                  </tr>
                  <tr style="border-top: 1px solid #eee;">
                    <td style="padding: 10px 0; color: #111827; font-size: 18px; font-weight: 700;">Total</td>
                    <td align="right" style="padding: 10px 0; color: #f97316; font-size: 20px; font-weight: 800;">৳${grandTotal}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- NOTE SECTION -->
            ${
              note
                ? `
            <tr>
              <td style="padding: 0 40px 20px;">
                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 700;">CUSTOMER NOTE:</p>
                  <p style="margin: 5px 0 0; font-size: 14px; color: #b45309;">${note}</p>
                </div>
              </td>
            </tr>`
                : ""
            }

            <!-- FOOTER -->
            <tr>
              <td align="center" style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Need help? Email us at <a href="mailto:support@upayon.com" style="color: #f97316; text-decoration: none; font-weight: 600;">support@upayon.com</a></p>
                <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
