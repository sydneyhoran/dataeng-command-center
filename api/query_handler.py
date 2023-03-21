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
    invalid_fields = []
    for field in field_names:
        if not obj.get(field):
            invalid_fields.append(field)

    if len(invalid_fields):
        raise Exception(f"Invalid values passed for fields: {', '.join(invalid_fields)}")


def get_all_deltastreamer_jobs(session) -> List[Dict]:
    print("in get_all_deltastreamer_jobs")
    res = session.query(DeltaStreamerJob).all()
    print(f"Res {res}")
    # return res
    return [j.formatted_dict() for j in res]


def get_all_ingestion_topics(session) -> List[Dict]:
    print("in get_all_ingestion_topics")
    res = session.query(IngestionTopic).all()
    print(f"Res {res}")
    return [t.formatted_dict() for t in res]


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
    print(f"Added new job {new_job}")
    session.add(new_job)


def create_deltastreamer_job(session, args_dict: Dict[str, str]) -> List[Dict]:
    print(f"Creating new job {args_dict}")
    validate_fields(
        args_dict,
        ['job_name', 'test_phase', 'job_size', 'updated_by']
    )
    print(f"Validated fields of new job")

    job_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    insert_deltastreamer_job(session, job_dict)

    job_dict['updated_at'] = job_dict['updated_at'].isoformat()
    job_dict['created_at'] = job_dict['created_at'].isoformat()
    return [job_dict]


def insert_ingestion_topic(session, topic_dict: Dict[str, str]):
    print(f"About to add new topic {topic_dict}")
    new_topic = IngestionTopic(
        db_name=topic_dict['db_name'],
        schema_name=topic_dict['schema_name'],
        table_name=topic_dict['table_name'],
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
            'db_name',
            'schema_name',
            'table_name',
            'table_size',
            'source_ordering_field',
            'record_key',
            'partition_path_field',
            'updated_by',
        ]
    )
    topic_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    insert_ingestion_topic(session, topic_dict)

    topic_dict['updated_at'] = topic_dict['updated_at'].isoformat()
    topic_dict['created_at'] = topic_dict['created_at'].isoformat()
    return [topic_dict]
