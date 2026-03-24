"""
Keyword-based intent classifier.
Classifies user query into one of: "NEC", "WATTMONK", or "GENERAL"
"""


def classify_intent(query: str) -> str:
    """
    Classifies the intent of the query.

    Returns:
        "NEC"      - if query is about NEC electrical code
        "WATTMONK" - if query is about Wattmonk company/services
        "GENERAL"  - for everything else
    """
    q = query.lower()

    # NEC keywords — electrical code, standards, regulations
    nec_keywords = [
        "nec", "national electrical code", "article", "section",
        "690", "705", "250", "230", "240", "310", "300",
        "ampere", "ampacity", "voltage", "voc", "isc", "grounding",
        "bonding", "overcurrent", "ground fault", "arc fault",
        "rapid shutdown", "disconnect", "conductor", "wiring",
        "raceway", "conduit", "gauge", "awg", "busbar", "breaker",
        "inverter code", "code compliance", "electrical code",
        "interconnection code", "pto code", "utility code",
        "permit code", "inspection", "code requirement"
    ]

    # Wattmonk keywords — company, services, tools
    wattmonk_keywords = [
        "wattmonk", "plan set", "planset", "permit plan",
        "zippy", "proposal", "site survey", "survey app",
        "pto application", "permission to operate",
        "pe review", "engineering review", "structural review",
        "electrical review", "permitting support",
        "ahj", "authority having jurisdiction", "turnaround",
        "solar design", "design service", "wattmonk service",
        "how does wattmonk", "what is wattmonk", "wattmonk tool",
        "wattmonk team", "wattmonk product", "wattmonk app",
        "solar warrior", "wattmonk portal", "wattmonk platform",
        "wattmonk cost", "wattmonk price", "wattmonk benefit"
    ]

    # Check NEC first
    for keyword in nec_keywords:
        if keyword in q:
            return "NEC"

    # Check Wattmonk
    for keyword in wattmonk_keywords:
        if keyword in q:
            return "WATTMONK"

    # Default to general
    return "GENERAL"
