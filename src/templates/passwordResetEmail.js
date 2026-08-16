export const passwordResetEmail = (name, resetUrl) => {
  return `
<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Request</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">

<!-- Header -->

<tr>
<td align="center" style="background:#2563eb;padding:30px;">

<h1 style="margin:0;color:#ffffff;font-size:28px;">
Job Portal
</h1>

<p style="margin:8px 0 0;color:#dbeafe;font-size:15px;">
Find Your Dream Career
</p>

</td>
</tr>

<!-- Body -->

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
Password Reset Request 🔐
</h2>

<p style="color:#4b5563;font-size:16px;line-height:1.7;">
Hi <strong>${name}</strong>,
</p>

<p style="color:#4b5563;font-size:16px;line-height:1.7;">
We received a request to reset your password for your Job Portal account. 
If you didn't make this request, you can safely ignore this email.
</p>

<p style="color:#4b5563;font-size:16px;line-height:1.7;">
Click the button below to reset your password. This link will expire in <strong>15 minutes</strong> for security reasons.
</p>

<div style="text-align:center;margin:35px 0;">
<a href="${resetUrl}"
style="
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:14px 32px;
border-radius:8px;
display:inline-block;
font-weight:bold;
font-size:16px;">
Reset Password
</a>
</div>

<p style="color:#6b7280;font-size:14px;line-height:1.7;">
If the button above doesn't work, copy and paste this link into your browser:
</p>

<p style="color:#2563eb;font-size:14px;word-break:break-all;background:#f9fafb;padding:12px;border-radius:6px;">
${resetUrl}
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

<p style="color:#6b7280;font-size:14px;line-height:1.7;">
For security reasons, this link will expire in 15 minutes. 
If you need a new reset link, please request another one from the login page.
</p>

<p style="margin-top:35px;color:#111827;font-size:16px;">
Best Regards,<br>
<strong>Job Portal Team</strong>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">

<p style="margin:0;color:#6b7280;font-size:13px;">
© ${new Date().getFullYear()} Job Portal. All rights reserved.
</p>

<p style="margin:10px 0 0;color:#9ca3af;font-size:12px;">
This is an automated email. Please do not reply directly to this message.
</p>

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