---
title: Understanding PLC attacks
permalink: /plcs
---

<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/font.css">
<link rel="stylesheet" type="text/css" href="css/posts.css">

### What is a PLC?

PLC, or Programmable Logic Controller, is basically a computer that has been manufactured specifically to be used in industrial environments, such as metallurgical companies, oil rigs and so on.

They essentially serve as an interface between the digital and the physical, meaning you can input a certain value in the computer, it will interpret and the machine linked to it will follow its instructions post-process.

PLCs can use 2 systems that work very similarly: **SCADA** and **DCS**.
What do they have in common? They both can use **MODBUS** 

## What is MODBUS?

|NAME|DESCRIPTION|
|------|-----|
|*PLC*|Programmable Logic Controller|
|*SCADA*|Supervisory Control and Data Acquisition|
|*DCS*|Distributed Control System|
|*HMI*|Human-Machine Interface (Used in DCS and SCADA systems)|
|*MODBUS*|Communication protocol|

**MODBUS** is a communication protocol initially designed to be used along with PLCs, but along with time, it became widely used as a communication medium between electronics in general. 

When MODBUS faces the internet, it uses port **502** 

## MODBUS vulnerability

A device using MODBUS when facing the internet, has the potential to cause devastating effects on a company. The **booming** kind. 

And finding these devices is incredibly and unfortunatelly simple to do! 

|TOOL|QUERY|
|------|-----|
|*Shodan*|port:502 country:PE|
|*Censys*|(services.port=502) and location.country=\`Russia\`|
|*FOFA*|port="502" && country="US"|

A good indicator that a system uses MODBUS when using one of these queries is "**Unit ID**"

## Testing MODBUS

To test a PLC that uses MODBUS you'll need the following

|TOOL|Module|
|------|------|
|*Metasploit*|admin/scada/modicon_command|
|*[BusPwn](https://github.com/aravind0x7/BusPwn)*|NONE; Uses UI (Kinda tacky)|
|*[ModBusPloit](https://github.com/C4l1b4n/ModBusSploit)*|ANY; Designed for MODBUS|

With these, you'll be sending administrative commands directly to the PLC, which will in turn pass commands down to the machines.

## Mitigating MODBUS attacks

- Change default ports from 502 to any other port
- Regularly check the integrity of the system, checking for errors and suspicious change of values (like a turned off machine out of nowhere)
- Keep your machines in safe environments with controlled access

There isn't much to do to mitigate attacks on MODBUS except for having common sense and making sure things are as they should be.

## References
BusPwn: [https://github.com/aravind0x7/BusPwn](https://github.com/aravind0x7/BusPwn)

ModBusPloit: [https://github.com/C4l1b4n/ModBusSploit](https://github.com/C4l1b4n/ModBusSploit)

Programmable logic controller: [https://en.wikipedia.org/wiki/Programmable_logic_controller](https://en.wikipedia.org/wiki/Programmable_logic_controller)

Explaining HMI, SCADA, and PLCs, What They Do, and How They Work Together: [https://www.dosupply.com/tech/2019/02/04/explaining-hmi-scada-and-plcs-what-they-do-and-how-they-work-together/](https://www.dosupply.com/tech/2019/02/04/explaining-hmi-scada-and-plcs-what-they-do-and-how-they-work-together/)

MODBUS: [https://en.wikipedia.org/wiki/Modbus](https://en.wikipedia.org/wiki/Modbus)

Modbus Security Issues and How to Mitigate Cyber Risks: [https://www.veridify.com/modbus-security-issues-and-how-to-mitigate-cyber-risks/](https://www.veridify.com/modbus-security-issues-and-how-to-mitigate-cyber-risks/)
