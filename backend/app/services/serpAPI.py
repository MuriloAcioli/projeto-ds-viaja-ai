import httpx
import os
import re

SERPAPI_KEY = os.getenv("SERPAPI_API_KEY", "")
BASE_URL = "https://serpapi.com/search"
IATA_RE = re.compile(r"^[A-Z]{3}$")


async def buscar_voos(origem: str, destino: str, data_ida: str, data_volta: str = None) -> list[dict]:
    """Busca voos via SerpAPI (Google Flights)."""
    if not SERPAPI_KEY:
        return _mock_voos(origem, destino, data_ida, data_volta)

    async with httpx.AsyncClient() as client:
        origem_id = await _resolver_aeroporto(client, origem)
        destino_id = await _resolver_aeroporto(client, destino)

        params = {
            "engine": "google_flights",
            "departure_id": origem_id,
            "arrival_id": destino_id,
            "outbound_date": data_ida,
            "currency": "BRL",
            "hl": "pt",
            "api_key": SERPAPI_KEY,
        }
        if data_volta:
            params["return_date"] = data_volta
            params["type"] = "1"  # round trip
        else:
            params["type"] = "2"  # one way

        r = await client.get(BASE_URL, params=params, timeout=15)
        data = r.json()

    flights_results = (data.get("best_flights", []) + data.get("other_flights", []))[:5]
    if not flights_results:
        return _mock_voos(origem, destino, data_ida, data_volta)

    voos = []
    for opcao in flights_results:
        flights = opcao.get("flights") or [{}]
        trecho_principal = flights[0]
        partida = flights[0].get("departure_airport", {})
        chegada = flights[-1].get("arrival_airport", {})
        voos.append({
            "companhia": trecho_principal.get("airline", "N/A"),
            "tipo_passagem": trecho_principal.get("travel_class", ""),
            "aeronave": trecho_principal.get("airplane", ""),
            "numero_voo": trecho_principal.get("flight_number", ""),
            "logo_companhia": trecho_principal.get("airline_logo") or opcao.get("airline_logo", ""),
            "preco": opcao.get("price", 0),
            "duracao_minutos": opcao.get("total_duration", 0),
            "partida": partida.get("time", ""),
            "chegada": chegada.get("time", ""),
            "aeroporto_partida": partida.get("name", origem_id),
            "aeroporto_chegada": chegada.get("name", destino_id),
            "escalas": len(flights) - 1,
        })

    return voos


async def _resolver_aeroporto(client: httpx.AsyncClient, cidade: str) -> str:
    """Converte cidade em codigo IATA usando o autocomplete do Google Flights."""
    termo = cidade.strip()
    if IATA_RE.match(termo.upper()):
        return termo.upper()

    r = await client.get(
        BASE_URL,
        params={
            "engine": "google_flights_autocomplete",
            "q": termo,
            "exclude_regions": "true",
            "hl": "pt",
            "api_key": SERPAPI_KEY,
        },
        timeout=15,
    )
    data = r.json()

    for sugestao in data.get("suggestions", []):
        aeroportos = sugestao.get("airports") or []
        if aeroportos:
            return aeroportos[0].get("id", termo)

    return termo


async def buscar_hoteis(destino: str, checkin: str, checkout: str, adultos: int = 2) -> list[dict]:
    """Busca hotéis via SerpAPI (Google Hotels)."""
    if not SERPAPI_KEY:
        return _mock_hoteis(destino)

    async with httpx.AsyncClient() as client:
        r = await client.get(
            BASE_URL,
            params={
                "engine": "google_hotels",
                "q": f"hotéis em {destino}",
                "check_in_date": checkin,
                "check_out_date": checkout,
                "adults": adultos,
                "currency": "BRL",
                "hl": "pt",
                "api_key": SERPAPI_KEY,
            },
            timeout=15,
        )
        data = r.json()

    propriedades = data.get("properties", [])[:3]
    if not propriedades:
        return _mock_hoteis(destino)

    return [
        {
            "nome": h.get("name", "Hotel"),
            "preco_noite": h.get("rate_per_night", {}).get("lowest", "N/A"),
            "avaliacao": h.get("overall_rating", "N/A"),
            "descricao": h.get("description", ""),
        }
        for h in propriedades
    ]


def _mock_voos(origem, destino, data_ida, data_volta):
    return [
        {
            "companhia": companhia,
            "preco": preco,
            "duracao_minutos": duracao,
            "partida": f"{data_ida} {partida}",
            "chegada": f"{data_ida} {chegada}",
            "aeroporto_partida": origem,
            "aeroporto_chegada": destino,
            "escalas": escalas,
            "tipo_passagem": "Econômica",
            "aeronave": aeronave,
            "numero_voo": numero_voo,
            "logo_companhia": logo_companhia,
        }
        for companhia, preco, duracao, partida, chegada, escalas, aeronave, numero_voo, logo_companhia in [
            ("LATAM Airlines", 850, 180, "08:00", "11:00", 0, "Airbus A320", "LA 3377", "https://www.gstatic.com/flights/airline_logos/70px/LA.png"),
            ("GOL", 920, 195, "10:30", "13:45", 0, "Boeing 737", "G3 1652", "https://www.gstatic.com/flights/airline_logos/70px/G3.png"),
            ("Azul", 980, 220, "13:15", "16:55", 1, "Embraer 195", "AD 4721", "https://www.gstatic.com/flights/airline_logos/70px/AD.png"),
            ("LATAM Airlines", 1040, 210, "16:40", "20:10", 1, "Airbus A321", "LA 3498", "https://www.gstatic.com/flights/airline_logos/70px/LA.png"),
            ("GOL", 1120, 185, "19:20", "22:25", 0, "Boeing 737", "G3 2145", "https://www.gstatic.com/flights/airline_logos/70px/G3.png"),
        ]
    ]


def _mock_hoteis(destino):
    return [
        {"nome": f"Hotel Central {destino}", "preco_noite": "R$ 280", "avaliacao": 4.2, "descricao": "Hotel bem localizado no centro."},
        {"nome": f"Pousada Boa Viagem", "preco_noite": "R$ 150", "avaliacao": 4.5, "descricao": "Charmosa pousada familiar."},
        {"nome": f"Apart Hotel {destino}", "preco_noite": "R$ 320", "avaliacao": 4.0, "descricao": "Apartamentos completos com cozinha."},
    ]
