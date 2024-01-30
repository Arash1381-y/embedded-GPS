import socket
import serial
import schedule
import time
from pynmeagps import NMEAReader, NMEAMessage
from utils import setup_custom_logger, get_timestamp

SERIAL = '/dev/ttyAMA0'
PERIPHERAL_BAUD_RATE = 9600
UPDATE_INTERVAL = 20
DIST_THRESHOLD = 1e-4
SERVER_ADDRESS = ('193.163.200.14', 9999)
CL = (None, None)

stream = serial.Serial(SERIAL, baudrate=9600)
nmr = NMEAReader(stream, validate=0x01)

logger = setup_custom_logger('gps')
d_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


def post_data(lat, lon, timestamp):
    logger.info("POST UPDATE")
    msg = f"UPDATE {timestamp} {lat} {lon}"
    d_socket.sendto(msg.encode(), SERVER_ADDRESS)


def is_any_loc():
    return CL[0] is not None and CL[1] is not None


def get_dist(lat, lon):
    if is_any_loc():
        return ((lat - CL[0]) ** 2 + (lon - CL[1]) ** 2) ** 1 / 2

    return -1


def get_location():
    global CL
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


def update_location(force: bool = False):
    if not force:
        logger.info("Check location...")
    else:
        logger.info("Update location...")

    global CL
    lat, lon, timestamp = get_location()
    if not lat or not lon:
        return

    d = get_dist(lat, lon)
    if d > DIST_THRESHOLD or d < 0:
        post_data(lat, lon, timestamp)
    elif force:
        post_data(lat, lon, timestamp)

    CL = (lat, lon)


schedule.every(15).seconds.do(update_location)
schedule.every().minutes.do(update_location, force=True)


def run():
    while True:
        schedule.run_pending()
        time.sleep(1)


run()
