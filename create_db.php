<?php

$dsn = 'pgsql:host=127.0.0.1;port=5432;dbname=postgres';
$pdo = new PDO($dsn, 'postgres', 'root');
$pdo->exec('CREATE DATABASE landlord_test_db');
echo "DB created.\n";
