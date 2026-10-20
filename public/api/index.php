<?php

declare(strict_types=1);

session_set_cookie_params([
    'lifetime' => 86400,
    'path'     => '/',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'None',
]);
session_start();
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://hinshibinshi.com', 'https://www.hinshibinshi.com'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: https://hinshibinshi.com');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(['error' => 'API is not configured. Create api/config.php first.'], 500);
}

$config = require $configFile;
try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (Throwable $error) {
    respond(['error' => 'Database connection failed: ' . $error->getMessage()], 500);
}

$entity = $_GET['entity'] ?? '';
$action = $_GET['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?: [];

if ($entity === 'Auth') {
    handleAuth($action, $body, $config);
}

$tables = [
    'Product' => 'products',
    'Category' => 'categories',
    'Order' => 'orders',
    'Customer' => 'customers',
    'Lead' => 'leads',
];
if (!isset($tables[$entity])) respond(['error' => 'Unknown entity.'], 404);
$table = $tables[$entity];

if ($action === 'list' && $method === 'GET') {
    $limit = min(max((int)($_GET['limit'] ?? 200), 1), 500);
    $orderBy = $_GET['orderBy'] ?? 'created_date';
    $allowedOrder = ['id', 'name', 'title', 'created_date', 'updated_date', 'price', 'status'];
    $sort = in_array(ltrim($orderBy, '-'), $allowedOrder, true) ? ltrim($orderBy, '-') : 'created_date';
    $direction = str_starts_with($orderBy, '-') ? 'DESC' : 'ASC';
    $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY `$sort` $direction LIMIT $limit");
    respond(['data' => array_map('decodeRow', $stmt->fetchAll())]);
}

if ($action === 'get' && $method === 'GET') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) respond(['error' => 'Record not found.'], 404);
    respond(['data' => decodeRow($row)]);
}

if ($entity !== 'Order' && $entity !== 'Lead' && $entity !== 'Customer' && !isAdmin()) {
    respond(['error' => 'Admin authentication required.'], 401);
}

if ($action === 'create' && $method === 'POST') {
    $id = $body['id'] ?? strtolower($entity) . '_' . bin2hex(random_bytes(5));
    $now = date('Y-m-d H:i:s');
    $body['id'] = $id;
    $body['created_date'] = $body['created_date'] ?? $now;
    if (!in_array($table, ['categories', 'leads'], true)) {
        $body['updated_date'] = $body['updated_date'] ?? $now;
    }
    saveRow($pdo, $table, $body, false);
    respond(['data' => decodeRow(fetchRow($pdo, $table, $id))], 201);
}

if ($action === 'update' && $method === 'PATCH') {
    $id = $_GET['id'] ?? $body['id'] ?? '';
    if (!$id) respond(['error' => 'Missing record id.'], 400);
    $body['updated_date'] = date('Y-m-d H:i:s');
    saveRow($pdo, $table, $body, true, $id);
    respond(['data' => decodeRow(fetchRow($pdo, $table, $id))]);
}

if ($action === 'delete' && $method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    respond(['ok' => true]);
}

respond(['error' => 'Unsupported request.'], 405);

function handleAuth(string $action, array $body, array $config): void
{
    if ($action === 'login') {
        $validEmail = strtolower(trim((string)($config['admin_email'] ?? '')));
        $validPassword = (string)($config['admin_password'] ?? '');
        if (strtolower(trim((string)($body['email'] ?? ''))) !== $validEmail || (string)($body['password'] ?? '') !== $validPassword) {
            respond(['error' => 'Invalid email or password.'], 401);
        }
        $_SESSION['admin'] = true;
        respond(['data' => ['id' => 'hb-admin', 'email' => $validEmail, 'full_name' => 'Hinshi Binshi Admin', 'role' => 'admin']]);
    }
    if ($action === 'me') respond(['data' => isAdmin() ? ['id' => 'hb-admin', 'role' => 'admin'] : null]);
    if ($action === 'logout') { session_destroy(); respond(['ok' => true]); }
    respond(['error' => 'Unsupported auth action.'], 405);
}

function isAdmin(): bool { return !empty($_SESSION['admin']); }
function respond(array $payload, int $status = 200): never { http_response_code($status); echo json_encode($payload, JSON_UNESCAPED_UNICODE); exit; }
function decodeRow(array $row): array {
    foreach (['images', 'items'] as $key) if (isset($row[$key]) && is_string($row[$key])) $row[$key] = json_decode($row[$key], true) ?? [];
    foreach (['featured'] as $key) if (isset($row[$key])) $row[$key] = (bool)$row[$key];
    return $row;
}
function fetchRow(PDO $pdo, string $table, string $id): array { $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ? LIMIT 1"); $stmt->execute([$id]); return $stmt->fetch() ?: []; }
function saveRow(PDO $pdo, string $table, array $data, bool $update, string $id = ''): void {
    foreach (['images', 'items'] as $key) if (isset($data[$key]) && is_array($data[$key])) $data[$key] = json_encode($data[$key], JSON_UNESCAPED_UNICODE);
    $columns = array_keys($data);
    $columns = array_values(array_filter($columns, fn($column) => preg_match('/^[a-z_]+$/', $column)));
    if ($update) {
        $columns = array_values(array_filter($columns, fn($column) => $column !== 'id'));
        $set = implode(', ', array_map(fn($column) => "`$column` = ?", $columns));
        $values = array_map(fn($column) => $data[$column], $columns);
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE `$table` SET $set WHERE id = ?");
    } else {
        $names = implode(', ', array_map(fn($column) => "`$column`", $columns));
        $marks = implode(', ', array_fill(0, count($columns), '?'));
        $values = array_map(fn($column) => $data[$column], $columns);
        $stmt = $pdo->prepare("INSERT INTO `$table` ($names) VALUES ($marks)");
    }
    $stmt->execute($values);
}
