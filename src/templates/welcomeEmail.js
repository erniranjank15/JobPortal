export const welcomeEmail = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Job Portal</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">

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
Welcome, ${name}! 👋
</h2>

<p style="color:#4b5563;font-size:16px;line-height:1.7;">
Thank you for creating your account with
<strong>Job Portal</strong>.
Your registration has been completed successfully.
</p>

<p style="color:#4b5563;font-size:16px;line-height:1.7;">
You can now:
</p>

<ul style="color:#4b5563;font-size:16px;line-height:1.8;padding-left:20px;">
<li>Create your professional profile</li>
<li>Upload your latest resume</li>
<li>Search thousands of jobs</li>
<li>Apply with a single click</li>
<li>Track your application status</li>
</ul>

<div style="text-align:center;margin:35px 0;">
<a href="http://localhost:5173/login"
style="
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:14px 32px;
border-radius:8px;
display:inline-block;
font-weight:bold;
font-size:16px;">
Explore Jobs
</a>
</div>

<p style="color:#6b7280;font-size:15px;line-height:1.7;">
We're excited to help you find the perfect opportunity.
If you have any questions, simply reply to this email—we're happy to help.
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