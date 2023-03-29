import configparser
import os

from api import query_handler
from api.api_response import ApiResponse
from api.models import Base

from flask import Response, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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
        return create_engine(conn_str)


def init_session(db='command-center'):
    engine = get_metadb_engine(db)
    Session = sessionmaker()
    Session.configure(bind=engine)
    print("Connecting to init_session")
    if db == 'command-center':
        Base.metadata.create_all(engine)

    return Session


def healthy() -> Response:
    return ApiResponse.success({})


def deltastreamer_jobs(Session) -> Response:
    session = Session()
    response = ApiResponse.server_error()
    print("In deltastreamer_jobs")

    try:
        if request.method == 'GET':
            jobs = query_handler.get_all_deltastreamer_jobs(session)
            response = ApiResponse.success(jobs)
        elif request.method == 'POST':
            created = query_handler.create_deltastreamer_job(session, request.get_json())
            session.commit()
            response = ApiResponse.success(created)
    except Exception as e:
        response = ApiResponse.bad_request(str(e))

    session.close()
    return response


def ingestion_topics(Session) -> Response:
    session = Session()
    response = ApiResponse.server_error()

    try:
        if request.method == 'GET':
            jobs = query_handler.get_all_ingestion_topics(session)
            response = ApiResponse.success(jobs)
        elif request.method == 'POST':
            created = query_handler.create_ingestion_topic(session, request.get_json())
            session.commit()
            response = ApiResponse.success(created)
    except Exception as e:
        response = ApiResponse.bad_request(str(e))

    session.close()
    return response


def unassigned_topics(Session) -> Response:
    session = Session()
    response = ApiResponse.server_error()

    try:
        if request.method == 'GET':
            topics = query_handler.get_unassigned_topics(session)
            response = ApiResponse.success(topics)
    except Exception as e:
        response = ApiResponse.bad_request(str(e))

    session.close()
    return response


def ingestion_topic(db_name: str, schema_name: str, table_name: str, Session) -> Response:
    session = Session()
    response = ApiResponse.server_error()

    try:
        print(f"Hello from ingestion_topic in api_helper for {db_name} and {schema_name} and {table_name}")
        # if request.method == 'GET':
        #     history = query_handler.get_model_history(session, db_name, schema_name, table_name)
        #     response = ApiResponse.success(history)
        # elif request.method == 'POST':
        #     updated = query_handler.update_model(session, db_name, schema_name, table_name, request.get_json())
        #     session.commit()
        #     response = ApiResponse.success(updated)
        # elif request.method == 'DELETE':
        #     deleted = query_handler.delete_model(session, db_name, schema_name, table_name)
        #     session.commit()
        #     response = ApiResponse.success(deleted)
    except Exception as e:
        response = ApiResponse.bad_request(str(e))

    session.close()
    return response