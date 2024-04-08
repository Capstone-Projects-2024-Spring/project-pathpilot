import sqlite3

conn = sqlite3.connect('myproject/db.sqlite3')
print("opened database successfully")
cursor = conn.execute("SELECT * FROM accounts")
for row in cursor:
    print("Account id = ", row[0])
    print("Username = ", row[1])
    print("Email = ", row[2])
    print("Password = ", row[3])

cursor = conn.execute("SELECT location_id,location_name FROM locations")
for row in cursor:
    print("location_id = ", row[0])
    print("location_name = ", row[1])
conn.close()