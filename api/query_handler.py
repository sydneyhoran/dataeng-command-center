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
        if not obj.get(field) and not (field == 'sql_unload' and obj.get('is_dummy')):
            invalid_fields.append(field)

    if len(invalid_fields):
        raise Exception(f"Invalid values passed for fields: {', '.join(invalid_fields)}")


def get_all_deltastreamer_jobs(session) -> List[Dict]:
    print("in get_all_deltastreamer_jobs")
    res = session.query(DeltaStreamerJob).all()
    print(f"Res {res}")
    # return res
    return [j.formatted_dict() for j in res]


# def get_all_ingestion_topics(session) -> List[Dict]:
#     print("in get_all_ingestion_topics")
#     res = session.query(IngestionTopic).all()
#     print(f"Res {res}")
#     return [j.formatted_dict() for j in res]


def insert_deltastreamer_job(session, job_dict: Dict[str, str]):
    new_job = DeltaStreamerJob(
        job_name=job_dict['job_name'],
        test_phase=job_dict['test_phase'],
        job_size=job_dict['job_size'],
        updated_by=job_dict['updated_by'],
    )
    # new_job.ingestion_topics.extend(job_dict['ingestion_topics'])
    print(f"Adding new job {new_job}")
    session.add(new_job)


def create_deltastreamer_job(session, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        ['job_name', 'test_phase', 'job_size', 'updated_by']
    )
    job_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'modified_at': datetime.datetime.now()
    }

    insert_deltastreamer_job(session, job_dict)

    job_dict['modified_at'] = job_dict['modified_at'].isoformat()
    return [job_dict]
