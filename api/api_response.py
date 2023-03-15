import json

from flask import Response
from typing import Dict


class ApiInputException(Exception):
    pass


class ApiResponse:
    def __init__(self):
        pass

    STATUS_OK = 200
    STATUS_BAD_REQUEST = 400
    STATUS_UNAUTHORIZED = 401
    STATUS_NOT_FOUND = 404
    STATUS_SERVER_ERROR = 500

    @staticmethod
    def standard_response(status: int, payload: Dict) -> Response:
        json_data = json.dumps({
            'response': payload
        }, default=str)
        resp = Response(json_data, status=status, mimetype='application/json')
        return resp

    @staticmethod
    def success(payload) -> Response:
        return ApiResponse.standard_response(ApiResponse.STATUS_OK, payload)

    @staticmethod
    def error(status: int, error: str) -> Response:
        return ApiResponse.standard_response(status, {
            'error': error
        })

    @staticmethod
    def bad_request(error: str) -> Response:
        return ApiResponse.error(ApiResponse.STATUS_BAD_REQUEST, error)

    @staticmethod
    def not_found(error='Resource not found') -> Response:
        return ApiResponse.error(ApiResponse.STATUS_NOT_FOUND, error)

    @staticmethod
    def unauthorized(error='Not authorized to access this resource') -> Response:
        return ApiResponse.error(ApiResponse.STATUS_UNAUTHORIZED, error)

    @staticmethod
    def server_error(error='An unexpected problem occurred') -> Response:
        return ApiResponse.error(ApiResponse.STATUS_SERVER_ERROR, error)