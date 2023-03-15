# import datetime
from sqlalchemy import Column, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from sqlalchemy.dialects.postgresql import UUID
# import uuid

Base = declarative_base()


class DeltaStreamerJob(Base):
    __tablename__ = "deltastreamer_jobs_sqlalchemy"
    # __table_args__ = {'schema': 'command_center'}

    # id = Column(Integer, nullable=False, primary_key=True)
    # version = Column(Integer, primary_key=True)
    job_nm = Column(String(255), nullable=False)
    db_nm = Column(String(255), nullable=False, primary_key=True)
    schema_nm = Column(String(255), nullable=False, primary_key=True)
    table_nm = Column(String(255), nullable=False, primary_key=True)
    test_phase = Column(String(255), nullable=False)
    job_size = Column(String(255), nullable=False)
    source_ordering_field = Column(String(255), nullable=False)
    record_key = Column(String(255), nullable=False)
    partition_path_field = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.current_timestamp())
    updated_by = Column(String(255), nullable=False)

    def __repr__(self):
        return f'<Job {self.db_nm}.{self.schema_nm}.{self.table_nm}>'

    def formatted_dict(self):
        unformatted = self.__dict__

        return {
            'job_name': unformatted['job_nm'],
            'db_name': unformatted['db_nm'],
            'schema_name': unformatted['schema_nm'],
            'table_name': unformatted['table_nm'],
            'test_phase': unformatted['test_phase'],
            'job_size': unformatted['job_size'],
            'source_ordering_field': unformatted['source_ordering_field'],
            'record_key': unformatted['record_key'],
            'partition_path_field': unformatted['partition_path_field'],
            'created_at': unformatted['created_at'].isoformat(),
            'updated_at': unformatted['updated_at'].isoformat(),
            'updated_by': unformatted['updated_by'],
        }
