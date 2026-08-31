package com.aquasafari.backend.boat;

/** Physical condition of the boat — maps to the EER diagram's "Condition" attribute. */
public enum BoatCondition {
    GOOD,
    NEEDS_MAINTENANCE,
    UNDER_REPAIR,
    OUT_OF_SERVICE
}
