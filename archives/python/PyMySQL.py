import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="plsremoteconnect123@"
)

mycursor = mydb.cursor()
mycursor.execute("SHOW DATABASES")

print("List of databases:")
for x in mycursor:
    print(x[0])

mydb.close()