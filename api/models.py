import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKeyConstraint, UniqueConstraint, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func

Base = declarative_base()


class DeltaStreamerJob(Base):
    __tablename__ = "scc_deltastreamer_jobs"
    # __table_args__ = {'schema': 'command_center'}

    job_name = Column(String(255), nullable=False, primary_key=True)
    test_phase = Column(String(255), nullable=False)
    job_size = Column(String(255), nullable=False)
    ingestion_topics = relationship('IngestionTopic', backref='deltastreamer_job')
    # ingestion_topics = relationship('IngestionTopic', back_populates='ingestion_topics')
    created_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_by = Column(String(255), nullable=False)

    def __repr__(self):
        return f'<Job {self.job_name}>'

    def formatted_dict(self):
        unformatted = self.__dict__

        return {
            'job_name': unformatted['job_name'],
            'test_phase': unformatted['test_phase'],
            'job_size': unformatted['job_size'],
            'created_at': unformatted['created_at'].isoformat(),
            'updated_at': unformatted['updated_at'].isoformat(),
            'updated_by': unformatted['updated_by'],
            'ingestion_topics': [t.formatted_dict() for t in self.ingestion_topics]
        }


class IngestionTopic(Base):
    __tablename__ = "scc_ingestion_topics"
    # __table_args__ = (
    #     ForeignKeyConstraint(['deltastreamer_job_name'], [DeltaStreamerJob.job_name]),
    # )

    db_name = Column(String(255), nullable=False, primary_key=True)
    schema_name = Column(String(255), nullable=False, primary_key=True)
    table_name = Column(String(255), nullable=False, primary_key=True)
    table_size = Column(String(255), nullable=False)
    source_ordering_field = Column(String(255), nullable=False)
    record_key = Column(String(255), nullable=False)
    partition_path_field = Column(String(255), nullable=False)
    timestamp_format = Column(String(255), nullable=False, default="EPOCHMICROSECONDS")
    deltastreamer_job_name = Column(String(255), ForeignKey('scc_deltastreamer_jobs.job_name'), default="unassigned_topics")
    # deltastreamer_job_id = Column(Integer, ForeignKey('scc_deltastreamer_jobs.id'), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_by = Column(String(255), nullable=False)

    def __repr__(self):
        return f'<Topic {self.db_name}.{self.schema_name}.{self.table_name}>'

    def formatted_dict(self):
        unformatted = self.__dict__

        return {
            'db_name': unformatted['db_name'],
            'schema_name': unformatted['schema_name'],
            'table_name': unformatted['table_name'],
            'topic_name': f"{unformatted['db_name']}.{unformatted['schema_name']}.{unformatted['table_name']}",
            'table_size': unformatted['table_size'],
            'source_ordering_field': unformatted['source_ordering_field'],
            'record_key': unformatted['record_key'],
            'partition_path_field': unformatted['partition_path_field'],
            'created_at': unformatted['created_at'].isoformat(),
            'updated_at': unformatted['updated_at'].isoformat(),
            'updated_by': unformatted['updated_by'],
        }
