from __future__ import annotations

import argparse
import json
import sys

from rag import service_from_env


def main() -> int:
    parser = argparse.ArgumentParser(description="Search approved interview evidence")
    parser.add_argument("question")
    parser.add_argument("--role-family", required=True)
    parser.add_argument("--limit", type=int, default=5, choices=range(1, 21))
    args = parser.parse_args()
    try:
        service = service_from_env()
        service.top_k = args.limit
        results = service.search(args.question, args.role_family)
        print(json.dumps([r.public_source() for r in results], indent=2))
        return 0
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
