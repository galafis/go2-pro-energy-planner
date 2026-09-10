import unittest

from go2_energy.core import analyze, sensitivity
from test_contract import nominal


class EnergyTests(unittest.TestCase):
    def test_hand_computed_nominal(self):
        result = analyze(nominal())
        self.assertEqual(
            (result["nominalWh"], result["upperWh"], result["marginWh"]), (25.5, 30.6, 68.4)
        )

    def test_reserve_and_uncertainty_reduce_margin(self):
        rows = sensitivity(nominal(), [0, 25, 50], [0, 20, 40])
        self.assertEqual(len(rows), 9)
        for start in (0, 3, 6):
            self.assertGreater(rows[start]["marginWh"], rows[start + 2]["marginWh"])
        self.assertGreater(rows[0]["marginWh"], rows[6]["marginWh"])

    def test_zero_consumption_retains_reserve(self):
        s = nominal()
        for segment in s["segments"]:
            segment.update(motionW=0, idleW=0, auxW=0)
        result = analyze(s)
        self.assertEqual(result["nominalWh"], 0)
        self.assertEqual(result["marginWh"], result["availableWh"] - result["reserveWh"])

    def test_uncertainty_zero_collapses_interval(self):
        s = nominal()
        s["uncertaintyPct"] = 0
        result = analyze(s)
        self.assertEqual(result["lowerWh"], result["upperWh"])

    def test_exact_reserve_boundary_is_feasible(self):
        s = nominal()
        s.update(capacityWh=100, capacityFactor=1, stateOfChargePct=55.6, reservePct=25)
        self.assertTrue(analyze(s)["feasible"])
        s["stateOfChargePct"] -= 0.000001
        self.assertFalse(analyze(s)["feasible"])

    def test_missing_or_nonfinal_return_rejected(self):
        for phases in (("outbound", "task", "task"), ("return", "task", "return")):
            s = nominal()
            for segment, phase in zip(s["segments"], phases):
                segment["phase"] = phase
            with self.assertRaises(ValueError):
                analyze(s)

    def test_duplicate_segment_identifiers_rejected(self):
        s = nominal()
        s["segments"][1]["id"] = s["segments"][0]["id"]
        with self.assertRaises(ValueError):
            analyze(s)

    def test_zero_speed_and_invalid_sweep_rejected(self):
        s = nominal()
        s["segments"][0]["speedMps"] = 0
        with self.assertRaises(ValueError):
            analyze(s)
        with self.assertRaises(ValueError):
            sensitivity(nominal(), [101], [20])
