from gpiozero import PWMOutputDevice
import time
from signal import signal, SIGINT
import sys
from sys import exit
 
def handler(signal_received, frame):
    print('')
    print('SIGINT or CTRL-C detected. Exiting gracefully')
    exit(0)
 
def main():
    p = PWMOutputDevice(pin=int(sys.argv[1]), initial_value=int(sys.argv[2]),frequency=50)
    p.on()
    time.sleep(int(sys.argv[3]))
    p.off()
    p.close()
 
 
if __name__ == '__main__':
    signal(SIGINT, handler)
    main()