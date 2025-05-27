import socket
import ssl
import httpx
import subprocess
import tempfile
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckRequest(BaseModel):
    url: str

def check_http_status(url: str) -> str:
    try:
        resp = httpx.get(url, timeout=10)
        return "reachable" if resp.status_code == 200 else f"error ({resp.status_code})"
    except Exception:
        return "unreachable"

def check_ssl(url: str) -> bool:
    try:
        hostname = url.split("://")[1].split("/")[0]
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(5)
            s.connect((hostname, 443))
            cert = s.getpeercert()
            return True if cert else False
    except Exception:
        return False

def check_dns(url: str) -> List[str]:
    try:
        hostname = url.split("://")[1].split("/")[0]
        return list(set([ai[4][0] for ai in socket.getaddrinfo(hostname, None)]))
    except Exception:
        return []

def run_lighthouse(url: str) -> Dict[str, Any]:
    try:
        with tempfile.NamedTemporaryFile(mode="w+", suffix=".json") as report:
            cmd = [
                "lighthouse", url,
                "--output=json",
                f"--output-path={report.name}",
                "--quiet",
                "--chrome-flags=--headless"
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            report.seek(0)
            import json
            data = json.load(report)
            categories = data.get("categories", {})
            return {
                "performance": int(categories.get("performance", {}).get("score", 0) * 100),
                "accessibility": int(categories.get("accessibility", {}).get("score", 0) * 100),
                "seo": int(categories.get("seo", {}).get("score", 0) * 100)
            }
    except Exception:
        return {
            "performance": None,
            "accessibility": None,
            "seo": None
        }

@app.post("/check")
async def check_site(req: CheckRequest):
    url = req.url if req.url.startswith("http") else f"http://{req.url}"
    status = check_http_status(url)
    ssl_valid = check_ssl(url)
    dns_ips = check_dns(url)
    lighthouse = run_lighthouse(url)
    return {
        "status": status,
        "ssl": ssl_valid,
        "dns": dns_ips,
        "lighthouse": lighthouse
    }