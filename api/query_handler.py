from typing import Dict, List
from sqlalchemy.sql.expression import func, and_, or_
import datetime

from api.models import (
    DeltaStreamerJob,
    IngestionTopic
)


def validate_fields(obj: Dict[str, str], field_names: List[str]):
    """
    Ensure the obj dictionary contains keys referenced in the field_names list
    """
    print("in validate_fields in query_handler.py")
    invalid_fields = []
    for field in field_names:
        if not obj.get(field):
            invalid_fields.append(field)

    if len(invalid_fields):
        raise Exception(f"Invalid values passed for fields: {', '.join(invalid_fields)}")


def get_all_deltastreamer_jobs(session) -> List[Dict]:
    print("in get_all_deltastreamer_jobs")
    res = session.query(DeltaStreamerJob).all()
    # return res
    return [j.formatted_dict() for j in res]


def get_deltastreamer_job(session, job_id) -> DeltaStreamerJob:
    print("in get_deltastreamer_job")
    res = session.query(DeltaStreamerJob).get(job_id)
    print(f"Res is {res.formatted_dict()}")
    return res.formatted_dict()


def get_all_ingestion_topics(session) -> List[Dict]:
    res = session.query(IngestionTopic).all()
    print(f"Res {res}")
    return [t.formatted_dict() for t in res]


def get_unassigned_topics(session) -> List[Dict]:
    res = session.query(IngestionTopic).filter(IngestionTopic.deltastreamer_job_id == 1)
    return [t.formatted_dict() for t in res]


def add_topic_to_job(session, job_name, topic_name):
    print(f"Adding {topic_name} to job {job_name}")
    topic = session.query(IngestionTopic).filter(
        IngestionTopic.topic_name == topic_name
    ).one()
    job = session.query(DeltaStreamerJob).filter(DeltaStreamerJob.job_name == job_name).one()
    job.ingestion_topics.append(topic)


def insert_deltastreamer_job(session, job_dict: Dict[str, str]):
    print(f"About to add new job {job_dict}")
    new_job = DeltaStreamerJob(
        job_name=job_dict['job_name'],
        test_phase=job_dict['test_phase'],
        job_size=job_dict['job_size'],
        created_at=job_dict['created_at'],
        updated_at=job_dict['updated_at'],
        updated_by=job_dict['updated_by'],
    )
    session.add(new_job)


def create_deltastreamer_job(session, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        ['job_name', 'test_phase', 'job_size', 'updated_by']
    )

    job_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    insert_deltastreamer_job(session, job_dict)
    session.commit()

    if ('topic_list' in job_dict) and (len(job_dict['topic_list']) > 0):
        for topic in job_dict['topic_list']:
            add_topic_to_job(session, job_dict['job_name'], topic)

    job_dict['updated_at'] = job_dict['updated_at'].isoformat()
    job_dict['created_at'] = job_dict['created_at'].isoformat()
    return [job_dict]


def update_deltastreamer_job(session, job_id: str, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        ['job_name', 'test_phase', 'job_size', 'updated_by']
    )

    existing_job = get_deltastreamer_job(session, job_id)

    existing_job.name = args_dict['job_name']
    existing_job.name = args_dict['job_name']
    existing_job.name = args_dict['job_name']
    existing_job.name = args_dict['job_name']


def insert_ingestion_topic(session, topic_dict: Dict[str, str]):
    new_topic = IngestionTopic(
        # db_name=topic_dict['db_name'],
        # schema_name=topic_dict['schema_name'],
        # table_name=topic_dict['table_name'],
        topic_name=topic_dict['topic_name'],
        table_size=topic_dict['table_size'],
        source_ordering_field=topic_dict['source_ordering_field'],
        record_key=topic_dict['record_key'],
        partition_path_field=topic_dict['partition_path_field'],
        created_at=topic_dict['created_at'],
        updated_at=topic_dict['updated_at'],
        updated_by=topic_dict['updated_by'],
    )
    print(f"Added new topic {new_topic}")
    session.add(new_topic)


def create_ingestion_topic(session, args_dict: Dict[str, str]) -> List[Dict]:
    print(f"Creating new topic {args_dict}")
    validate_fields(
        args_dict,
        [
            # 'db_name',
            # 'schema_name',
            # 'table_name',
            'topic_name',
            'table_size',
            'source_ordering_field',
            'record_key',
            'partition_path_field',
            'updated_by',
        ]
    )

    res = session.query(IngestionTopic).filter(
        # IngestionTopic.db_name == args_dict['db_name'],
        # IngestionTopic.schema_name == args_dict['schema_name'],
        # IngestionTopic.table_name == args_dict['table_name'],
        IngestionTopic.topic_name == args_dict['topic_name']
    ).all()

    if len(res) > 0:
        raise Exception('Topic already exists')

    topic_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    insert_ingestion_topic(session, topic_dict)
    session.commit()

    if args_dict['multi_flag'] == "false":
        new_job_name = f"deltastreamer_{args_dict['topic_name'].replace('.', '_')}"
        print(f"Creating new DeltaStreamer job {new_job_name}")
        new_job_args_dict = {
            'job_name': new_job_name,
            'test_phase': 'initial',
            'job_size': args_dict['table_size'],
            'updated_by': args_dict['updated_by']
        }
        create_deltastreamer_job(session, new_job_args_dict)
        add_topic_to_job(session, new_job_name, topic_dict['topic_name'])

    topic_dict['updated_at'] = topic_dict['updated_at'].isoformat()
    topic_dict['created_at'] = topic_dict['created_at'].isoformat()
    return [topic_dict]
