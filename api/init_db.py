import os

from models import Base

from sqlalchemy import create_engine
from typing import Dict
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect

from models import (
    DeltaStreamerJob,
    IngestionTopic
)

from dotenv import load_dotenv
load_dotenv()
db_name = os.environ.get('DB_NAME')
host = os.environ.get('DB_HOST')
user = os.environ.get('DB_USERNAME')
password = os.environ.get('DB_PASSWORD')


def get_metadb_engine(db: str):
    # conf = configparser.ConfigParser()
    if db == "command-center":
        conn_str = f"postgresql+psycopg2://{user}:{password}@{host}/{db_name}"
        return create_engine(conn_str,
                             # convert_unicode=True, echo=False, echo_pool=False, pool_recycle=3600
                             )


def init_session(db='command-center'):
    engine = get_metadb_engine(db)
    Session = sessionmaker()
    Session.configure(bind=engine)
    print("Connecting to init_session")
    if db == 'command-center':
        print("Dropping the tables")
        Base.metadata.drop_all(engine)
        print("Creating the tables")
        Base.metadata.create_all(engine)

    return Session


def create_ingestion_topic(session, topic_dict: Dict[str, str], return_result=False):
    print(f"About to create new topic {topic_dict['topic_name']}")
    new_topic = IngestionTopic(
        # db_name=topic_dict['db_name'],
        # schema_name=topic_dict['schema_name'],
        # table_name=topic_dict['table_name'],
        topic_name=topic_dict['topic_name'],
        is_active=topic_dict['is_active'],
        table_size=topic_dict['table_size'],
        source_ordering_field=topic_dict['source_ordering_field'],
        record_key=topic_dict['record_key'],
        partition_path_field=topic_dict['partition_path_field'],
        updated_by=topic_dict['updated_by'],
    )
    print(f"Adding new topic {new_topic}")
    session.add(new_topic)
    session.commit()
    print(f"ID of new topic {new_topic.id}")
    if return_result:
        return new_topic


def create_deltastreamer_job(session, job_dict: Dict[str, str], return_result=False):
    new_job = DeltaStreamerJob(
        job_name=job_dict['job_name'],
        # test_phase=job_dict['test_phase'],
        job_size=job_dict['job_size'],
        updated_by=job_dict['updated_by'],
    )
    # if job_dict['ingestion_topics'] is not None:
    #     new_job.ingestion_topics.extend(job_dict['ingestion_topics'])
    print(f"Adding new job {new_job}")
    session.add(new_job)
    session.commit()
    print(f"ID of new job {new_job.id}")
    if return_result:
        return new_job


def has_active_topics(job):
    ret = False
    for t in job.ingestion_topics:
        if t.formatted_dict().get('is_active'):
            ret = True
    return ret


def add_topic_to_job(session, job_id, topic_id):
    print(f"Adding topic {topic_id} to job {job_id}")
    job = session.query(DeltaStreamerJob).get(job_id)
    topic = session.query(IngestionTopic).get(topic_id)
    job.ingestion_topics.append(topic)
    session.commit()

    # print(f"About to check if we need to change {job.is_active}")
    # print(f"Job has_active_topics (before): {job.formatted_dict().get('has_active_topics')}")
    # job.is_active = has_active_topics(job)
    # session.commit()
    # print(f"Job has_active_topics (after): {job.is_active}")
    # session.commit()


Session = init_session()

sql_session = Session()

job1 = create_deltastreamer_job(
    session=sql_session,
    job_dict={
        "job_name": "unassigned_topics",
        # "test_phase": "complete",
        "job_size": "xs",
        "updated_by": "sydney",
    },
    return_result=True
)

job2 = create_deltastreamer_job(
    session=sql_session,
    job_dict={
        "job_name": "deltastreamer_identity_history_account_activities",
        # "test_phase": "complete",
        "job_size": "lg",
        "updated_by": "sydney",
    },
    return_result=True
)
# sql_session.commit()
print(job1.id)
print(job2.id)

topic1 = create_ingestion_topic(
    session=sql_session,
    topic_dict={
        # "db_name": "identity",
        # "schema_name": "public_history",
        # "table_name": "account_activities",
        "topic_name": "identity.public_history.account_activities",
        "is_active": True,
        "table_size": "lg",
        "source_ordering_field": "updated_at",
        "record_key": "id",
        "partition_path_field": "inserted_at",
        "deltastreamer_job_name": None,
        "updated_by": "sydney",
    },
    return_result=True
)

topic2 = create_ingestion_topic(
    session=sql_session,
    topic_dict={
        # "db_name": "identity",
        # "schema_name": "public_history",
        # "table_name": "nobody",
        "topic_name": "identity.public_history.nobody",
        "is_active": False,
        "table_size": "lg",
        "source_ordering_field": "updated_at",
        "record_key": "id",
        "partition_path_field": "inserted_at",
        "deltastreamer_job_name": None,
        "updated_by": "sydney"
    },
    return_result=True
)
# sql_session.commit()
print(topic1.id)
print(topic2.id)

# ingestion_topics_job_1 = sql_session.query(IngestionTopic).get(topic1.id)

# print(f"Topic: {ingestion_topics_job_1.formatted_dict()}")

# print(f"Topics: {[t.formatted_dict() for t in ingestion_topics_job_1]}")

add_topic_to_job(sql_session, job2.id, topic1.id)
#
# sql_session.commit()

# job_1 = sql_session.query(DeltaStreamerJob).get("deltastreamer_identity_history_account_activities")
# print(job_1.formatted_dict())
#
# all_jobs = sql_session.query(DeltaStreamerJob).all()
#
# print(all_jobs)
#
# for job in all_jobs:
#     print(job.job_name)
#     for topic in job.ingestion_topics:
#         print(f"{topic.formatted_dict()['topic_name']}")


records = sql_session.query(DeltaStreamerJob).all()

print("\nResults of all jobs\n")

for record in records:
    formatted_record = record.formatted_dict()
    print(formatted_record)
    print(formatted_record['ingestion_topics'])
    print()
    # for topic in record.formatted_dict()['ingestion_topics']:
    #     print(f"{topic.formatted_dict()}")

# import os
# import psycopg2
# from dotenv import load_dotenv
#
# load_dotenv()
# db_name = os.environ.get('DB_NAME')
# host = os.environ.get('DB_HOST')
# user = os.environ.get('DB_USERNAME')
# password = os.environ.get('DB_PASSWORD')
#
# conn = psycopg2.connect(host=host,
#                         database=db_name,
#                         user=user,
#                         password=password)
#
#
# # Open a cursor to perform database operations
# cur = conn.cursor()
#
# # Execute a command: this creates a new table
# # cur.execute('DROP TABLE IF EXISTS deltastreamer_jobs;')
# # cur.execute('CREATE TABLE deltastreamer_jobs (id serial PRIMARY KEY,'
# #                                  'job_name varchar (150) NOT NULL,'
# #                                  'table_nm varchar (150) NOT NULL,'
# #                                  'test_phase varchar (150) NOT NULL,'
# #                                  'job_size varchar (150) NOT NULL,'
# #                                  'source_ordering_field varchar (150) NOT NULL,'
# #                                  'record_key varchar (150) NOT NULL,'
# #                                  'partition_path_field varchar (150) NOT NULL,'
# #                                  'date_added date DEFAULT CURRENT_TIMESTAMP);'
# #                                  )
#
# # Insert data into the table
#
# cur.execute('INSERT INTO deltastreamer_jobs_sqlalchemy (job_nm, db_nm, schema_nm, table_nm, test_phase, job_size,'
#             'source_ordering_field, record_key, partition_path_field, updated_by)'
#             'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
#             ('deltastreamer_identity_history_account_activities',
#              'identity',
#              'public_history',
#              'account_activities',
#              'complete',
#              'lg',
#              'updated_at',
#              'id',
#              'inserted_at',
#              'sydney')
#             )
#
# conn.commit()
#
# cur.close()
# conn.close()
