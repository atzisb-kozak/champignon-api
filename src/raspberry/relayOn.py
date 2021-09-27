#import RPi.GPIO as GPIO
from gpiozero import OutputDevice
import time
import sys

#GPIO.setmode(GPIO.BOARD)

print(int(sys.argv[1]))

#GPIO.setup(int(sys.argv[1]), GPIO.OUT)
#GPIO.output(int(sys.argv[1]), GPIO.LOW)

relay = OutputDevice(pin=int(sys.argv[1]), active_high=False)
relay.on()
