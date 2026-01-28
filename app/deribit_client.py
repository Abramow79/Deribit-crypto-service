import aiohttp

DERIBIT_URL = "https://www.deribit.com/api/v2/public/get_index_price"


async def get_index_price(ticker: str) -> float:
    async with aiohttp.ClientSession() as session:
        async with session.get(
            DERIBIT_URL,
            params={"index_name": f"{ticker.lower()}_usd"}
        ) as response:
            data = await response.json()
            return data["result"]["index_price"]
