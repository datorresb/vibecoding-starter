# tempconv — Temperature Conversion CLI

## Overview

A Python CLI tool that converts temperatures between Celsius, Fahrenheit, and Kelvin. Ships as a single-package module with a clear separation between pure conversion logic and CLI presentation.

## Module Structure

```
tempconv/
├── __init__.py          # Package marker, exports public API
├── convert.py           # Pure conversion functions (no I/O)
├── cli.py               # argparse CLI entry point
└── __main__.py          # Enables `python -m tempconv`
tests/
├── test_convert.py      # Unit tests for conversion functions
└── test_cli.py          # Integration tests for CLI parsing & output
```

**Two modules, two responsibilities:**

| Module | Responsibility |
|--------|---------------|
| `convert.py` | Pure math — all 6 conversion functions, no side effects |
| `cli.py` | User interface — argument parsing, validation, output formatting |

## Public API — `convert.py`

All functions accept and return `float`. Each is a pure function with no side effects.

```python
def c_to_f(temp: float) -> float:
    """Celsius → Fahrenheit."""

def f_to_c(temp: float) -> float:
    """Fahrenheit → Celsius."""

def c_to_k(temp: float) -> float:
    """Celsius → Kelvin."""

def k_to_c(temp: float) -> float:
    """Kelvin → Celsius."""

def f_to_k(temp: float) -> float:
    """Fahrenheit → Kelvin."""

def k_to_f(temp: float) -> float:
    """Kelvin → Fahrenheit."""
```

### Dispatch Helper

A single dispatcher avoids a sprawling if/else chain in the CLI layer:

```python
CONVERSIONS: dict[tuple[str, str], Callable[[float], float]] = {
    ("celsius", "fahrenheit"): c_to_f,
    ("fahrenheit", "celsius"): f_to_c,
    ("celsius", "kelvin"):     c_to_k,
    ("kelvin", "celsius"):     k_to_c,
    ("fahrenheit", "kelvin"):  f_to_k,
    ("kelvin", "fahrenheit"):  k_to_f,
}

def convert(temp: float, from_unit: str, to_unit: str) -> float:
    """Convert temp between any two supported units.

    Args:
        temp: The temperature value.
        from_unit: Canonical unit name ("celsius", "fahrenheit", "kelvin").
        to_unit: Canonical unit name.

    Returns:
        Converted temperature, rounded to 2 decimal places.

    Raises:
        ValueError: If from_unit == to_unit or either unit is unsupported.
    """
```

## Public API — `cli.py`

```python
ABBREVIATIONS: dict[str, str] = {
    "c": "celsius",
    "f": "fahrenheit",
    "k": "kelvin",
    "celsius": "celsius",
    "fahrenheit": "fahrenheit",
    "kelvin": "kelvin",
}

def resolve_unit(raw: str) -> str:
    """Normalize a unit string (case-insensitive) to its canonical name.

    Raises:
        SystemExit: via argparse error if unit is unrecognised.
    """

def build_parser() -> argparse.ArgumentParser:
    """Construct and return the argparse parser."""

def main(argv: list[str] | None = None) -> None:
    """Entry point. Parses args, runs conversion, prints result."""
```

## CLI Interface

```
usage: tempconv [-h] [--from UNIT] [--to UNIT] temperature

positional arguments:
  temperature        Temperature value to convert (numeric)

options:
  -h, --help         show this help message and exit
  --from UNIT, -f UNIT   Source unit: celsius|fahrenheit|kelvin (or c|f|k)
  --to UNIT, -t UNIT     Target unit: celsius|fahrenheit|kelvin (or c|f|k)
```

### Example Usage

```bash
# Full names
$ tempconv 100 --from celsius --to fahrenheit
212.00

# Abbreviations
$ tempconv 100 -f c -t f
212.00

# Kelvin
$ tempconv 0 --from c --to k
273.15

# Same-unit (identity — returns error)
$ tempconv 50 --from c --to c
error: --from and --to must be different units

# Invalid input
$ tempconv abc --from c --to f
error: argument temperature: invalid float value: 'abc'

# Below absolute zero
$ tempconv -500 --from c --to k
error: -500.0°C is below absolute zero (-273.15°C)
```

### Output Format

- Success: prints a single line with the result rounded to 2 decimal places, e.g. `212.00`
- Errors: prints `error: <message>` to stderr, exits with code 1

## `__main__.py`

```python
from tempconv.cli import main

main()
```

This enables:

```bash
python -m tempconv 100 --from c --to f
```

## Edge Cases

| Case | Behaviour |
|------|-----------|
| Non-numeric temperature | argparse rejects with `invalid float value` |
| Unknown unit string | argparse rejects with `invalid choice` |
| `--from` and `--to` are the same | Print error, exit 1 |
| Below absolute zero | Print error with the violated limit, exit 1 |
| Extremely large values | Allow — Python floats handle this; no artificial cap |
| Mixed case (`Celsius`, `KELVIN`) | Normalise via `.lower()` before lookup |
| Missing `--from` or `--to` | argparse enforces required; prints usage |

### Absolute Zero Limits

| Unit | Absolute Zero |
|------|---------------|
| Celsius | −273.15 |
| Fahrenheit | −459.67 |
| Kelvin | 0 |

Validation happens in `convert()` before the math runs.

## Conversion Formulas

| Function | Formula |
|----------|---------|
| `c_to_f` | $F = C \times \frac{9}{5} + 32$ |
| `f_to_c` | $C = (F - 32) \times \frac{5}{9}$ |
| `c_to_k` | $K = C + 273.15$ |
| `k_to_c` | $C = K - 273.15$ |
| `f_to_k` | $K = (F - 32) \times \frac{5}{9} + 273.15$ |
| `k_to_f` | $F = (K - 273.15) \times \frac{9}{5} + 32$ |

## Testing Strategy

### Unit Tests (`test_convert.py`)

- Each of the 6 conversion functions tested with known values (e.g. 0°C → 32°F, 100°C → 212°F, 0K → −273.15°C)
- `convert()` dispatcher tested for all 6 pairs
- `ValueError` raised for same-unit conversion
- `ValueError` raised for below-absolute-zero inputs
- Rounding to 2 decimal places verified

### CLI Tests (`test_cli.py`)

- Full names and abbreviations produce correct output
- Invalid temperature string → exit 1
- Missing required args → exit 1
- Same `--from`/`--to` → error message on stderr
- Below absolute zero → error message on stderr

## Dependencies

**None.** Standard library only (`argparse`, `sys`).
