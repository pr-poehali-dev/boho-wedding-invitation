import json
import os
import psycopg2  # noqa


def handler(event: dict, context) -> dict:
    """Сохраняет ответ гостя на свадебное приглашение в базу данных."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if event.get("httpMethod") == "GET":
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, phone, attending, guests, menu, diet_note, created_at FROM rsvp ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                "id": r[0],
                "name": r[1],
                "phone": r[2],
                "attending": r[3],
                "guests": r[4],
                "menu": r[5],
                "diet_note": r[6],
                "created_at": r[7].isoformat(),
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps(result, ensure_ascii=False)}

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        attending = body.get("attending", "yes")
        guests = int(body.get("guests", 1))
        menu = body.get("menu", "meat")
        diet_note = body.get("dietNote", "").strip()

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO rsvp (name, phone, attending, guests, menu, diet_note) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (name, phone, attending, guests, menu, diet_note),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}