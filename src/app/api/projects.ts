// app/api/items/route.ts
import { NextRequest } from 'next/server';
// Импортируйте вашу библиотеку для работы с SQLite (например, better-sqlite3, sqlite3)
import Database from 'better-sqlite3'; // или другая библиотека

const db = new Database('path/to/your/database.db'); // Укажите путь к вашей БД

export async function GET(request: NextRequest) {
  try {
    // Пример запроса к базе данных
    const rows = db.prepare('SELECT * FROM your_items_table').all(); // Замените 'your_items_table' на реальное имя таблицы

    return Response.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return Response.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}