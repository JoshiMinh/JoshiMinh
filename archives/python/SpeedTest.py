import speedtest

def perform_speed_test():
    st = speedtest.Speedtest()
    st.download()
    st.upload()
    st.results.share()
    results = st.results.dict()
    
    print(f"Download Speed: {results['download'] / 1_000_000:.2f} Mbps")
    print(f"Upload Speed: {results['upload'] / 1_000_000:.2f} Mbps")
    print(f"Ping: {results['ping']} ms")
    print(f"Server: {results['server']['name']}, {results['server']['country']}")
    print(f"Timestamp: {results['timestamp']}")
    print(f"Result URL: {results['share']}")

if __name__ == "__main__":
    perform_speed_test()