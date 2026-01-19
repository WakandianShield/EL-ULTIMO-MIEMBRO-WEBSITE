import mysql.connector

db = mysql.connector.connect(
    host="caboose.proxy.rlwy.net",
    port=28548,
    user="root",
    password="qIIABAoYMqMlskVIvweTndtcJsGrNufE",
    database="railway",
    charset="utf8mb4",
    ssl_disabled=False
)

cursor = db.cursor()

print("Conectado a Railway MySQL")

while True:
    sql = input("mysql> ")
    if sql.lower() in ["exit", "quit"]:
        break
    try:
        cursor.execute(sql)
        if cursor.with_rows:
            for row in cursor.fetchall():
                print(row)
        else:
            db.commit()
            print("OK")
    except Exception as e:
        print("ERROR:", e)
