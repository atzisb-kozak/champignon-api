def moyenne(liste: list) -> float:
	return sum(liste)/len(liste)

from gpiozero import MCP3008
import time
import sys

pot = MCP3008(int(sys.argv[1]))
listVal = []

for i in range(1, int(sys.argv[2])):
	listVal.append(pot.value)
	time.sleep(1)

print (moyenne(listVal))