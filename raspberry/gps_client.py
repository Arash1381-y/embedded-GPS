import socket
import time

import schedule
import serial
from dotenv import dotenv_values
from pynmeagps import NMEAReader, NMEAMessage

from utils import setup_custom_logger, get_timestamp

public_config = dotenv_values("./../.env.raspberry")
secret_config = dotenv_values("./../.env.raspberry.private")

CLIENT_SECRET_KEY = secret_config["gps_client_key"]

SERIAL = public_config["serial_port"]
PERIPHERAL_BAUD_RATE = (int(public_config["gps_module_baud_rate"]))

DIST_THRESHOLD = 1e-4
SERVER_ADDRESS = (public_config["server_ip"], int(public_config["server_port"]))

# current location
CL = (None, None)

# create a NMEA reader with checksum validator
stream = serial.Serial(SERIAL, baudrate=PERIPHERAL_BAUD_RATE)
nmr = NMEAReader(stream, validate=0x01)

logger = setup_custom_logger('gps')
d_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


def send_data(lat: float, lon: float, timestamp: str):
    """
    send latitude and longitude

    :param lat: latitude
    :param lon: longitude
    :param timestamp: global timestamp
    :return: None
    """
    logger.info("POST UPDATE")
    msg = f"UPDATE {CLIENT_SECRET_KEY} {timestamp} {lat} {lon}"
    d_socket.sendto(msg.encode(), SERVER_ADDRESS)


def is_any_loc():
    """check if CL is initialized"""
    return CL[0] is not None and CL[1] is not None


def get_dist(lat: float, lon: float):
    """
    compute dist of given point with current address

    :param lat: latitude
    :param lon: longitude
    :return: CL dist from given point
    """

    assert type(CL[0]) is float and type(CL[1]) is float

    if is_any_loc():
        return ((lat - CL[0]) ** 2 + (lon - CL[1]) ** 2) ** 1 / 2

    return -1


def get_location():
    """
    get location by parsing serial input

    :return:
    """
    global CL
    try:
        for (raw_data, parsed_data) in nmr:
            msg: NMEAMessage = parsed_data
            pdt = msg.msgID
            if pdt == 'RMC':
                lat = None
                lon = None
                if msg.lat != "":
                    lat = float(msg.lat)
                if msg.lon != "":
                    lon = float(msg.lon)
                if msg.lon and msg.lat:
                    logger.info("latitude : " + str(lat) + " longitude : " + str(lon))
                    return lat, lon, get_timestamp()
    except AttributeError:
        pass


def update_location(force_update: bool = False):
    """
    get current location and send it to the server

    :param force_update: if true no need to check the dist threshold
    """
    if not force_update:
        logger.info("Check location...")
    else:
        logger.info("Update location...")

    global CL
    lat, lon, timestamp = get_location()
    if not lat or not lon:
        return

    d = get_dist(lat, lon)
    if d > DIST_THRESHOLD or d < 0 or force_update:
        send_data(lat, lon, timestamp)

    # update location
    CL = (lat, lon)


# check every 15 sec for new location
schedule.every(15).seconds.do(update_location)
# send an update every minute
schedule.every().minutes.do(update_location, force=True)


def run():
    while True:
        schedule.run_pending()
        time.sleep(1)


run()
