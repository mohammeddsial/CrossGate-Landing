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

$to      = "zahidshersial@gmail.com, support@crossgatelegal.com";
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

$headers  = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $body, $headers)) {
    header("Location: contact.html?success=1");
} else {
    header("Location: contact.html?error=server");
}
exit;
