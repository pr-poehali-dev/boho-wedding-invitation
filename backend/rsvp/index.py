import json
import os
import psycopg2  # v3


def handler(event: dict, context) -> dict:
    """Сохраняет ответ гостя на свадебное приглашение. Каждый гость — отдельная строка в БД."""
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
            "SELECT id, submitter_name, attending, guest_name, drinks, is_primary, created_at FROM rsvp ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                "id": r[0],
                "submitter_name": r[1],
                "attending": r[2],
                "guest_name": r[3],
                "drinks": r[4],
                "is_primary": r[5],
                "created_at": r[6].isoformat(),
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps(result, ensure_ascii=False)}

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        submitter_name = body.get("name", "").strip()
        attending = body.get("attending", "yes")
        drinks = body.get("drinks", [])
        guest_name = body.get("guestName", "").strip()
        guest_drinks = body.get("guestDrinks", [])

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()

        # Строка для главного гостя
        cur.execute(
            "INSERT INTO rsvp (submitter_name, attending, guest_name, drinks, is_primary) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (submitter_name, attending, submitter_name, drinks, True),
        )
        primary_id = cur.fetchone()[0]

        # Строка для второго гостя (если есть)
        second_id = None
        if attending == "yes" and guest_name:
            cur.execute(
                "INSERT INTO rsvp (submitter_name, attending, guest_name, drinks, is_primary) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (submitter_name, attending, guest_name, guest_drinks, False),
            )
            second_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "id": primary_id, "guest_id": second_id}, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}