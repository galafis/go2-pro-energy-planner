"""Bilingual offline command line / Linha de comando offline bilíngue."""

import argparse
import sqlite3
import sys
from pathlib import Path

from .contract import read_json, write_csv, write_json
from .core import analyze


def parser():
    root = argparse.ArgumentParser(description="Offline analysis / Análise offline")
    commands = root.add_subparsers(dest="command", required=True)
    command = commands.add_parser("analyze", help="Analyze JSON / Analisar JSON")
    command.add_argument("input", help="Scenario JSON / JSON do cenário")
    command.add_argument("output", help="Report JSON / JSON do relatório")
    command = commands.add_parser(
        "sweep", help="Reserve and uncertainty table / Tabela de reserva e incerteza"
    )
    command.add_argument("input")
    command.add_argument("output")
    command.add_argument("--reserves", type=float, nargs="+", default=[10, 25, 40])
    command.add_argument("--uncertainties", type=float, nargs="+", default=[0, 20, 40])
    return root


def execute(args):
    if args.command == "analyze":
        write_json(args.output, analyze(read_json(args.input)))
    elif args.command == "sweep":
        from .core import sensitivity

        rows = sensitivity(read_json(args.input), args.reserves, args.uncertainties)
        write_csv(args.output, rows, rows[0].keys())


def main(argv=None):
    args = parser().parse_args(argv)
    try:
        if hasattr(args, "output"):
            for name in ("input", "csv", "database"):
                if (
                    hasattr(args, name)
                    and Path(getattr(args, name)).resolve() == Path(args.output).resolve()
                ):
                    raise ValueError(
                        "Input and output must differ / Entrada e saída devem ser diferentes"
                    )
        execute(args)
        return 0
    except (ValueError, OSError, sqlite3.Error) as error:
        print(f"Analysis failed / Falha na análise: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
