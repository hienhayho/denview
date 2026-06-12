class DenViewError(Exception):
    pass


class APIError(DenViewError):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"HTTP {status_code}: {detail}")


class AgentNotFoundError(DenViewError):
    pass
