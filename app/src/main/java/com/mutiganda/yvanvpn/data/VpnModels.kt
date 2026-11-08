package com.mutiganda.yvanvpn.data

data class VpnServer(
    val id: String,
    val name: String,
    val country: String,
    val countryCode: String,
    val flag: String,
    val host: String,
    val ping: Int,
    val load: Int
)

enum class ConnectionMode(val title: String, val subtitle: String) {
    DIRECT("Direct Connection", "Rwanda & Global Internet"),
    CUSTOM_PAYLOAD("Custom Payload", "TCP Injection Mode"),
    CUSTOM_SNI("Custom SNI", "SSL / TLS Mode"),
    DNSTT("DNSTT Tunnel", "DNS Tunneling Mode")
}

object ServerCatalog {
    val servers = listOf(
        VpnServer(
            id = "rw-gisozi",
            name = "Gisozi VIP Node 01",
            country = "Rwanda (Kigali)",
            countryCode = "RW",
            flag = "🇷🇼",
            host = "gisozi.kigali.myv-vpn.rw",
            ping = 7,
            load = 28
        ),
        VpnServer(
            id = "rw-rwamagana",
            name = "Rwamagana High-Speed 02",
            country = "Rwanda (East)",
            countryCode = "RW",
            flag = "🇷🇼",
            host = "rwamagana.east.myv-vpn.rw",
            ping = 9,
            load = 32
        ),
        VpnServer(
            id = "rw-kayonza",
            name = "Kayonza Ultra-Tunnel 03",
            country = "Rwanda (East)",
            countryCode = "RW",
            flag = "🇷🇼",
            host = "kayonza.east.myv-vpn.rw",
            ping = 11,
            load = 35
        ),
        VpnServer(
            id = "de-frankfurt",
            name = "Frankfurt VIP Core",
            country = "Germany",
            countryCode = "DE",
            flag = "🇩🇪",
            host = "de1.myv-vpn.net",
            ping = 68,
            load = 45
        ),
        VpnServer(
            id = "us-east",
            name = "New York Low-Latency",
            country = "United States",
            countryCode = "US",
            flag = "🇺🇸",
            host = "us1.myv-vpn.net",
            ping = 95,
            load = 50
        )
    )
}
