import getpass

import mysql.connector

def list_databases(host, user, password):
    try:
        mydb = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        mycursor = mydb.cursor()
        mycursor.execute("SHOW DATABASES")
        print("List of databases:")
        for db in mycursor:
            print(db[0])
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'mydb' in locals() and mydb.is_connected():
            mydb.close()

if __name__ == "__main__":
    host = input("Enter MySQL host (default: localhost): ") or "localhost"
    user = input("Enter MySQL user (default: root): ") or "root"
    password = getpass.getpass("Enter MySQL password: ")
    list_databases(host, user, password)