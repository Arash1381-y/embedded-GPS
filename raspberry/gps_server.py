import csv
import socket

from utils import setup_custom_logger

SERVER_ADDRESS = ('193.163.200.14', 9999)
logger = setup_custom_logger('server')


def update_csv(data):
    if data.startswith("UPDATE"):
        lat, lon, timestamp = data.split(" ")[1:]
        with open('../gps.csv', 'a', newline='') as csvfile:
            wr = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
            wr.writerow([lat, lon, timestamp])


def run():
    s_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s_socket.bind(SERVER_ADDRESS)

    while True:
        data, adr = s_socket.recvfrom(4096)
        logger.info("RECEIVE: " + data.decode())
        update_csv(data.decode())


#
run()
