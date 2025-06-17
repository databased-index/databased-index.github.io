---
title: DICOM/PACS Vulnerability Testing - Databased Index
permalink: /med_DPVT
---

<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/font.css">
<link rel="stylesheet" type="text/css" href="css/posts.css">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="This post explains what DICOM and PACS are and how threat actors take advantage of it, as well as its consequences if not secured properly.">
<meta property="og:title" content="DICOM/PACS Vulnerability Testing">
<meta property="og:type" content="website">
<meta property="og:url" content="https://databased-index.github.io/med_DPVT">
<meta property="og:image" content="https://databased-index.github.io/images/cabbit.jpg">
<meta property="og:description" content="This post explains what DICOM and PACS are and how threat actors take advantage of it, as well as its consequences if not secured properly.">

##### ⚠️The information in here should be used responsibly and tests carried with prior and propper authorization of the system masters⚠️


### What is DICOM and PACS
DICOM stands for Digital Imaging and Communication in Medicine, which is a protocol used to transfer files.

PACS, or Picture Archiving and Communication System is a databased used to store those files tranferred by DICOM.

They use the following ports:

|PACS|DICOM|
|------|-----|
|80|104|
|8080|11112|
|8443|-|
|9443|-|

### Risks Posed by Exposure of DICOM & PACS
The risks vary on the threat actor's motivations, but the main ones are
- Patient Information Exposure
- Data Manipulation
- Ransomware
- Data Loss
- Denial of Service

### Finding PACS servers

To find these, you can just use shodan, fofa or censys with the following queries:

|SHODAN.IO|CENSYS.IO|FOFA.INFO|
|---------|------|----|
|country:```COUNTRY_CODE``` port:```104 or 11112``` DICOM| services.extended_service_name:DICOM and services.port:```104 or 11112```|"DICOM" && protocol="dicom" && country="```COUNTRY_CODE```"|

These will look for PACS that are available to connect to. You can also replace the DICOM ports for the web ones (as listed in the ports section) since PACS also uses web services to facilitate access and not need the usage of viewers/toolkits.

But in case you still wanna use a viewer, here's a list:

|VIEWER|OS|TYPE|
|-----|-----|--|
|[Horos](https://horosproject.org/)|MacOS|GUI|
|[DCMTK](https://dicom.offis.de/)|All|CLI|
|[Orthanc](https://www.orthanc-server.com/)|Windows & Linux|CLI & GUI|
|[DCM4CHE](https://web.dcm4che.org/)|All|CLI|


### Testing with viewers
Once everything is set up accordingly, enter the target host and port and use a ```C-GET``` request on the patient level with the query ```Patient-ID="*"```. 

The query will retrieve pretty much all medical records.

### Testing on the web 
Web based PACS can be relatively more difficult than using a viewer since in some cases it may involve login pages as well, but for every will there's a way. 

Usually medical systems use Windows, which can be vulnerable to an authentication bypass via SQLi, since it uses MSSQL.

These systems can also have another flaw when the sysadmin forgets to setup a password or the password is too weak, such as the following:

```
admin:admin
admin:password
pacs:pacs
pacs:password
orthanc:orthanc
```

### Avoiding attackers from stealing medical records 
To avoid a threat actor from accessing unauthorized medical records, preventing lawsuits from happening or ruining your hospital's reputation, you can follow this little list of simple steps.

- Set actually strong passwords / Don't forget to reset default credentials.
- Make sure that the OS and framework you're using is up to date.
- Don't use the default ports for DICOM and PACS or just don't use web based PACS at all.
