t        $names = implode(', ', array_map(fn($column) => "`$column`", $columns));
        $marks = implode(', ', array_fill(0, count($columns), '?'));
        $values = array_map(fn($column) => $data[$column], $columns);
        $stmt = $pdo->prepare("INSERT INTO `$table` ($names) VALUES ($marks)");
    }
    $stmt->execute($values);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://hinshibinshi.com', 'https://www.hinshibinshi.com', 'https://hinshibinshi.vercel.app'];
if (in_array($origin, $allowed, true) || str_ends_with($origin, '.vercel.app')) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: https://hinshibinshi.com');
}