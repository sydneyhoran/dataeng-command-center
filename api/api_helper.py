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
    print(f"{db_name=}")
    print(f"{host=}")
    print(f"{user=}")
    print(f"{password=}")
    if db == "command_center":
        conn_str = f"postgresql+psycopg2://{user}:{password}@{host}/{db_name}"
        return create_engine(conn_str,
                             # convert_unicode=True, echo=False, echo_pool=False, pool_recycle=3600
                             )


def init_session(db='command_center'):
    engine = get_metadb_engine(db)
    Session = sessionmaker()
    Session.configure(bind=engine)
    print("Connecting to init_session")
    if db == 'command_center':
        Base.metadata.create_all(engine)

    return Session


def deltastreamer_jobs(Session) -> Response:
    session = Session()
    response = ApiResponse.server_error()
    print("Getting deltastreamer_jobs")

    try:
        if request.method == 'GET':
            jobs = query_handler.get_all_deltastreamer_jobs(session)
            response = ApiResponse.success(jobs)
        # elif request.method == 'POST':
        #     created = query_handler.create_model(session, _get_username(), request.get_json())
        #     session.commit()
        #     response = ApiResponse.success(created)
    except Exception as e:
        response = ApiResponse.bad_request(str(e))

    session.close()
    return response
