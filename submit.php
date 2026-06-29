<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: contact.html");
    exit;
}

$name     = htmlspecialchars(strip_tags(trim($_POST["name"] ?? "")));
$company  = htmlspecialchars(strip_tags(trim($_POST["company"] ?? "")));
$email    = filter_var(trim($_POST["email"] ?? ""), FILTER_VALIDATE_EMAIL);
$phone    = htmlspecialchars(strip_tags(trim($_POST["phone"] ?? "")));
$supplier = htmlspecialchars(strip_tags(trim($_POST["supplier"] ?? "")));
$reg      = htmlspecialchars(strip_tags(trim($_POST["reg"] ?? "")));
$juris    = htmlspecialchars(strip_tags(trim($_POST["jurisdiction"] ?? "")));
$message  = htmlspecialchars(strip_tags(trim($_POST["message"] ?? "")));
$intent   = htmlspecialchars(strip_tags(trim($_POST["intent"] ?? "report")));

if (!$name || !$company || !$email || !$supplier || !$juris) {
    header("Location: contact.html?error=required");
    exit;
}

// ---- Honeypot check ----
if (!empty($_POST["website"])) {
    header("Location: contact.html?error=spam");
    exit;
}

// ---- Cloudflare Turnstile ----
$turnstileSecret = "0x4AAAAAADsndiEu7aVdIFWwZ2CMzav8AO0";
$token = $_POST["cf-turnstile-response"] ?? "";
$ip    = $_SERVER["REMOTE_ADDR"] ?? "";
$ch    = curl_init("https://challenges.cloudflare.com/turnstile/v0/siteverify");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => "secret=$turnstileSecret&response=$token&remoteip=$ip",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
]);
$res = json_decode(curl_exec($ch), true);
curl_close($ch);
if (!$res || !($res["success"] ?? false)) {
    header("Location: contact.html?error=captcha");
    exit;
}

$fromEmail = "support@crossgatelegal.com";
$adminTo   = "zahidshersial@gmail.com, support@crossgatelegal.com";

// ----- Admin notification -----
$subject = "CrossGate Legal — " . ($intent === "lawyer" ? "Speak to a Lawyer" : "Verification Request") . " from $name";
$body  = "=== New CrossGate Legal Inquiry ===\n\n";
$body .= "Intent: " . ($intent === "lawyer" ? "Speak to a Lawyer" : "Verification Report") . "\n";
$body .= "Name: $name\n";
$body .= "Company: $company\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n\n";
$body .= "--- Supplier Details ---\n";
$body .= "Supplier: $supplier\n";
$body .= "Registration No: $reg\n";
$body .= "Jurisdiction: $juris\n\n";
$body .= "Message:\n$message\n";
$headers  = "From: CrossGate Legal <$fromEmail>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$mailOk = mail($adminTo, $subject, $body, $headers, "-f $fromEmail");

// ----- Auto-reply to submitter -----
if ($mailOk && $email) {
    $type = $intent === "lawyer" ? "speaking with a vetted cross-border trade lawyer" : "your supplier verification report";
    $replySubject = $intent === "lawyer" ? "Thank you — we'll connect you with a trade lawyer" : "Thank you — CrossGate Legal has received your request";
    if ($intent === "lawyer") {
        $replyBody = "
<html>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#0B0F0E;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#0B0F0E;padding:40px 16px'>
<tr><td align='center'>
<table width='560' cellpadding='0' cellspacing='0' style='max-width:560px;background:#131918;border:1px solid rgba(201,169,110,0.18);border-radius:10px;overflow:hidden'>
<tr><td style='padding:36px 32px 0;text-align:center'>
<img src='https://crossgatelegal.com/logo.png' alt='CrossGate Legal' width='56' height='56' style='border-radius:50%;border:2px solid rgba(201,169,110,0.3)'/>
<h1 style='font-family:Georgia,\"Times New Roman\",serif;font-size:24px;color:#F0EBE0;margin:16px 0 8px'>Legal counsel request received</h1>
<p style='font-size:14px;color:#7A8880;line-height:1.7;margin:0 0 20px'>Thank you, <strong style='color:#E4CC9F'>$name</strong>. We're matching you with the right lawyer for your needs in <strong style='color:#E4CC9F'>$juris</strong>.</p>
</td></tr>
<tr><td style='padding:0 32px'>
<hr style='border:none;border-top:1px solid rgba(201,169,110,0.12);margin:0'/>
</td></tr>
<tr><td style='padding:22px 32px 28px'>
<p style='font-size:13.5px;color:#7A8880;line-height:1.75;margin:0'>One of our team will reach out within <strong style='color:#F0EBE0'>one business day</strong> to discuss your requirements and introduce you to a pre-screened lawyer with relevant cross-border trade expertise.</p>
<p style='font-size:13.5px;color:#7A8880;line-height:1.75;margin:16px 0 0'>In the meantime, if you have any urgent questions, reply to this email or write to <a href='mailto:admin@crossgatelegal.com' style='color:#C9A96E;text-decoration:none'>admin@crossgatelegal.com</a>.</p>
</td></tr>
<tr><td style='padding:20px 32px;background:rgba(201,169,110,0.04);border-top:1px solid rgba(201,169,110,0.08)'>
<p style='font-size:11px;color:#5A685F;margin:0;text-align:center'>CrossGate Legal Ltd &middot; Trade Risk Intelligence &middot; United Kingdom</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>";
    } else {
        $replyBody = "
<html>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#0B0F0E;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#0B0F0E;padding:40px 16px'>
<tr><td align='center'>
<table width='560' cellpadding='0' cellspacing='0' style='max-width:560px;background:#131918;border:1px solid rgba(201,169,110,0.18);border-radius:10px;overflow:hidden'>
<tr><td style='padding:36px 32px 0;text-align:center'>
<img src='https://crossgatelegal.com/logo.png' alt='CrossGate Legal' width='56' height='56' style='border-radius:50%;border:2px solid rgba(201,169,110,0.3)'/>
<h1 style='font-family:Georgia,\"Times New Roman\",serif;font-size:24px;color:#F0EBE0;margin:16px 0 8px'>Thank you, $name</h1>
<p style='font-size:14px;color:#7A8880;line-height:1.7;margin:0 0 20px'>We've received your verification request regarding <strong style='color:#E4CC9F'>$supplier</strong> in <strong style='color:#E4CC9F'>$juris</strong>.</p>
</td></tr>
<tr><td style='padding:0 32px'>
<hr style='border:none;border-top:1px solid rgba(201,169,110,0.12);margin:0'/>
</td></tr>
<tr><td style='padding:22px 32px 28px'>
<p style='font-size:13.5px;color:#7A8880;line-height:1.75;margin:0'>We're now reviewing the details you shared and will be in touch within <strong style='color:#F0EBE0'>one business day</strong> with next steps for $type.</p>
<p style='font-size:13.5px;color:#7A8880;line-height:1.75;margin:16px 0 0'>If you need to reach us sooner, reply to this email or contact us directly at <a href='mailto:admin@crossgatelegal.com' style='color:#C9A96E;text-decoration:none'>admin@crossgatelegal.com</a>.</p>
</td></tr>
<tr><td style='padding:20px 32px;background:rgba(201,169,110,0.04);border-top:1px solid rgba(201,169,110,0.08)'>
<p style='font-size:11px;color:#5A685F;margin:0;text-align:center'>CrossGate Legal Ltd &middot; Trade Risk Intelligence &middot; United Kingdom</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>";
    }
    $replyHeaders  = "MIME-Version: 1.0\r\n";
    $replyHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
    $replyHeaders .= "From: CrossGate Legal <$fromEmail>\r\n";
    $replyHeaders .= "Reply-To: CrossGate Legal <$fromEmail>\r\n";
    mail($email, $replySubject, $replyBody, $replyHeaders, "-f $fromEmail");
}

if ($mailOk) {
    header("Location: contact.html?success=1");
} else {
    header("Location: contact.html?error=server");
}
exit;