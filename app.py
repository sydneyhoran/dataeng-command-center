import os
# import psycopg2
from flask import Flask, render_template
from api import api_helper
import logging

from dotenv import load_dotenv

# init session/engine objects
Session = api_helper.init_session('command-center')


# Needed to generate https uris automatically
class ReverseProxied(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):

        if os.getenv('DEPLOYMENT_PROJECT', '').startswith('command'):
            scheme = environ.get('HTTP_X_FORWARDED_PROTO')
        else:
            scheme = "https"

        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)


app = Flask(__name__)
app.wsgi_app = ReverseProxied(app.wsgi_app)

logger = logging.getLogger()  # or __name__ for current module
logger.setLevel(logging.DEBUG)

app.logger.setLevel(logging.DEBUG)

# load_dotenv()
# db_name = os.environ.get('DB_NAME')
# host = os.environ.get('DB_HOST')
# user = os.environ.get('DB_USERNAME')
# password = os.environ.get('DB_PASSWORD')


# def get_db_connection():
#     conn = psycopg2.connect(host=host,
#                             database=db_name,
#                             user=user,
#                             password=password)
#     return conn


# @app.route('/')
# def index():
#     conn = get_db_connection()
#     try:
#         postgres_connection = get_db_connection()
#         cur = postgres_connection.cursor()
#     except Exception as e:
#         print(f"could not connect to postgres: {e}")
#     else:
#         print("connected to postgres db")
#         cur.execute('SELECT * FROM deltastreamer_jobs;')
#         jobs = cur.fetchall()
#         cur.close()
#         conn.close()
#         print(jobs)
#         return render_template('command-center/index.html', jobs=jobs)

@app.route('/')
def command_center():
    return render_template('command-center/index.html', admin=False)


# catch all routes under edit for react to handle
@app.route('/edit')
def new_table():
    return render_template('command-center/index.html')


@app.route('/edit/<path:topic>')
def edit_topic(topic):
    return render_template('command-center/index.html')


@app.route('/edit/<path:job>')
def edit_job(job):
    return render_template('command-center/index.html')


@app.route('/api/v1/deltastreamer_jobs', methods=['GET', 'POST'])
def deltastreamer_jobs():
    return api_helper.deltastreamer_jobs(Session)


@app.route('/api/v1/ingestion_topics', methods=['GET', 'POST'])
def ingestion_topics():
    return api_helper.ingestion_topics(Session)


@app.route('/api/v1/unassigned_topics', methods=['GET'])
def unassigned_topics():
    print("in unassigned_topics in app.py")
    return api_helper.unassigned_topics(Session)


@app.route('/api/v1/ingestion_topics/<topic_id>', methods=['GET', 'POST', 'DELETE'])
def ingestion_topic(topic_id):
    print("In ingestion_topic in app.py")
    return api_helper.ingestion_topic(topic_id, Session)


@app.route('/api/v1/deltastreamer_jobs/<job_id>', methods=['GET', 'POST', 'DELETE'])
def deltastreamer_job(job_id):
    print(f"In deltastreamer_job in app.py, job_id is {job_id}")
    return api_helper.deltastreamer_job(job_id, Session)
