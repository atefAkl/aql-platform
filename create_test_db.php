<?php

try {
    $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=postgres', 'postgres', 'root');
    $pdo->exec('CREATE DATABASE landlord_test_db');
    echo "LANDLORD_TEST_DB_CREATED_SUCCESSFULLY\n";
} catch (Throwable $e) {
    if (str_contains($e->getMessage(), 'already exists')) {
        echo "LANDLORD_TEST_DB_ALREADY_EXISTS\n";
    } else {
        echo 'ERROR: '.$e->getMessage()."\n";
    }
}
