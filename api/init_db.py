import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_name = os.environ.get('DB_NAME')
host = os.environ.get('DB_HOST')
user = os.environ.get('DB_USERNAME')
password = os.environ.get('DB_PASSWORD')

conn = psycopg2.connect(host=host,
                        database=db_name,
                        user=user,
                        password=password)


# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a command: this creates a new table
# cur.execute('DROP TABLE IF EXISTS deltastreamer_jobs;')
# cur.execute('CREATE TABLE deltastreamer_jobs (id serial PRIMARY KEY,'
#                                  'job_name varchar (150) NOT NULL,'
#                                  'table_nm varchar (150) NOT NULL,'
#                                  'test_phase varchar (150) NOT NULL,'
#                                  'job_size varchar (150) NOT NULL,'
#                                  'source_ordering_field varchar (150) NOT NULL,'
#                                  'record_key varchar (150) NOT NULL,'
#                                  'partition_path_field varchar (150) NOT NULL,'
#                                  'date_added date DEFAULT CURRENT_TIMESTAMP);'
#                                  )

# Insert data into the table

cur.execute('INSERT INTO deltastreamer_jobs_sqlalchemy (job_nm, db_nm, schema_nm, table_nm, test_phase, job_size,'
            'source_ordering_field, record_key, partition_path_field, updated_by)'
            'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
            ('deltastreamer_identity_history_account_activities',
             'identity',
             'public_history',
             'account_activities',
             'complete',
             'lg',
             'updated_at',
             'id',
             'inserted_at',
             'sydney')
            )

conn.commit()

cur.close()
conn.close()
