"""Segment energy accounting and reserve sensitivity / Energia e sensibilidade."""

from copy import deepcopy

from .contract import unique_ids, validate


def analyze(scenario):
    s = validate(scenario)
    unique_ids(s["segments"])
    returns = [i for i, segment in enumerate(s["segments"]) if segment["phase"] == "return"]
    if returns != [len(s["segments"]) - 1]:
        raise ValueError("Exactly one final return is required / Exigido um único retorno final")
    effective = s["capacityWh"] * s["capacityFactor"]
    available = effective * s["stateOfChargePct"] / 100
    reserve = effective * s["reservePct"] / 100
    factor = s["uncertaintyPct"] / 100
    used, duration, records = 0.0, 0.0, []
    for segment in s["segments"]:
        moving = segment["distanceM"] / segment["speedMps"]
        elapsed = moving + segment["dwellS"]
        energy = (
            (segment["motionW"] + segment["auxW"]) * moving
            + (segment["idleW"] + segment["auxW"]) * segment["dwellS"]
        ) / 3600
        used += energy
        duration += elapsed
        records.append(
            {
                "id": segment["id"],
                "phase": segment["phase"],
                "durationS": round(elapsed, 6),
                "energyWh": round(energy, 6),
                "cumulativeWh": round(used, 6),
                "remainingUpperWh": round(available - used * (1 + factor), 6),
            }
        )
    lower, upper = used * (1 - factor), used * (1 + factor)
    margin = available - upper - reserve
    return {
        "scenarioId": s["scenarioId"],
        "source": s["source"],
        "records": records,
        "effectiveCapacityWh": round(effective, 6),
        "availableWh": round(available, 6),
        "reserveWh": round(reserve, 6),
        "nominalWh": round(used, 6),
        "lowerWh": round(lower, 6),
        "upperWh": round(upper, 6),
        "marginWh": round(margin, 6),
        "durationS": round(duration, 6),
        "feasible": margin >= -1e-9,
        "initialBelowReserve": available < reserve - 1e-9,
    }


def sensitivity(scenario, reserves, uncertainties):
    """Cartesian sensitivity table; correlated power bounds, not confidence intervals."""
    if not reserves or not uncertainties or len(reserves) * len(uncertainties) > 10000:
        raise ValueError("Supply 1..10000 combinations / Informe 1..10000 combinações")
    rows = []
    for reserve in reserves:
        for uncertainty in uncertainties:
            candidate = deepcopy(scenario)
            candidate.update(reservePct=reserve, uncertaintyPct=uncertainty)
            result = analyze(candidate)
            rows.append(
                {
                    "reservePct": reserve,
                    "uncertaintyPct": uncertainty,
                    **{
                        key: result[key] for key in ("nominalWh", "upperWh", "marginWh", "feasible")
                    },
                }
            )
    return rows
