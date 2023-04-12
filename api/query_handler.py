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
        if obj.get(field) is None:
            invalid_fields.append(field)

    if len(invalid_fields):
        raise Exception(f"Invalid values passed for fields: {', '.join(invalid_fields)}")


def get_all_deltastreamer_jobs(session) -> List[Dict]:
    print("in get_all_deltastreamer_jobs")
    res = session.query(DeltaStreamerJob).all()
    return [j.formatted_dict() for j in res]


def get_deltastreamer_job(session, job_id) -> DeltaStreamerJob:
    print("in get_deltastreamer_job")
    res = session.query(DeltaStreamerJob).get(job_id)
    return res.formatted_dict()


def get_all_ingestion_topics(session) -> List[Dict]:
    res = session.query(IngestionTopic).all()
    print(f"Res {res}")
    return [t.formatted_dict() for t in res]


def get_ingestion_topic(session, topic_id) -> DeltaStreamerJob:
    print("in get_ingestion_topic")
    res = session.query(IngestionTopic).get(topic_id)
    return res.formatted_dict()


def get_unassigned_topics(session) -> List[Dict]:
    res = session.query(IngestionTopic).filter(IngestionTopic.deltastreamer_job_id == 1)
    return [t.formatted_dict() for t in res]


def add_topic_to_job(session, job_id, topic_id):
    job = session.query(DeltaStreamerJob).get(job_id)
    topic = session.query(IngestionTopic).get(topic_id)
    job.ingestion_topics.append(topic)
    # session.commit()


def sync_ingestion_topics(session, existing_job, new_topic_list):
    existing_topic_names = [t.topic_name for t in existing_job.ingestion_topics]
    all_topics = set(existing_topic_names).union(set(new_topic_list))
    to_keep = set(existing_topic_names).intersection(set(new_topic_list))
    to_remove = set(existing_topic_names) - set(new_topic_list)
    to_add = list(all_topics - to_keep - to_remove)
    for topic in to_remove:
        topic_to_modify = session.query(IngestionTopic).filter(IngestionTopic.topic_name == topic).one()
        topic_to_modify.deltastreamer_job_id = 1
        topic_to_modify.is_active = False
        session.commit()
    for topic in to_add:
        topic_to_add = session.query(IngestionTopic).filter(IngestionTopic.topic_name == topic).one()
        add_topic_to_job(session, existing_job.id, topic_to_add.id)
        session.commit()


def set_topics_active_status(job, value):
    for topic in job.ingestion_topics:
        topic.is_active = value


def insert_deltastreamer_job(session, job_dict: Dict[str, str], return_result=False):
    new_job = DeltaStreamerJob(
        job_name=job_dict['job_name'],
        # is_active=job_dict['is_active'],
        job_size=job_dict['job_size'],
        created_at=job_dict['created_at'],
        updated_at=job_dict['updated_at'],
        updated_by=job_dict['updated_by'],
    )
    session.add(new_job)
    if return_result:
        return new_job


def create_deltastreamer_job(session, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        ['job_name', 'job_size', 'updated_by']
    )

    job_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    new_job = insert_deltastreamer_job(session, job_dict, return_result=True)

    if ('topic_list' in job_dict) and (len(job_dict['topic_list']) > 0):
        session.commit()
        for topic in job_dict['topic_list']:
            topic_to_add = session.query(IngestionTopic).filter(IngestionTopic.topic_name == topic).one()
            add_topic_to_job(session, new_job.id, topic_to_add.id)
            session.commit()

    job_dict['updated_at'] = job_dict['updated_at'].isoformat()
    job_dict['created_at'] = job_dict['created_at'].isoformat()
    return [job_dict]


def update_deltastreamer_job(session, job_id: str, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        ['job_name', 'job_size', 'updated_by']
    )

    existing_job = session.query(DeltaStreamerJob).get(job_id)

    existing_job.job_name = args_dict['job_name']
    # existing_job.is_active = args_dict['is_active']
    existing_job.job_size = args_dict['job_size']
    existing_job.updated_by = args_dict['updated_by']
    existing_job.updated_at = datetime.datetime.now()

    if 'topic_list' in args_dict:
        sync_ingestion_topics(session, existing_job, args_dict['topic_list'])

    # check if we need to turn off or on all jobs
    if existing_job.check_active_topics() and (args_dict['is_active'] is False):
        session.commit()
        print("Need to flip topics to false")
        set_topics_active_status(existing_job, False)
    elif not existing_job.check_active_topics() and (args_dict['is_active'] is True):
        session.commit()
        print("Need to flip topics to true")
        set_topics_active_status(existing_job, True)

    session.commit()

    return [args_dict]


def delete_deltastreamer_job(session, job_id: str) -> bool:
    job = session.query(DeltaStreamerJob).get(job_id)
    # orphan all connected topics to unassigned_topics "job" (future: prompt if cascade delete or orphan)
    for topic in job.ingestion_topics:
        topic.deltastreamer_job_id = 1
    session.commit()
    session.delete(job)
    return True


def insert_ingestion_topic(session, topic_dict: Dict[str, str], return_result=True):
    new_topic = IngestionTopic(
        topic_name=topic_dict['topic_name'],
        is_active=topic_dict['is_active'],
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
    if return_result:
        return new_topic


def create_ingestion_topic(session, args_dict: Dict[str, str]) -> List[Dict]:
    print(f"Creating new topic {args_dict}")
    validate_fields(
        args_dict,
        [
            'topic_name',
            'table_size',
            'is_active',
            'source_ordering_field',
            'record_key',
            'partition_path_field',
            'updated_by',
        ]
    )

    res = session.query(IngestionTopic).filter(
        IngestionTopic.topic_name == args_dict['topic_name']
    ).all()

    if len(res) > 0:
        raise Exception('Topic already exists')

    topic_dict = {
        **args_dict,
        'created_at': datetime.datetime.now(),
        'updated_at': datetime.datetime.now()
    }

    new_topic = insert_ingestion_topic(session, topic_dict, return_result=True)
    session.commit()

    if args_dict['multi_flag'] == "false":
        new_job_name = f"deltastreamer_{args_dict['topic_name'].replace('.', '_')}"
        print(f"Creating new DeltaStreamer job {new_job_name}")
        new_job_dict = {
            'job_name': new_job_name,
            # 'is_active': args_dict['is_active'],
            'job_size': args_dict['table_size'],
            'updated_by': args_dict['updated_by']
        }
        job_dict = {
            **new_job_dict,
            'created_at': datetime.datetime.now(),
            'updated_at': datetime.datetime.now()
        }
        print("About to make new job")
        new_job = insert_deltastreamer_job(session, job_dict, return_result=True)
        session.commit()
        print("About to add new topic to new job")
        add_topic_to_job(session, new_job.id, new_topic.id)

    topic_dict['updated_at'] = topic_dict['updated_at'].isoformat()
    topic_dict['created_at'] = topic_dict['created_at'].isoformat()
    return [topic_dict]


def update_ingestion_topic(session, topic_id: str, args_dict: Dict[str, str]) -> List[Dict]:
    validate_fields(
        args_dict,
        [
            'topic_name',
            'table_size',
            'is_active',
            'source_ordering_field',
            'record_key',
            'partition_path_field',
            'updated_by',
         ]
    )

    existing_topic = session.query(IngestionTopic).get(topic_id)

    existing_topic.topic_name = args_dict['topic_name']
    existing_topic.table_size = args_dict['table_size']
    existing_topic.is_active = args_dict['is_active']
    existing_topic.source_ordering_field = args_dict['source_ordering_field']
    existing_topic.record_key = args_dict['record_key']
    existing_topic.partition_path_field = args_dict['partition_path_field']
    existing_topic.updated_by = args_dict['updated_by']
    existing_topic.updated_at = datetime.datetime.now()

    return [args_dict]


def delete_ingestion_topic(session, topic_id: str) -> bool:
    topic = session.query(IngestionTopic).get(topic_id)
    session.delete(topic)
    return True
