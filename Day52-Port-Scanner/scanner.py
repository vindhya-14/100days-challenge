import socket
import threading
from queue import Queue

# Number of threads for faster scanning
NUM_THREADS = 100

# Queue to store ports
queue = Queue()
open_ports = []

def port_scan(host, port):
    """Try connecting to a port on given host."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)  # timeout for connection
        result = sock.connect_ex((host, port))
        if result == 0:
            print(f"[+] Port {port} is OPEN")
            open_ports.append(port)
        sock.close()
    except Exception as e:
        pass

def worker(host):
    """Thread worker function."""
    while not queue.empty():
        port = queue.get()
        port_scan(host, port)
        queue.task_done()

def run_scanner(host, port_range=(1, 1024)):
    print(f"\n🔎 Scanning host {host} from port {port_range[0]} to {port_range[1]}...\n")
    
    for port in range(port_range[0], port_range[1] + 1):
        queue.put(port)

    threads = []
    for _ in range(NUM_THREADS):
        t = threading.Thread(target=worker, args=(host,))
        t.start()
        threads.append(t)

    queue.join()

    print("\n Scan complete!")
    if open_ports:
        print("Open ports:", open_ports)
    else:
        print("No open ports found.")

if __name__ == "__main__":
    target = input("Enter target host (IP or domain): ").strip()
    try:
        ip = socket.gethostbyname(target)  # resolve domain to IP
        run_scanner(ip, (1, 1024))  # scan common range
    except socket.gaierror:
        print("❌ Invalid hostname. Please try again.")
