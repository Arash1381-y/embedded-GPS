import logging
import sys
from datetime import datetime


class ColoredFormatter(logging.Formatter):
    COLORS = {
        'RESET': '\033[0m',
        'RED': '\033[91m',
        'YELLOW': '\033[93m',
        'BLUE': '\033[94m',
    }

    def format(self, record):
        log_message = super().format(record)
        if record.levelno == logging.INFO:
            return f"{self.COLORS['BLUE']}{log_message}{self.COLORS['RESET']}"
        elif record.levelno == logging.WARNING:
            return f"{self.COLORS['YELLOW']}{log_message}{self.COLORS['RESET']}"
        elif record.levelno == logging.ERROR:
            return f"{self.COLORS['RED']}{log_message}{self.COLORS['RESET']}"
        else:
            return log_message


def setup_custom_logger(name):
    formatter = ColoredFormatter(fmt='%(asctime)s [_%(levelname)s_]: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)

    return logger


def get_timestamp():
    dt_string = datetime.now().isoformat()
    return dt_string
