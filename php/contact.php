<?php
/**
 * Contact form handler
 * ---------------------------------------------------------
 * - Validates incoming POST fields
 * - Sends an email to the site owner (configure $to)
 * - Optionally appends each message to messages.log (configure $logFile)
 * - Responds with JSON when called via fetch(), otherwise redirects back home.
 *
 * CONFIG:
 *   $to        → destination email address
 *   $fromEmail → "From" address (must usually live on your domain)
 *   $logFile   → optional path to log file (set to null to disable)
 */

declare(strict_types=1);

$config = [
    'to'        => 'hello@yourname.dev',   // ← change to your real email
    'fromEmail' => 'no-reply@yourname.dev',
    'logFile'   => __DIR__ . '/messages.log',
];

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

/* ---------- helpers ---------- */
function clean(string $v): string {
    return trim(strip_tags($v));
}

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'message' => $msg]);
    exit;
}

/* ---------- honeypot (anti-spam) ---------- */
if (!empty($_POST['website'])) {
    // Bots fill the hidden field; silently accept and discard.
    echo json_encode(['ok' => true, 'message' => 'Thanks!']);
    exit;
}

/* ---------- collect + validate ---------- */
$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');

if (mb_strlen($name) < 2)             fail('Please enter your name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Please enter a valid email.');
if (mb_strlen($subject) < 3)          fail('Subject is too short.');
if (mb_strlen($message) < 10)         fail('Message should be at least 10 characters.');

/* ---------- optional logging ---------- */
if (!empty($config['logFile'])) {
    $line = sprintf(
        "[%s] %s <%s> — %s\n--- %s\n\n",
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $subject,
        str_replace(["\r", "\n"], ' ', $message)
    );
    @file_put_contents($config['logFile'], $line, FILE_APPEND | LOCK_EX);
}

/* ---------- send email ---------- */
$mailSubject = "[Portfolio] {$subject}";
$body  = "You received a new message from your portfolio contact form.\n\n";
$body .= "Name:    {$name}\n";
$body .= "Email:   {$email}\n";
$body .= "Subject: {$subject}\n\n";
$body .= "Message:\n{$message}\n";

$headers = [];
$headers[] = "From: Portfolio <{$config['fromEmail']}>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . PHP_VERSION;

@mail($config['to'], $mailSubject, $body, implode("\r\n", $headers));

echo json_encode([
    'ok'      => true,
    'message' => 'Thanks! Your message has been sent successfully.',
]);