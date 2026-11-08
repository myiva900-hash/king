package com.mutiganda.yvanvpn.ui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.net.VpnService
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mutiganda.yvanvpn.data.ConnectionMode
import com.mutiganda.yvanvpn.data.ServerCatalog
import com.mutiganda.yvanvpn.data.VpnServer
import com.mutiganda.yvanvpn.service.MyvVpnService

class MainActivity : ComponentActivity() {

    private var pendingServerHost = "104.21.58.120"
    private var pendingServerPort = 80

    private val vpnPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            launchVpnService()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VpnMainScreen(
                onConnectClick = { host, port ->
                    pendingServerHost = host
                    pendingServerPort = port
                    prepareAndStartVpn()
                },
                onDisconnectClick = {
                    stopVpnService()
                },
                onWhatsAppClick = {
                    openWhatsApp("250787699523")
                }
            )
        }
    }

    private fun prepareAndStartVpn() {
        val intent = VpnService.prepare(this)
        if (intent != null) {
            vpnPermissionLauncher.launch(intent)
        } else {
            launchVpnService()
        }
    }

    private fun launchVpnService() {
        val intent = Intent(this, MyvVpnService::class.java).apply {
            action = MyvVpnService.ACTION_START
            putExtra(MyvVpnService.EXTRA_SERVER_HOST, pendingServerHost)
            putExtra(MyvVpnService.EXTRA_SERVER_PORT, pendingServerPort)
        }
        startService(intent)
    }

    private fun stopVpnService() {
        val intent = Intent(this, MyvVpnService::class.java).apply {
            action = MyvVpnService.ACTION_STOP
        }
        startService(intent)
    }

    private fun openWhatsApp(phoneNumber: String) {
        try {
            val url = "https://wa.me/$phoneNumber"
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VpnMainScreen(
    onConnectClick: (String, Int) -> Unit,
    onDisconnectClick: () -> Unit,
    onWhatsAppClick: () -> Unit
) {
    var isConnected by remember { mutableStateOf(false) }
    var selectedServer by remember { mutableStateOf(ServerCatalog.servers.first()) }
    var selectedPort by remember { mutableStateOf(80) }
    var connectionMode by remember { mutableStateOf(ConnectionMode.DIRECT) }
    var customSetupEnabled by remember { mutableStateOf(false) }

    val blueGradient = Brush.horizontalGradient(
        colors = listOf(Color(0xFF1E3A8A), Color(0xFF1D4ED8), Color(0xFF3730A3))
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Mutiganda Yvan VPN",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 18.sp
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF1E3A8A)
                )
            )
        },
        containerColor = Color(0xFFF8FAFC)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Ticker / Rwanda VIP Status Banner
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "🇷🇼", fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Rwanda VPN Core: Rwamagana · Gisozi · Kayonza Active",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1D4ED8)
                    )
                }
            }

            // Main VPN Box
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Server Selector
                    Text(
                        text = "SELECT SERVER",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Surface(
                        color = Color(0xFFF1F5F9),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = selectedServer.flag, fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = selectedServer.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF0F172A)
                                )
                                Text(
                                    text = "${selectedServer.country} · ${selectedServer.ping}ms",
                                    fontSize = 11.sp,
                                    color = Color(0xFF10B981)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Traffic stats pill
                    Surface(
                        color = Color(0xFFF1F5F9),
                        shape = CircleShape,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "↑ 0 B   |   ↓ 0 B",
                                fontSize = 13.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1E293B)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Connection mode
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "CONNECTION MODE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF64748B)
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "CUSTOM SETUP",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1D4ED8)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Switch(
                                checked = customSetupEnabled,
                                onCheckedChange = { customSetupEnabled = it }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // START / STOP Button
                    Button(
                        onClick = {
                            if (isConnected) {
                                onDisconnectClick()
                                isConnected = false
                            } else {
                                onConnectClick(selectedServer.host, selectedPort)
                                isConnected = true
                            }
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isConnected) Color(0xFFE11D48) else Color(0xFF1D4ED8)
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = if (isConnected) "STOP TUNNEL" else "START VPN",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 15.sp,
                            color = Color.White,
                            letterSpacing = 1.sp
                        )
                    }
                }
            }

            // Creator & WhatsApp Card (Mutiganda Yvan - 0787699523)
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF1E3A8A)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "MYV", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Mutiganda Yvan",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = "🇷🇼", fontSize = 14.sp)
                            }
                            Text(
                                text = "Lead Developer & Founder",
                                color = Color(0xFF93C5FD),
                                fontSize = 12.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = onWhatsAppClick,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "WhatsApp: 0787699523",
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}
