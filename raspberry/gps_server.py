import csv
import socket

from utils import setup_custom_logger
from dotenv import dotenv_values

public_config = dotenv_values("./../.env.raspberry")
secret_config = dotenv_values("./../.env.raspberry.private")

CLIENT_SECRET_KEY = secret_config["gps_client_key"]

SERVER_ADDRESS = (public_config["server_ip"], int(public_config["server_port"]))
LOG_FILE = public_config["data_csv"]
logger = setup_custom_logger("server")

BUFFER_SIZE = 4096


def check_key(key):
    """
    check if given message is from expected client or not
    :param key: input key
    :return: true if client send key. o.w false
    """
    return key == CLIENT_SECRET_KEY


def update_csv(data):
    """
    update csv with receive data

    :param data: input data
    :return:
    """

    # check if update message is sent
    if data.startswith("UPDATE"):
        _, key, lat, lon, timestamp = data.split(" ")
        # check if msg contains correct key
        if check_key(key):
            with open(LOG_FILE, 'a', newline='') as csvfile:
                wr = csv.writer(csvfile, delimiter=',',
                                quotechar='|', quoting=csv.QUOTE_MINIMAL)
                wr.writerow([lat, lon, timestamp])


def run():
    """
    run server on given address and wait for gps client data
    :return:
    """
    # create a tcp socket and wait for connection
    s_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s_socket.bind(SERVER_ADDRESS)

    while True:
        data, adr = s_socket.recvfrom(BUFFER_SIZE)
        logger.info("RECEIVE: " + data.decode())
        update_csv(data.decode())


run()
