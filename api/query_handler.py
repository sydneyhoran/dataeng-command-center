from typing import Dict, List
from sqlalchemy.sql.expression import func, and_, or_

from api.models import (
    DeltaStreamerJob
)


def get_all_deltastreamer_jobs(session) -> List[Dict]:
    print("in get_all_deltastreamer_jobs")
    # subqry = session.query(
    #     DeltaStreamerJob.db_nm,
    #     DeltaStreamerJob.schema_nm,
    #     DeltaStreamerJob.table_nm
    # ).group_by(
    #     DeltaStreamerJob.db_nm,
    #     DeltaStreamerJob.schema_nm,
    #     DeltaStreamerJob.table_nm
    # ).subquery()
    #
    # res = session.query(DeltaStreamerJob).join(
    #     subqry,
    #     and_(
    #         DeltaStreamerJob.db_nm == subqry.c.db_nm,
    #         DeltaStreamerJob.table_nm == subqry.c.table_nm,
    #         DeltaStreamerJob.schema_nm == subqry.c.schema_nm
    #     )
    # ).all()

    res = session.query(DeltaStreamerJob).all()
    print(f"Res {res}")
    return [j.formatted_dict() for j in res]
