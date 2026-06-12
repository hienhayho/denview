import fire


class CLI:
    def serve(
        self,
        host: str = "0.0.0.0",
        port: int = 8000,
        reload: bool = False,
    ) -> None:
        """Start the DenView server."""
        import uvicorn
        uvicorn.run("denview.main:app", host=host, port=port, reload=reload)


def main() -> None:
    fire.Fire(CLI)


if __name__ == "__main__":
    main()
